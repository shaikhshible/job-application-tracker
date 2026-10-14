
import { useEffect, useMemo, useState } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication as deleteApplicationApi,
} from "./services/applicationService";

import "./App.css";


function mapApplication(application) {
  return {
    id: application._id,
    company: application.company,
    role: application.jobTitle,
    location: application.location || "",
    date: application.applicationDate
      ? application.applicationDate.slice(0, 10)
      : "",
    status: application.status,
  };
}
const emptyForm = {
  company: "",
  role: "",
  location: "",
  date: new Date().toISOString().slice(0, 10),
  status: "Applied",
};

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const data = await getApplications();
      setApplications(data.map(mapApplication));
    } catch (err) {
      setError(err.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  loadApplications();
}, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch = `${application.company} ${application.role}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        filter === "All" || application.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, filter]);

  const stats = [
    { label: "Total applications", value: applications.length, icon: "▤" },
    {
      label: "Interviews",
      value: applications.filter((a) => a.status === "Interview").length,
      icon: "◷",
    },
    {
      label: "Offers",
      value: applications.filter((a) => a.status === "Offer").length,
      icon: "✓",
    },
    {
      label: "Rejected",
      value: applications.filter((a) => a.status === "Rejected").length,
      icon: "↗",
    },
  ];

  

async function handleSubmit(event) {
  event.preventDefault();

  if (saving) return;

  setSaving(true);
  setError("");

  try {
    const savedApplication = await createApplication({
      company: form.company,
      jobTitle: form.role,
      location: form.location,
      applicationDate: form.date,
      status: form.status,
    });

    setApplications((current) => [
      mapApplication(savedApplication),
      ...current,
    ]);

    setForm(emptyForm);
    setShowForm(false);
  } catch (err) {
    setError(err.message || "Failed to save application.");
  } finally {
    setSaving(false);
  }
}



  
async function updateStatus(id, status) {
  setError("");

  try {
    const updatedApplication = await updateApplication(id, { status });

    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? mapApplication(updatedApplication)
          : application
      )
    );
  } catch (err) {
    setError(err.message || "Failed to update application status.");
  }
}


  
async function deleteApplication(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmed) return;

  setError("");

  try {
    await deleteApplicationApi(id);

    setApplications((current) =>
      current.filter((application) => application.id !== id)
    );
  } catch (err) {
    setError(err.message || "Failed to delete application.");
  }
}


  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">J</span>
          <span>JobTrack</span>
        </a>

        <p className="nav-heading">WORKSPACE</p>
        <a className="nav-link active" href="#dashboard">
          <span>▦</span> Dashboard
        </a>
        <a className="nav-link" href="#applications">
          <span>▤</span> Applications
        </a>

        <div className="sidebar-bottom">
          <div className="profile-avatar">S</div>
          <div>
            <strong>My Workspace</strong>
            <p>Job seeker</p>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">WORKSPACE / OVERVIEW</p>
            <h1>Job Dashboard</h1>
            <p className="subtitle">
              Keep track of your job search, all in one place.
            </p>
          </div>
          <button className="primary-button" onClick={() => setShowForm(true)}>
            <span>＋</span> Add application
          </button>
        </header>

        <section className="stats-grid" aria-label="Application statistics">
          {stats.map((stat, index) => (
            <article className="stat-card" key={stat.label}>
              <div className={`stat-icon stat-icon-${index}`}>
                {stat.icon}
              </div>
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
            </article>
          ))}
        </section>

        <section className="applications-panel" id="applications">
          <div className="panel-heading">
            <div>
              <h2>Recent applications</h2>
              <p>Manage and follow up on your opportunities.</p>
            </div>
            <span className="record-count">
              {filteredApplications.length} records
            </span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search company or job title..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search applications"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter by application status"
            >
              <option value="All">All statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          {loading && (
            <p role="status">Loading applications...</p>
          )}

          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>COMPANY / ROLE</th>
                  <th>LOCATION</th>
                  <th>DATE APPLIED</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <strong>{application.company}</strong>
                      <span className="role-name">{application.role}</span>
                    </td>
                    <td>{application.location}</td>
                    <td>{application.date}</td>
                    <td>
                      <select
                        className={`status-select status-${application.status.toLowerCase()}`}
                        value={application.status}
                        onChange={(event) =>
                          updateStatus(application.id, event.target.value)
                        }
                        aria-label={`Status for ${application.company}`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteApplication(application.id)}
                        aria-label={`Delete ${application.company}`}
                        title="Delete application"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && filteredApplications.length === 0 && (
              <div className="empty-state">
                <h3>No applications found</h3>
                <p>Try another search or add a new application.</p>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <span>JobTrack · Portfolio Project</span>
          <span>Built with React</span>
        </footer>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section
            className="form-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2 id="form-title">Add application</h2>
                <p>Record a new job opportunity.</p>
              </div>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Company name
                <input
                  required
                  value={form.company}
                  onChange={(event) =>
                    setForm({ ...form, company: event.target.value })
                  }
                  placeholder="e.g. Nokia"
                />
              </label>

              <label>
                Job title
                <input
                  required
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                  placeholder="e.g. Junior Developer"
                />
              </label>

              <label>
                Location
                <input
                  required
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  placeholder="e.g. Turku or Remote"
                />
              </label>

              <label>
                Application date
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save application"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
