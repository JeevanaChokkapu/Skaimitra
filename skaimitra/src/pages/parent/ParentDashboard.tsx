import { Link, useNavigate } from 'react-router-dom'
import '../Dashboard.css'

function ParentDashboard() {
  const navigate = useNavigate()

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <p className="dashboard-pill">Parent Dashboard</p>
        <h1>Welcome, Parent</h1>
        <p>Parent dashboard placeholder.</p>
        <div className="dashboard-actions">
          <button onClick={() => navigate('/')}>Logout</button>
          <Link to="/">Back to Login</Link>
        </div>
      </section>
    </main>
  )
}

export default ParentDashboard
