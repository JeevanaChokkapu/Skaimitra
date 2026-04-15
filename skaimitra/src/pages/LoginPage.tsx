import { useState, type FormEvent } from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { syncUser } from '../lib/api'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase'
import '../App.css'

const demoCredentials = [
  { email: 'admin@skaimitra.com', password: 'Admin@123', role: 'admin' as const, name: 'Admin Demo', classGrade: '' },
  { email: 'teacher@skaimitra.com', password: 'Teacher@123', role: 'teacher' as const, name: 'Dr. Rajesh Kumar', classGrade: '' },
  { email: 'student@skaimitra.com', password: 'Student@123', role: 'student' as const, name: 'Aarav Mehta', classGrade: 'Class 6A' },
  { email: 'ceo@skaimitra.com', password: 'Ceo@123', role: 'admin' as const, name: 'CEO Demo', classGrade: '' },
]

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const routeByRole = (role: string) => {
    if (role === 'admin') {
      navigate('/admin')
      return
    }

    if (role === 'teacher') {
      navigate('/teacher')
      return
    }

    if (role === 'student') {
      navigate('/student')
      return
    }

    navigate('/parent')
  }

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Enter email and password.')
      return
    }

    if (!isFirebaseConfigured || !auth) {
      const matchedDemoUser = demoCredentials.find(
        (account) => account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password.trim(),
      )

      if (!matchedDemoUser) {
        setErrorMessage('Firebase is not configured. Use one of the demo email/password accounts to continue.')
        return
      }

      localStorage.setItem('skaimitra_role', matchedDemoUser.role)
      localStorage.setItem('skaimitra_name', matchedDemoUser.name)
      localStorage.setItem('skaimitra_class_grade', matchedDemoUser.classGrade)
      routeByRole(matchedDemoUser.role)
      return
    }

    try {
      setIsLoading(true)
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
      const idToken = await credential.user.getIdToken()
      const synced = await syncUser(idToken)

      localStorage.setItem('skaimitra_token', idToken)
      localStorage.setItem('skaimitra_role', synced.user.role)
      localStorage.setItem('skaimitra_name', synced.user.fullName)
      localStorage.setItem('skaimitra_class_grade', synced.user.classGrade || '')
      routeByRole(synced.user.role)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Login failed.'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setErrorMessage('Firebase env is missing. Fill VITE_FIREBASE_* in .env and restart frontend.')
      return
    }

    try {
      setIsLoading(true)
      const credential = await signInWithPopup(auth, googleProvider)
      const idToken = await credential.user.getIdToken()
      const synced = await syncUser(idToken)

      localStorage.setItem('skaimitra_token', idToken)
      localStorage.setItem('skaimitra_role', synced.user.role)
      localStorage.setItem('skaimitra_name', synced.user.fullName)
      localStorage.setItem('skaimitra_class_grade', synced.user.classGrade || '')
      routeByRole(synced.user.role)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Google login failed.'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: 'admin' | 'teacher' | 'student', name: string) => {
    localStorage.setItem('skaimitra_role', role)
    localStorage.setItem('skaimitra_name', name)
    localStorage.setItem('skaimitra_class_grade', role === 'student' ? 'Class 6A' : '')
    routeByRole(role)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-brand">
          <div className="brand-top">
            <div className="brand-icon" aria-hidden>
              <img src="/SkaiMitra_LogoV2.0.jpg" alt="SkaiMitra logo" className="brand-icon-image" />
            </div>
            <span className="brand-title">SkaiMitra</span>
          </div>

          <h2 className="brand-copy">
            The LMS Platform for learning,
            <br />
            teaching and thriving in an
            <br />
            AI-powered world
          </h2>

          <p className="brand-foot">Powered by Advaitecs</p>
        </section>

        <section className="login-form-wrap">
          <form onSubmit={handleEmailLogin} className="login-form">
            <div className="field">
              <label htmlFor="email">
                Email <span className="required-asterisk">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">
                Password <span className="required-asterisk">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Login'}
            </button>

            <button type="button" className="google-login-btn" onClick={handleGoogleLogin} disabled={isLoading || !isFirebaseConfigured}>
              Continue with Google
            </button>

            <div className="meta">
              <p>
                By continuing, you agree to our <a href="#">Terms of Service</a>{' '}
                and <a href="#">Privacy Policy</a>.
              </p>
              <a href="#">Forgot Password?</a>
              <div className="demo-links">
                <button type="button" onClick={() => handleDemoLogin('admin', 'Admin Demo')}>
                  Admin Demo
                </button>
                <button type="button" onClick={() => handleDemoLogin('teacher', 'Dr. Rajesh Kumar')}>
                  Teacher Demo
                </button>
                <button type="button" onClick={() => handleDemoLogin('student', 'Aarav Mehta')}>
                  Student Demo
                </button>
              </div>
            </div>
          </form>

          {errorMessage && <p className="status-message">{errorMessage}</p>}
        </section>
      </div>
    </div>
  )
}

export default LoginPage
