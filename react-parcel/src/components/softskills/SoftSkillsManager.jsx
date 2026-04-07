import { useEffect, useState } from "react";
import SoftSkillsEditor from "./SoftSkillsEditor";
import { apiFetch } from "../../components/loginHelper/api";

const createEmptySoftSkill = () => ({
  id: null,
  skill: "",
  description: "",
  order: 0,
});

const SoftSkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(createEmptySoftSkill());
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await apiFetch("/api/soft-skills/");
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch soft skills:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Handle Change ---------- */
  const handleChange = (field, value) => {
    setEditingSkill((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ---------- Save ---------- */
  const saveSkill = async () => {
    if (!editingSkill.skill?.trim()) return;

    const payload = {
      skill: editingSkill.skill,
      description: editingSkill.description ?? "",
      order: editingSkill.order ?? skills.length,
    };

    const method = editingSkill.id ? "PATCH" : "POST";
    const endpoint = editingSkill.id
      ? `/api/soft-skills/${editingSkill.id}/`
      : "/api/soft-skills/";

    try {
      const updated = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      setSkills((prev) => {
        const exists = prev.some((s) => s.id === updated.id);

        if (exists) {
          return prev.map((s) => (s.id === updated.id ? updated : s));
        } else {
          return [...prev, updated];
        }
      });

      setEditingSkill(createEmptySoftSkill());
    } catch (err) {
      console.error("Failed to save skill:", err);
    }
  };

  /* ---------- Delete ---------- */
  const deleteSkill = async (id) => {
    if (!window.confirm("Delete this soft skill?")) return;

    try {
      await apiFetch(`/api/soft-skills/${id}/`, {
        method: "DELETE",
      });

      setSkills((prev) => prev.filter((s) => s.id !== id));

      if (editingSkill.id === id) {
        setEditingSkill(createEmptySoftSkill());
      }
    } catch (err) {
      console.error("Failed to delete skill:", err);
      alert("Failed to delete skill");
    }
  };

  if (loading) return <p>Loading soft skills…</p>;

  return (
    <div className="max-w-5xl space-y-6 h-screen">
      <h2 className="text-3xl font-bold">Soft Skills Manager</h2>

      {/* Editor */}
      <SoftSkillsEditor
        softSkill={editingSkill}
        onChange={handleChange}
      />

      {/* Actions */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={saveSkill}
          className="bg-green-500 text-white p-3 rounded"
        >
          {editingSkill.id ? "Update" : "Save"} Skill
        </button>

        <button
          onClick={() => setEditingSkill(createEmptySoftSkill())}
          className="bg-blue-400 text-white p-3 rounded"
        >
          + New Skill
        </button>
      </div>

      {/* List */}
      <div className="mt-6">
        <h3 className="text-2xl font-bold">Saved Soft Skills</h3>

        {skills.length === 0 && (
          <p className="text-gray-500">No soft skills added yet.</p>
        )}

        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <h4 className="font-semibold">{skill.skill}</h4>
              <p className="text-gray-600 text-sm">
                {skill.description}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingSkill({ ...skill })}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteSkill(skill.id)}
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

export default SoftSkillsManager;