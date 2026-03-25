import { useEffect, useState } from "react";

const emptyCategory = {
  id: null,
  category: "",
  order: 0,
  skills: [],
};

const SkillsEditor = ({ categoryData, onSave, onCancel }) => {
  const [form, setForm] = useState(emptyCategory);

  // Sync parent data → local state
  useEffect(() => {
    if (categoryData) {
      setForm({
        id: categoryData.id ?? null,
        category: categoryData.category ?? "",
        order: categoryData.order ?? 0,
        skills: Array.isArray(categoryData.skills)
          ? categoryData.skills.map((s) =>
              typeof s === "string" ? { name: s } : s
            )
          : [],
      });
    } else {
      setForm(emptyCategory);
    }
  }, [categoryData]);

  const handleCategoryChange = (e) => {
    setForm((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleSkillChange = (index, value) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, name: value } : skill
      ),
    }));
  };

  const addSkill = () => {
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "" }],
    }));
  };

  const handleSubmit = () => {
    onSave?.(form);
  };

  return (
    <div className="border p-4 rounded bg-stone-200 space-y-3">
      <input
        type="text"
        value={form.category}
        onChange={handleCategoryChange}
        placeholder="Category (e.g. Cloud & AWS)"
        className="w-full border p-2 font-medium rounded"
      />

      <div className="space-y-2 mt-2">
        {form.skills.map((skill, idx) => (
          <input
            key={idx}
            type="text"
            value={skill.name ?? ""}
            onChange={(e) => handleSkillChange(idx, e.target.value)}
            placeholder={`Skill ${idx + 1}`}
            className="w-full border p-2 text-sm rounded"
          />
        ))}

        <button
          type="button"
          onClick={addSkill}
          className="text-blue-600 text-sm mt-1"
        >
          + Add Skill
        </button>
      </div>

      <div className="flex gap-3 mt-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          {form.id ? "Update" : "Save"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillsEditor;
