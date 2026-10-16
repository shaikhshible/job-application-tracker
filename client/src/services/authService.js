
const API_BASE_URL = "http://localhost:5000/api/auth";

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed.");
  }

  return result.user;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed.");
  }

  return result.user;
}

export async function logoutUser() {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Logout failed.");
  }

  return result;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/me`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to retrieve your profile.");
  }

  return result.user;
}
