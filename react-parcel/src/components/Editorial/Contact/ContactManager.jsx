import ContactEditor from "../ContactEditor"
import { createEmptyContact } from "../ContactEditor"
import { useEffect, useState } from "react"
const ProfileManager = () => {
  const [profile, setProfile] = useState(createEmptyContact())

  useEffect(() => {
    const API_URL = process.env.API_URL
    const fetchProfile = async () => {
      const res = await fetch(`${API_URL}/api/profile/`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    }
    fetchProfile()
  }, [])

const saveEntry = async () => {
  const hasId = Boolean(profile?.id)
  const url = hasId
    ? `${API_URL}/api/profile/${profile.id}/`
    : `${API_URL}/api/profile/`
  const method = hasId ? "PUT" : "POST"

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Failed to save profile", {
        status: res.status,
        body: errorText,
      })
      alert(`Failed to save profile: ${errorText}`) // optional alert on error
      return
    }

    const savedProfile = await res.json()
    setProfile(savedProfile)

    // ✅ Success alert
    alert("Profile saved successfully!")
  } catch (err) {
    console.error("Error saving profile:", err)
    alert("An unexpected error occurred while saving the profile.")
  }
}

  return (
    <div className="max-w-4xl space-y-6">
      <h3 className="text-3xl font-bold">Profile</h3>
      <ContactEditor contact={profile} onChange={(f, v) => setProfile(prev => ({ ...prev, [f]: v }))} />
      <button onClick={saveEntry} className="bg-green-500 text-white p-3 rounded">
        Save Profile
      </button>
    </div>
  )
}

export default ProfileManager
