import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing.')
  }

  const cleaned = raw.trim().replace(/^['"]|['"]$/g, '')
  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // Support env values where every quote is escaped (\")
    parsed = JSON.parse(cleaned.replace(/\\"/g, '"'))
  }

  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n')
  }
  return parsed
}

if (!admin.apps.length) {
  const serviceAccount = parseServiceAccount()
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const firebaseAuth = admin.auth()
