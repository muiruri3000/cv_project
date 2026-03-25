import { useState, useEffect } from "react";

export const createEmptySoftSkill = () => ({
  id: null,
  skill: "",
  description: "",
  order: 0,
});

const SoftSkillsEditor = ({ softSkill, onChange, onCancel }) => {
  const [form, setForm] = useState(createEmptySoftSkill());

  // Sync prop → local state
  useEffect(() => {
    if (softSkill) setForm(softSkill);
    else setForm(createEmptySoftSkill());
  }, [softSkill]);

  // Update form and notify parent
  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      onChange?.(updated);
      return updated;
    });
  };

  return (
    <div className="border p-4 rounded bg-stone-200 space-y-3">
      <input
        type="text"
        value={form.skill}
        onChange={(e) => handleChange("skill", e.target.value)}
        placeholder="Skill title (e.g. Decision Making)"
        className="w-full border p-2 font-medium rounded"
      />

      <textarea
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Skill description"
        className="w-full border p-2 rounded"
        rows={4}
      />

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 bg-gray-400 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default SoftSkillsEditor;
