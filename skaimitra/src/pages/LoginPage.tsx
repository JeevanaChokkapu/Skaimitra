import { useState, type FormEvent } from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { syncUser } from '../lib/api'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase'
import '../App.css'

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

    if (!isFirebaseConfigured || !auth) {
      setErrorMessage('Firebase env is missing. Fill VITE_FIREBASE_* in .env and restart frontend.')
      return
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Enter email and password.')
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
              <img src="/skaimitra-logo.png" alt="SkaiMitra logo" className="brand-icon-image" />
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
          {!isFirebaseConfigured && (
            <p className="status-message">Firebase is not configured. Please set `VITE_FIREBASE_*` values in `.env`.</p>
          )}
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

            <button type="button" className="google-login-btn" onClick={handleGoogleLogin} disabled={isLoading}>
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
