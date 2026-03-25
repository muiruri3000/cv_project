import { useEffect, useState } from "react";
import EducationEditor from "./EducationEditor";

const createEmptyEducation = () => ({
  institution: "",
  qualification: "",
  start_year: "",
  end_year: "",
  qualifs: [],
});

const EducationManager = () => {
  const [savedEducation, setSavedEducation] = useState([]);
  const [editorForm, setEditorForm] = useState(createEmptyEducation());
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL
  useEffect(() => {
    const fetchEducation = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/education/`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSavedEducation(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch education.");
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  const handleEditorChange = (field, value) => {
    setEditorForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveEducation = async (edu) => {
    setLoading(true);
    setError(null);
    try {
      const method = edu.id ? "PUT" : "POST";
      const url = edu.id
        ? `${API_URL}/api/education/${edu.id}/`
        : `${API_URL}/api/education/`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edu),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch (err) {
      console.error(err);
      setError("Failed to save education.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    const saved = await saveEducation(editorForm);
    if (!saved) return;

    setSavedEducation((prev) =>
      editingIndex !== null
        ? prev.map((e, i) => (i === editingIndex ? saved : e))
        : [...prev, saved]
    );
    setEditorForm(createEmptyEducation());
    setEditingIndex(null);
  };

  const editEntry = (index) => {
    setEditorForm(savedEducation[index]);
    setEditingIndex(index);
  };

  const deleteEntry = async (index) => {
    const edu = savedEducation[index];
    if (edu.id) {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/education/${edu.id}/`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
      } catch (err) {
        console.error(err);
        setError("Failed to delete education.");
      } finally {
        setLoading(false);
      }
    }
    setSavedEducation((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditorForm(createEmptyEducation());
      setEditingIndex(null);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h3 className="text-3xl font-bold">Education Manager</h3>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <EducationEditor
        education={editorForm}
        index={editingIndex ?? 0}
        onChange={handleEditorChange}
        onDelete={() => {
          setEditorForm(createEmptyEducation());
          setEditingIndex(null);
        }}
      />

      <div className="flex gap-4">
        <button
          onClick={saveEntry}
          className="bg-green-500 text-white p-3 rounded"
        >
          {editingIndex !== null ? "Update" : "Save"} Education
        </button>

        <button
          onClick={() => {
            setEditorForm(createEmptyEducation());
            setEditingIndex(null);
          }}
          className="bg-blue-400 text-white p-3 rounded"
        >
          + New Education
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-bold">Saved Education</h3>
        {savedEducation.length === 0 && (
          <p className="text-gray-500">No education entries yet.</p>
        )}

        {savedEducation.map((edu, idx) => (
          <div
            key={edu.id ?? idx}
            className="flex justify-between items-center border-b py-2"
          >
            <span>
              {edu.institution || "Institution"} — {edu.qualification || "Qualification"}
            </span>

            <div className="flex gap-2">
              <button onClick={() => editEntry(idx)} className="text-blue-600 text-sm">
                Edit
              </button>
              <button onClick={() => deleteEntry(idx)} className="text-red-600 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationManager;
