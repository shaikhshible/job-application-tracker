
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>JobTrack Admin Portal</h1>
          <p>Manage and monitor the JobTrack application.</p>
        </div>

        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className="admin-welcome">
        <h2>Welcome, {user?.name || "Administrator"}</h2>
        <p>You are logged in to the administrator portal.</p>
      </section>

      <section className="admin-overview">
        
        <article className="admin-card">
          <h3>User Management</h3>
          <p>View and search registered JobTrack users.</p>
          <button
            type="button"
            className="admin-card-button"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>
        </article>

        <article className="admin-card">
          <h3>Application Overview</h3>
          <p>Review platform activity and application records.</p>
          <span>Coming next</span>
        </article>

        <article className="admin-card">
          <h3>System Status</h3>
          <p>Monitor the application's essential services.</p>
          <span>Coming next</span>
        </article>
      </section>
    </main>
  );
}
