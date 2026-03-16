import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

type DashboardPageProps = {
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
}

function DashboardPage({ role }: DashboardPageProps) {
  const navigate = useNavigate()

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <p className="dashboard-pill">{role} Dashboard</p>
        <h1>Welcome, {role}</h1>
        <p>
          This is the {role.toLowerCase()} area. Replace this screen with your final
          dashboard implementation.
        </p>

        <div className="dashboard-actions">
          <button onClick={() => navigate('/')}>Logout</button>
          <Link to="/">Back to Login</Link>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
