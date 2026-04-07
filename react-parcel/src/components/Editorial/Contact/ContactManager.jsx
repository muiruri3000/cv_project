import ContactEditor from "../ContactEditor";
import { createEmptyContact } from "../ContactEditor";
import { useEffect, useState } from "react";
import { apiFetch } from "../../loginHelper/api";

const ProfileManager = () => {
  const [profile, setProfile] = useState(createEmptyContact());
  const API_URL = "/api/profile/";

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch(API_URL);
        setProfile(data || createEmptyContact());
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // ---------------- SAVE PROFILE ----------------
  const saveEntry = async () => {
    const hasId = Boolean(profile?.id);

    const url = hasId
      ? `${API_URL}${profile.id}/`
      : API_URL;

    const method = hasId ? "PUT" : "POST";

    try {
      const payload = {
        ...profile,
      };

      const savedProfile = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      setProfile(savedProfile);

      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("An unexpected error occurred while saving the profile.");
    }
  };

  return (
    <div className="max-w-4xl space-y-6 h-screen">
      <h3 className="text-3xl font-bold">Profile</h3>

      <ContactEditor
        contact={profile}
        onChange={(f, v) =>
          setProfile((prev) => ({ ...prev, [f]: v }))
        }
      />

      <button
        onClick={saveEntry}
        className="bg-green-500 text-white p-3 rounded"
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfileManager;