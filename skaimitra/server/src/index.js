import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import pool from './db.js'
import { authenticate, authenticateOptional, requireAdmin } from './authMiddleware.js'
import { firebaseAuth } from './firebaseAdmin.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 5000)
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      event_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      description TEXT NOT NULL,
      event_date DATE NOT NULL,
      event_time TIME NULL,
      event_type VARCHAR(64) NOT NULL DEFAULT 'Reminder',
      created_by INT NOT NULL,
      audience_roles JSON NOT NULL,
      class_sections JSON NOT NULL,
      visibility_type ENUM('teacher', 'student', 'school') NOT NULL DEFAULT 'school',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_calendar_events_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE CASCADE
    )
  `)
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch {
    res.status(500).json({ ok: false, error: 'MySQL connection failed.' })
  }
})

app.post('/api/auth/sync-user', authenticate, async (req, res) => {
  const firebaseUid = req.authUser.uid
  const email = (req.authUser.email || '').trim().toLowerCase()
  const fullName = req.authUser.name || email.split('@')[0] || 'User'

  try {
    const [existingRows] = await pool.query('SELECT * FROM users WHERE firebase_uid = ? LIMIT 1', [firebaseUid])

    if (existingRows.length > 0) {
      const user = existingRows[0]
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Account is inactive. Contact admin.' })
      }
      await pool.query('UPDATE users SET full_name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [fullName, email, user.id])
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [user.id])
      return res.json({ user: serializeUser(rows[0]) })
    }

    const [emailRows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    if (emailRows.length === 0) {
      return res.status(403).json({ error: 'User not found. Ask admin to add your account first.' })
    }

    const userByEmail = emailRows[0]
    if (userByEmail.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive. Contact admin.' })
    }

    await pool.query(
      'UPDATE users SET firebase_uid = ?, full_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [firebaseUid, fullName, userByEmail.id],
    )
    const [updatedRows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userByEmail.id])
    return res.json({ user: serializeUser(updatedRows[0]) })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to sync user.'
    return res.status(500).json({ error: msg })
  }
})

app.get('/api/users', authenticate, requireAdmin, async (req, res) => {
  const search = String(req.query.search || '').trim()
  const role = String(req.query.role || '').trim().toLowerCase()

  const where = []
  const values = []

  if (search) {
    where.push('(full_name LIKE ? OR email LIKE ?)')
    values.push(`%${search}%`, `%${search}%`)
  }

  if (role) {
    where.push('role = ?')
    values.push(role)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  try {
    const [rows] = await pool.query(
      `SELECT id, firebase_uid, full_name, email, phone, role, class_grade, status
       FROM users ${whereSql}
       ORDER BY id DESC`,
      values,
    )

    res.json({ users: rows.map(serializeUser) })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch users.'
    res.status(500).json({ error: msg })
  }
})

app.post('/api/users', authenticate, requireAdmin, async (req, res) => {
  const { fullName, email, phone, role, classGrade, status } = req.body

  if (!fullName || !email || !role || !status) {
    return res.status(400).json({ error: 'fullName, email, role, and status are required.' })
  }

  const normalizedRole = String(role).toLowerCase()
  const normalizedStatus = String(status).toLowerCase()

  if (!['admin', 'teacher', 'student', 'parent'].includes(normalizedRole)) {
    return res.status(400).json({ error: 'Invalid role.' })
  }

  if (!['active', 'inactive'].includes(normalizedStatus)) {
    return res.status(400).json({ error: 'Invalid status.' })
  }

  const normalizedEmail = String(email).trim().toLowerCase()
  const defaultPassword = process.env.DEFAULT_NEW_USER_PASSWORD || 'Welcome@123'
  let firebaseUid = ''

  try {
    try {
      const existingFirebaseUser = await firebaseAuth.getUserByEmail(normalizedEmail)
      firebaseUid = existingFirebaseUser.uid
      await firebaseAuth.updateUser(firebaseUid, {
        displayName: String(fullName).trim(),
        disabled: normalizedStatus === 'inactive',
      })
    } catch (error) {
      const firebaseErr = error
      if (firebaseErr.code === 'auth/user-not-found') {
        const createdFirebaseUser = await firebaseAuth.createUser({
          email: normalizedEmail,
          password: defaultPassword,
          displayName: String(fullName).trim(),
          disabled: normalizedStatus === 'inactive',
        })
        firebaseUid = createdFirebaseUser.uid
      } else {
        throw error
      }
    }

    const [insertResult] = await pool.query(
      `INSERT INTO users (firebase_uid, full_name, email, phone, role, class_grade, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        firebaseUid,
        String(fullName).trim(),
        normalizedEmail,
        phone ? String(phone).trim() : null,
        normalizedRole,
        classGrade ? String(classGrade).trim() : null,
        normalizedStatus,
      ],
    )

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [insertResult.insertId])
    return res.status(201).json({
      user: serializeUser(rows[0]),
      defaultPassword,
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'User with this email already exists in database.' })
    }
    const msg = error instanceof Error ? error.message : 'Failed to create user.'
    return res.status(500).json({ error: msg })
  }
})

