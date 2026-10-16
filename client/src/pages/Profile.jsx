
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  professionalTitle: "",
  profilePhotoUrl: "",
  bio: "",
  skills: [],
  education: [],
  workExperience: [],
  linkedinUrl: "",
  portfolioUrl: "",
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/profile",
          { credentials: "include" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setProfile({
          ...emptyProfile,
          ...data.profile,
          skills: data.profile.skills || [],
          education: data.profile.education || [],
          workExperience: data.profile.workExperience || [],
        });
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile.");
      }

      setProfile((previous) => ({
        ...previous,
        ...data.profile,
      }));

      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    }
  }

  if (loading) {
    return <main className="profile-page">Loading your profile...</main>;
  }

  return (
    <main className="profile-page">
      <header className="profile-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal details and professional information.</p>
        </div>

        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      {error && <div className="profile-alert profile-error">{error}</div>}
      {success && (
        <div className="profile-alert profile-success">{success}</div>
      )}

      <form className="profile-form" onSubmit={handleSave}>
        <section className="profile-section">
          <h2>Personal Information</h2>

          <div className="profile-form-grid">
            <label>
              Full name
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </label>

            <label>
              Email address
              <input value={profile.email || user?.email || ""} disabled />
            </label>

            <label>
              Phone number
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                maxLength={30}
              />
            </label>

            <label>
              Location
              <input
                name="location"
                value={profile.location}
                onChange={handleChange}
                maxLength={120}
                placeholder="e.g. Turku, Finland"
              />
            </label>

            <label className="profile-full-width">
              Professional title
              <input
                name="professionalTitle"
                value={profile.professionalTitle}
                onChange={handleChange}
                maxLength={120}
                placeholder="e.g. Full-Stack Developer"
              />
            </label>

            <label className="profile-full-width">
              Profile photo URL
              <input
                name="profilePhotoUrl"
                type="url"
                value={profile.profilePhotoUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </label>

            <label className="profile-full-width">
              Professional bio
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                maxLength={1000}
                rows={5}
                placeholder="Write a short professional introduction..."
              />
            </label>
          </div>
        </section>

        <section className="profile-section">
          <h2>Professional Links</h2>

          <div className="profile-form-grid">
            <label>
              LinkedIn URL
              <input
                name="linkedinUrl"
                type="url"
                value={profile.linkedinUrl}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/..."
              />
            </label>

            <label>
              Portfolio URL
              <input
                name="portfolioUrl"
                type="url"
                value={profile.portfolioUrl}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </label>
          </div>
        </section>

        <button type="submit" className="profile-save-button">
          Save Profile
        </button>
      </form>
    </main>
  );
}