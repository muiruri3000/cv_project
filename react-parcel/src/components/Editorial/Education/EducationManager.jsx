import { useEffect, useState } from "react";
import EducationEditor from "./EducationEditor";
import { apiFetch } from "../../loginHelper/api";

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

  // ✅ Fetch
  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/education/");
      setSavedEducation(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch education.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (field, value) => {
    setEditorForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Save (POST / PUT)
  const saveEducation = async (edu) => {
    setLoading(true);
    setError(null);

    const method = edu.id ? "PUT" : "POST";
    const endpoint = edu.id
      ? `/api/education/${edu.id}/`
      : "/api/education/";

    try {
      const data = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(edu),
      });

      return data;
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

  // ✅ Delete
  const deleteEntry = async (index) => {
    const edu = savedEducation[index];

    if (edu.id) {
      setLoading(true);
      try {
        await apiFetch(`/api/education/${edu.id}/`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to delete education.");
        setLoading(false);
        return;
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
    <div className="max-w-4xl space-y-6 h-screen">
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
              {edu.institution || "Institution"} —{" "}
              {edu.qualification || "Qualification"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => editEntry(idx)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteEntry(idx)}
                className="text-red-600 text-sm"
              >
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