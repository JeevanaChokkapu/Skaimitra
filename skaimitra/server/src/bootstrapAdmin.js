import dotenv from 'dotenv'
import pool from './db.js'
import { firebaseAuth } from './firebaseAdmin.js'

dotenv.config()

const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL
const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || 'Admin@123'
const adminName = process.env.BOOTSTRAP_ADMIN_NAME || 'System Admin'

if (!adminEmail) {
  console.error('BOOTSTRAP_ADMIN_EMAIL is required in server/.env')
  process.exit(1)
}

async function run() {
  const normalizedEmail = adminEmail.trim().toLowerCase()
  let firebaseUid = ''

  try {
    const existing = await firebaseAuth.getUserByEmail(normalizedEmail)
    firebaseUid = existing.uid
    await firebaseAuth.updateUser(firebaseUid, {
      displayName: adminName,
      password: adminPassword,
      disabled: false,
    })
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      const created = await firebaseAuth.createUser({
        email: normalizedEmail,
        password: adminPassword,
        displayName: adminName,
        disabled: false,
      })
      firebaseUid = created.uid
    } else {
      throw error
    }
  }

  await pool.query(
    `INSERT INTO users (firebase_uid, full_name, email, role, class_grade, status)
     VALUES (?, ?, ?, 'admin', 'N/A', 'active')
     ON DUPLICATE KEY UPDATE
       firebase_uid = VALUES(firebase_uid),
       full_name = VALUES(full_name),
       role = 'admin',
       status = 'active',
       class_grade = 'N/A'`,
    [firebaseUid, adminName, normalizedEmail],
  )

  console.log('Admin bootstrap completed:')
  console.log(`Email: ${normalizedEmail}`)
  console.log(`Password: ${adminPassword}`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Bootstrap failed:', err.message)
  process.exit(1)
})
