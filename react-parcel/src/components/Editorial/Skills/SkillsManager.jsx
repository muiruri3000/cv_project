import { useEffect, useState } from "react";
import SkillsEditor from "../SkillsEditor";
import { apiFetch } from "../../loginHelper/api";

const API_URL = "/api/skills/";

const emptyCategory = {
  id: null,
  category: "",
  order: 0,
  skills: [],
};

const SkillsManager = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(emptyCategory);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH ----------------
  const fetchCategories = async () => {
    try {
      const data = await apiFetch(API_URL);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- SAVE ----------------
  const saveCategory = async (category) => {
    if (!category) return;

    const payload = {
      category: category.category,
      order: category.order ?? 0,
      skills: category.skills
        .filter((s) => s.name?.trim() !== "")
        .map((s, idx) => ({
          name: s.name,
          order: idx,
        })),
    };

    const isEdit = Boolean(category.id);

    const url = isEdit
      ? `${API_URL}${category.id}/`
      : API_URL;

    const method = isEdit ? "PATCH" : "POST";

    try {
      await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      await fetchCategories();
      setEditingCategory(emptyCategory);
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("Unexpected error saving category");
    }
  };

  // ---------------- DELETE ----------------
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await apiFetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      await fetchCategories();

      if (editingCategory?.id === id) {
        setEditingCategory(emptyCategory);
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category");
    }
  };

  // ---------------- UI ----------------
  if (loading) return <p>Loading…</p>;

  return (
    <div className="max-w-5xl space-y-6 h-screen">
      <h2 className="text-3xl font-bold">Skills Manager</h2>

      <SkillsEditor
        categoryData={editingCategory}
        onSave={saveCategory}
        onCancel={() => setEditingCategory(emptyCategory)}
      />

      <button
        type="button"
        onClick={() => setEditingCategory(emptyCategory)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + New Category
      </button>

      <div className="mt-6">
        <h3 className="text-2xl font-bold">Saved Skill Categories</h3>

        {categories.length === 0 && (
          <p className="text-gray-500">No skills added yet.</p>
        )}

        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{cat.category}</span>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingCategory(cat)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCategory(cat.id)}
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

export default SkillsManager;