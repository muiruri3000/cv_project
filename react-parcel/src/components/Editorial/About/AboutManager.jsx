import { useEffect, useState } from "react";
import AboutEditor from "../AboutEditor";
import { apiFetch } from "../../loginHelper/api";

const createEmptyAbout = () => ({
  id: null,
  headline: "",
  summary: "",
  paragraphs: [],
  core_strengths: [],
});

const AboutManager = () => {
  const [about, setAbout] = useState(createEmptyAbout());
  const API_URL = "/api/about/";

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await apiFetch(API_URL);
        setAbout(data || createEmptyAbout());
      } catch (err) {
        console.error("Failed to fetch about:", err);
        setAbout(createEmptyAbout());
      }
    };

    fetchAbout();
  }, []);

  /* ---------------- SAVE ---------------- */
  const saveAbout = async () => {
    const hasId = Boolean(about?.id);

    const url = hasId ? `${API_URL}${about.id}/` : API_URL;
    const method = hasId ? "PUT" : "POST";

    const payload = {
      headline: about.headline,
      summary: about.summary,

      // ✅ MUST match serializer: AboutParagraphSerializer
      paragraphs: (about.paragraphs || [])
        .map((p, index) => ({
          content: (p?.content || "").trim(),
          order: index,
        }))
        .filter((p) => p.content.length > 0),

      // ✅ MUST match serializer: CoreStrengthSerializer
      core_strengths: (about.core_strengths || [])
        .map((s, index) => ({
          pillar: (s?.pillar || "").trim(),
          description: (s?.description || "").trim(),
          order: index,
        }))
        .filter((s) => s.pillar || s.description),
    };

    console.log("payload:", payload);

    try {
      const saved = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      setAbout(saved || createEmptyAbout());
      alert("About saved successfully!");
    } catch (err) {
      console.error("Error saving about:", err);
      alert("Failed to save About.");
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteAbout = async () => {
    if (!about?.id) return;

    const confirmDelete = window.confirm(
      "Delete About content permanently?"
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`${API_URL}${about.id}/`, {
        method: "DELETE",
      });

      setAbout(createEmptyAbout());
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete About");
    }
  };

  /* ---------------- UPDATE HANDLER ---------------- */
  const handleChange = (field, value) => {
    setAbout((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-4xl space-y-6 h-screen">
      <h3 className="text-3xl font-bold">About Manager</h3>

      <AboutEditor about={about} onChange={handleChange} />

      <div className="flex gap-4">
        <button
          onClick={saveAbout}
          className="bg-green-500 text-white p-3 rounded"
        >
          Save About
        </button>

        {about?.id && (
          <button
            onClick={deleteAbout}
            className="bg-red-500 text-white p-3 rounded"
          >
            Delete About
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutManager;