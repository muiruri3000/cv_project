import { useEffect, useState } from "react";
import AboutEditor from "../AboutEditor";

const createEmptyAbout = () => ({
  headline: "",
  summary: "",
  paragraphs: [],
  core_strengths: [],
});
const API_URL = process.env.REACT_APP_API_URL
const AboutManager = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch from backend ---------- */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_URL}/about/`);
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setAbout(data?.id ? data : createEmptyAbout());
      } catch (err) {
        console.error("Failed to fetch about:", err);
        setAbout(createEmptyAbout());
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  /* ---------- Field change handler ---------- */
  const handleChange = (field, value) => {
    setAbout((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ---------- Save (create or update) ---------- */
  const saveAbout = async () => {
    const method = about.id ? "PUT" : "POST";
    const url = about.id
      ? `${API_URL}/api/about/${about.id}/`
      : `${API_URL}/api/about/`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });

      if (!res.ok) throw new Error(await res.text());

      const saved = await res.json();
      setAbout(saved);
      alert("About saved successfully");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save About");
    }
  };

  /* ---------- Delete ---------- */
  const deleteAbout = async () => {
    if (!about?.id) return;

    if (!confirm("Delete About content permanently?")) return;

    try {
      await fetch(`${API_URL}/api/about/${about.id}/`, {
        method: "DELETE",
      });

      setAbout(createEmptyAbout());
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete About");
    }
  };

  if (loading) return <p>Loading About…</p>;
  if (!about) return null;

  return (
    <div className="max-w-4xl space-y-6">
      <h3 className="text-3xl font-bold">About Manager</h3>

      {/* Editor */}
      <AboutEditor about={about} onChange={handleChange} />

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={saveAbout}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Save About
        </button>

        {about.id && (
          <button
            type="button"
            onClick={deleteAbout}
            className="bg-red-600 text-white px-6 py-3 rounded"
          >
            Delete About
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutManager;