app.patch('/api/users/:id', authenticate, requireAdmin, async (req, res) => {
  const userId = Number(req.params.id)
  const { fullName, phone, role, classGrade, status } = req.body

  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: 'Invalid user id.' })
  }

  const normalizedRole = String(role || '').toLowerCase()
  const normalizedStatus = String(status || '').toLowerCase()

  if (!fullName || !normalizedRole || !normalizedStatus) {
    return res.status(400).json({ error: 'fullName, role and status are required.' })
  }

  if (!['admin', 'teacher', 'student', 'parent'].includes(normalizedRole)) {
    return res.status(400).json({ error: 'Invalid role.' })
  }

  if (!['active', 'inactive'].includes(normalizedStatus)) {
    return res.status(400).json({ error: 'Invalid status.' })
  }

  try {
    const [existingRows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const existingUser = existingRows[0]

    await pool.query(
      `UPDATE users
       SET full_name = ?, phone = ?, role = ?, class_grade = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        String(fullName).trim(),
        phone ? String(phone).trim() : null,
        normalizedRole,
        classGrade ? String(classGrade).trim() : null,
        normalizedStatus,
        userId,
      ],
    )

    await firebaseAuth.updateUser(existingUser.firebase_uid, {
      displayName: String(fullName).trim(),
      disabled: normalizedStatus === 'inactive',
    })

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
    return res.json({ user: serializeUser(rows[0]) })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update user.'
    return res.status(500).json({ error: msg })
  }
})

app.delete('/api/users/:id', authenticate, requireAdmin, async (req, res) => {
  const userId = Number(req.params.id)
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: 'Invalid user id.' })
  }

  try {
    const [existingRows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const existingUser = existingRows[0]
    await pool.query('DELETE FROM users WHERE id = ?', [userId])

    try {
      await firebaseAuth.deleteUser(existingUser.firebase_uid)
    } catch (error) {
      const firebaseErr = error
      if (!firebaseErr || firebaseErr.code !== 'auth/user-not-found') {
        throw error
      }
    }

    return res.json({ ok: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to delete user.'
    return res.status(500).json({ error: msg })
  }
})

function requireStaff(req, res, next) {
  if (!req.dbUser || !['admin', 'teacher'].includes(req.dbUser.role)) {
    return res.status(403).json({ error: 'Admin or teacher access required.' })
  }

  next()
}

function serializeUser(row) {
  return {
    id: row.id,
    firebaseUid: row.firebase_uid,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    classGrade: row.class_grade,
    status: row.status,
  }
}

function parseJsonArray(value) {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return []
    }
  }
  return []
}

function normalizeDateString(value) {
  if (!value) return ''
  if (typeof value === 'string') return value.slice(0, 10)
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

function classSectionFromAudienceId(id) {
  const classMatch = /^class-(\d{1,2})$/.exec(id)
  if (classMatch) return `Class ${classMatch[1]}`

  const sectionMatch = /^class-(\d{1,2})-([abc])$/.exec(id)
  if (sectionMatch) return `Class ${sectionMatch[1]}${sectionMatch[2].toUpperCase()}`

  return null
}

function buildEventAudienceSelection(audienceIds = []) {
  const audienceRoles = new Set()
  const classSections = new Set()

  audienceIds.forEach((id) => {
    if (id === 'all-users') {
      ;['admin', 'teacher', 'student', 'parent'].forEach((role) => audienceRoles.add(role))
      return
    }

    if (id === 'all-admins') {
      audienceRoles.add('admin')
      return
    }

    if (id === 'all-teachers') {
      audienceRoles.add('teacher')
      return
    }

    if (id === 'all-students') {
      audienceRoles.add('student')
      return
    }

    if (id === 'all-teachers-students') {
      audienceRoles.add('teacher')
      audienceRoles.add('student')
      return
    }

    const classSection = classSectionFromAudienceId(id)
    if (classSection) {
      audienceRoles.add('student')
      classSections.add(classSection)
    }
  })

  let visibilityType = 'school'
  if (audienceRoles.has('admin') || (audienceRoles.has('teacher') && audienceRoles.has('student'))) {
    visibilityType = 'school'
  } else if (audienceRoles.has('teacher') && !audienceRoles.has('student') && classSections.size === 0) {
    visibilityType = 'teacher'
  } else if (audienceRoles.has('student') || classSections.size > 0) {
    visibilityType = 'student'
  }

  return {
    audienceRoles: Array.from(audienceRoles),
    classSections: Array.from(classSections),
    visibilityType,
  }
}

function matchesClassSection(eventClassSections, classSection) {
  if (!classSection) return false
  if (eventClassSections.includes(classSection)) return true

  const classOnlyMatch = /^Class\s+(\d{1,2})/.exec(classSection)
  if (!classOnlyMatch) return false

  return eventClassSections.includes(`Class ${classOnlyMatch[1]}`)
}

function canViewCalendarEvent(event, role, classSection, userId) {
  if (role === 'admin') return true

  if (role === 'teacher') {
    if (event.visibilityType === 'school') return true
    if (event.createdById === userId) return true
    return event.audienceRoles.includes('teacher')
  }

  if (role === 'student') {
    if (event.visibilityType === 'school') return true
    if (event.audienceRoles.includes('student')) {
      if (event.classSections.length === 0) return true
      return matchesClassSection(event.classSections, classSection)
    }
    return matchesClassSection(event.classSections, classSection)
  }

  return event.visibilityType === 'school'
}

function serializeCalendarEvent(row, currentUser) {
  const audienceRoles = parseJsonArray(row.audience_roles)
  const classSections = parseJsonArray(row.class_sections)

  return {
    eventId: row.event_id,
    title: row.title,
    description: row.description,
    date: normalizeDateString(row.event_date),
    time: row.event_time ? String(row.event_time).slice(0, 5) : '',
    eventType: row.event_type,
    createdById: row.created_by,
    createdByName: row.created_by_name || 'Staff',
    audienceRoles,
    classSections,
    visibilityType: row.visibility_type,
    canEdit: Boolean(currentUser && (currentUser.role === 'admin' || currentUser.id === row.created_by)),
  }
}

app.get('/api/calendar-events', authenticateOptional, async (req, res) => {
  const role = String(req.dbUser?.role || req.query.role || 'student').toLowerCase()
  const classSection = String(req.dbUser?.class_grade || req.query.classSection || '')
  const currentUser = req.dbUser || null

  try {
    const [rows] = await pool.query(
      `SELECT ce.*, u.full_name AS created_by_name
       FROM calendar_events ce
       JOIN users u ON u.id = ce.created_by
       ORDER BY ce.event_date ASC, ce.event_time ASC, ce.event_id DESC`,
    )

    const events = rows
      .map((row) => serializeCalendarEvent(row, currentUser))
      .filter((event) => canViewCalendarEvent(event, role, classSection, currentUser?.id || null))

    res.json({ events })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch calendar events.'
    res.status(500).json({ error: msg })
  }
})

app.post('/api/calendar-events', authenticate, requireStaff, async (req, res) => {
  const { title, description, date, time, eventType, audienceIds } = req.body

  if (!title || !description || !date || !Array.isArray(audienceIds) || audienceIds.length === 0) {
    return res.status(400).json({ error: 'title, description, date, and audienceIds are required.' })
  }

  try {
    const selection = buildEventAudienceSelection(audienceIds.map(String))
    const [result] = await pool.query(
      `INSERT INTO calendar_events
       (title, description, event_date, event_time, event_type, created_by, audience_roles, class_sections, visibility_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(title).trim(),
        String(description).trim(),
        String(date).trim(),
        time ? String(time).trim() : null,
        eventType ? String(eventType).trim() : 'Reminder',
        req.dbUser.id,
        JSON.stringify(selection.audienceRoles),
        JSON.stringify(selection.classSections),
        selection.visibilityType,
      ],
    )

    const [rows] = await pool.query(
      `SELECT ce.*, u.full_name AS created_by_name
       FROM calendar_events ce
       JOIN users u ON u.id = ce.created_by
       WHERE ce.event_id = ? LIMIT 1`,
      [result.insertId],
    )

    res.status(201).json({ event: serializeCalendarEvent(rows[0], req.dbUser) })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create calendar event.'
    res.status(500).json({ error: msg })
  }
})

