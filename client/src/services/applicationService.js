
const API_BASE_URL = "http://localhost:5000/api/applications";

export async function getApplications() {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to load job applications.");
  }

  const result = await response.json();
  return result.data;
}

export async function createApplication(application) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create job application."
    );
  }

  return result.data;
}

export async function updateApplication(id, updates) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update job application."
    );
  }

  return result.data;
}

export async function deleteApplication(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete job application."
    );
  }

  return result;
}
