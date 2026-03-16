import { firebaseAuth } from './firebaseAdmin.js'
import pool from './db.js'

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token.' })
  }

  try {
    const decoded = await firebaseAuth.verifyIdToken(token)
    req.authUser = decoded

    const [rows] = await pool.query('SELECT * FROM users WHERE firebase_uid = ? LIMIT 1', [decoded.uid])
    req.dbUser = rows[0] || null
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid auth token.' })
  }
}

export async function authenticateOptional(req, _res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    req.authUser = null
    req.dbUser = null
    next()
    return
  }

  try {
    const decoded = await firebaseAuth.verifyIdToken(token)
    req.authUser = decoded

    const [rows] = await pool.query('SELECT * FROM users WHERE firebase_uid = ? LIMIT 1', [decoded.uid])
    req.dbUser = rows[0] || null
    next()
  } catch {
    req.authUser = null
    req.dbUser = null
    next()
  }
}

export function requireAdmin(req, res, next) {
  if (!req.dbUser || req.dbUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' })
  }

  next()
}