app.patch('/api/calendar-events/:id', authenticate, requireStaff, async (req, res) => {
  const eventId = Number(req.params.id)
  const { title, description, date, time, eventType, audienceIds } = req.body

  if (!Number.isFinite(eventId)) {
    return res.status(400).json({ error: 'Invalid event id.' })
  }

  if (!title || !description || !date || !Array.isArray(audienceIds) || audienceIds.length === 0) {
    return res.status(400).json({ error: 'title, description, date, and audienceIds are required.' })
  }

  try {
    const [existingRows] = await pool.query('SELECT * FROM calendar_events WHERE event_id = ? LIMIT 1', [eventId])
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Calendar event not found.' })
    }

    const existing = existingRows[0]
    if (req.dbUser.role !== 'admin' && existing.created_by !== req.dbUser.id) {
      return res.status(403).json({ error: 'You can only edit events you created.' })
    }

    const selection = buildEventAudienceSelection(audienceIds.map(String))
    await pool.query(
      `UPDATE calendar_events
       SET title = ?, description = ?, event_date = ?, event_time = ?, event_type = ?, audience_roles = ?, class_sections = ?, visibility_type = ?, updated_at = CURRENT_TIMESTAMP
       WHERE event_id = ?`,
      [
        String(title).trim(),
        String(description).trim(),
        String(date).trim(),
        time ? String(time).trim() : null,
        eventType ? String(eventType).trim() : 'Reminder',
        JSON.stringify(selection.audienceRoles),
        JSON.stringify(selection.classSections),
        selection.visibilityType,
        eventId,
      ],
    )

    const [rows] = await pool.query(
      `SELECT ce.*, u.full_name AS created_by_name
       FROM calendar_events ce
       JOIN users u ON u.id = ce.created_by
       WHERE ce.event_id = ? LIMIT 1`,
      [eventId],
    )

    res.json({ event: serializeCalendarEvent(rows[0], req.dbUser) })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update calendar event.'
    res.status(500).json({ error: msg })
  }
})

