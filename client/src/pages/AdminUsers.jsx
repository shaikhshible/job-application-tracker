import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search: search.trim(),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/users?${params}`,
        { credentials: "include" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users.");
      }

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  async function handleStatusChange(account) {
    const nextStatus =
      account.status === "active" ? "suspended" : "active";

    const action = nextStatus === "suspended" ? "suspend" : "reactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${account.name}'s account?`
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${account._id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update account status.");
      }

      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to update account status.");
    }
  }

  return (
    <main className="admin-users-page">
      <header className="admin-users-header">
        <div>
          <h1>User Management</h1>
          <p>View and search registered JobTrack accounts.</p>
        </div>

        <button
          type="button"
          className="admin-users-back"
          onClick={() => navigate("/admin")}
        >
          Back to Admin Portal
        </button>
      </header>

      <section className="admin-users-summary">
        <div>
          <span>Total registered users</span>
          <strong>{pagination.total}</strong>
        </div>

        <label className="admin-users-search">
          Search users
          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
          />
        </label>
      </section>

      {error && (
        <div className="admin-users-error" role="alert">
          {error}
          <button type="button" onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}

      <section className="admin-users-table-section">
        {loading ? (
          <p className="admin-users-message">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="admin-users-message">No users found.</p>
        ) : (
          <div className="admin-users-table-wrap">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((account) => (
                  <tr key={account._id}>
                    <td>{account.name}</td>
                    <td>{account.email}</td>
                    <td>
                      <span
                        className={`admin-users-role role-${account.role}`}
                      >
                        {account.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-users-status status-${account.status}`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td>
                      {account.createdAt
                        ? new Date(account.createdAt).toLocaleDateString()
                        : "—"}
                    </td>       
                    <td>
                      {account.role === "user" ? (
                        <button
                          type="button"
                          className={
                            account.status === "active"
                              ? "admin-user-action suspend"
                              : "admin-user-action reactivate"
                          }
                          onClick={() => handleStatusChange(account)}
                        >
                          {account.status === "active" ? "Suspend" : "Reactivate"}
                        </button>
                      ) : (
                        <span>Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {!loading && pagination.totalPages > 0 && (
        <footer className="admin-users-pagination">
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <div>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </footer>
      )}
    </main>
  );
}
