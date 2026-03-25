import { useEffect, useState } from "react";

export const emptyProject = {
  title: "",
  description: "",
  features: "",
  demo_link: "",
  github: "",
  is_featured: false,
  order: 0,
};

const FeaturedProjectEditor = ({
  project,
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState(emptyProject);

  useEffect(() => {
    if (project) {
      setForm(project);
    } else {
      setForm(emptyProject);
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-6 rounded bg-white space-y-4"
    >
      <h3 className="text-xl font-semibold">
        {project ? "Edit Project" : "Add Featured Project"}
      </h3>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Project Title"
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Short description"
        rows={3}
        className="w-full p-2 border rounded"
      />

      <textarea
        name="features"
        value={form.features}
        onChange={handleChange}
        placeholder="Features (one per line)"
        rows={5}
        className="w-full p-2 border rounded font-mono text-sm"
      />

      <input
        name="demo_link"
        value={form.demo_link}
        onChange={handleChange}
        placeholder="Demo link"
        className="w-full p-2 border rounded"
      />

      <input
        name="github"
        value={form.github}
        onChange={handleChange}
        placeholder="GitHub repo"
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-6 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_featured"
            checked={form.is_featured}
            onChange={handleChange}
          />
          Featured
        </label>

        <input
          type="number"
          name="order"
          value={form.order}
          onChange={handleChange}
          className="w-24 p-2 border rounded"
          placeholder="Order"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default FeaturedProjectEditor;