app.delete('/api/calendar-events/:id', authenticate, requireStaff, async (req, res) => {
  const eventId = Number(req.params.id)

  if (!Number.isFinite(eventId)) {
    return res.status(400).json({ error: 'Invalid event id.' })
  }

  try {
    const [existingRows] = await pool.query('SELECT * FROM calendar_events WHERE event_id = ? LIMIT 1', [eventId])
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Calendar event not found.' })
    }

    const existing = existingRows[0]
    if (req.dbUser.role !== 'admin' && existing.created_by !== req.dbUser.id) {
      return res.status(403).json({ error: 'You can only delete events you created.' })
    }

    await pool.query('DELETE FROM calendar_events WHERE event_id = ?', [eventId])
    res.json({ ok: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to delete calendar event.'
    res.status(500).json({ error: msg })
  }
})

function buildAssistantResponse(role, question) {
  const normalizedRole = String(role || 'student').toLowerCase()
  const normalizedQuestion = String(question || '').trim().toLowerCase()

  if (!normalizedQuestion) {
    return 'Enter a question so I can help with your dashboard, classes, assignments, or announcements.'
  }

  if (normalizedQuestion.includes('assignment')) {
    if (normalizedRole === 'teacher') {
      return 'Use the Assignments tab to create, review, and track submissions. Open an assignment row to check submission counts and grading status.'
    }
    if (normalizedRole === 'admin') {
      return 'Assignment performance is best reviewed from Reports. If you want assignment ownership, check Courses and Communications together.'
    }
    return 'Open the Assignments tab to review pending work, submitted items, and graded results. Start with the items marked pending.'
  }

  if (normalizedQuestion.includes('grade') || normalizedQuestion.includes('score')) {
    if (normalizedRole === 'teacher') {
      return 'Use the Grades tab to review subject scores and open Details for each student. Prioritize students with lower overall percentages first.'
    }
    if (normalizedRole === 'admin') {
      return 'Use Reports and Students to review performance trends. The Students tab already highlights top performers and class distribution.'
    }
    return 'Your scores are summarized in the dashboard and assignment status. Check graded items first to see where marks can improve.'
  }

  if (normalizedQuestion.includes('course') || normalizedQuestion.includes('subject')) {
    if (normalizedRole === 'admin') {
      return 'Open Courses to review active courses, student enrolment, and completion progress. Use Create New Course for new curriculum entries.'
    }
    if (normalizedRole === 'teacher') {
      return 'Use Lesson Planning and Content Upload together: first create the lesson plan, then upload supporting content for the same class.'
    }
    return 'Use My Subjects to continue lessons and track progress by subject. The Continue action is the fastest way back into a course.'
  }

  if (normalizedQuestion.includes('announce') || normalizedQuestion.includes('message') || normalizedQuestion.includes('communication')) {
    if (normalizedRole === 'admin' || normalizedRole === 'teacher') {
      return 'Use New Announcement in the header to post a message. Set the correct audience first, then publish the announcement so the right users see it.'
    }
    return 'Announcements from your school will appear through the dashboard and communications areas. Check recent updates regularly.'
  }

  if (normalizedQuestion.includes('user') || normalizedQuestion.includes('student') || normalizedQuestion.includes('teacher')) {
    if (normalizedRole === 'admin') {
      return 'Use Teachers, Students, and User Management to review live user data. Add or edit users from User Management when you need account changes.'
    }
    if (normalizedRole === 'teacher') {
      return 'Use Grades and Assignments to review student performance. Pending Grading on Home is the quickest entry point for action items.'
    }
    return 'Use My Subjects and Assignments to focus on your own learning status. Your dashboard already highlights pending work and recent activity.'
  }

  if (normalizedQuestion.includes('calendar') || normalizedQuestion.includes('schedule')) {
    return 'Use the calendar widget to review current dates and upcoming work. For deadlines, cross-check with Assignments and recent announcements.'
  }

  if (normalizedRole === 'admin') {
    return 'I can help with users, courses, reports, communications, and system settings. Ask about one of those areas for a more specific action.'
  }
  if (normalizedRole === 'teacher') {
    return 'I can help with lesson plans, lab activities, assignments, grades, and content uploads. Ask about the workflow you want to complete.'
  }
  return 'I can help with subjects, assignments, resources, and study planning. Ask about the task you want to finish next.'
}

function buildSystemInstruction(role) {
  if (role === 'admin') {
    return 'You are SkaiMitra assistant for an LMS admin. Give concise, practical answers about users, courses, reports, communications, and system settings. Keep responses short and actionable.'
  }
  if (role === 'teacher') {
    return 'You are SkaiMitra assistant for a teacher. Give concise, practical answers about lesson planning, lab activities, assignments, grades, content upload, and classroom workflows. Keep responses short and actionable.'
  }
  return 'You are SkaiMitra assistant for a student. Give concise, practical answers about subjects, assignments, resources, study planning, and academic progress. Keep responses short and actionable.'
}

async function generateGeminiResponse(role, question) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiApiKey,
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: buildSystemInstruction(role) }],
      },
      contents: [
        {
          parts: [{ text: question }],
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini request failed: ${errorText || response.status}`)
  }

  const data = await response.json()
  const answer =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join('')
      .trim() || ''

  if (!answer) {
    throw new Error('Gemini returned an empty response.')
  }

  return answer
}

app.post('/api/assistant/query', async (req, res) => {
  const role = String(req.body?.role || 'student').trim().toLowerCase()
  const question = String(req.body?.question || '').trim()

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' })
  }

  if (!['admin', 'teacher', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Invalid assistant role.' })
  }

  try {
    const answer = geminiApiKey
      ? await generateGeminiResponse(role, question)
      : buildAssistantResponse(role, question)

    return res.json({ answer })
  } catch (error) {
    const fallback = buildAssistantResponse(role, question)
    const message = error instanceof Error ? error.message : 'Assistant request failed.'

    return res.json({
      answer: `${fallback}\n\n[Fallback mode: ${message}]`,
    })
  }
})

async function startServer() {
  await ensureSchema()
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  if (error?.code === 'ECONNREFUSED' && process.env.MYSQL_HOST && process.env.MYSQL_PORT) {
    console.error(
      `Failed to start API: could not connect to MySQL at ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}.`,
    )
    console.error('Make sure your MySQL service is running and that the server/.env credentials are correct.')
    console.error('On this machine, the configured Windows service appears to be "MySQL80".')
  } else if (error?.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Failed to start API: MySQL rejected the configured username or password in server/.env.')
  } else if (error?.code === 'ER_BAD_DB_ERROR') {
    console.error('Failed to start API: the configured MySQL database does not exist yet.')
  } else {
    console.error('Failed to start API:', error)
  }

  process.exit(1)
})
