import { useEffect, useState } from "react";

const emptyHero = {
  heading: "",
  subheading: "",
  ctaText: ""
};

const HeroEditor = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState(emptyHero);

  useEffect(() => {
    if (initialData) {
      setForm({
        heading: initialData.heading || "",
        subheading: initialData.subheading || "",
        ctaText: initialData.cta_text || "",
        id: initialData.id || undefined,
      });
    } else {
      setForm(emptyHero);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Transform to backend shape
    onSave({
      ...form,
      cta_text: form.ctaText,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl border rounded space-y-3 bg-white">
      <h2 className="text-xl font-semibold">
        {form.id ? "Edit Hero" : "Add Hero"}
      </h2>

      <input
        name="heading"
        value={form.heading}
        onChange={handleChange}
        placeholder="Heading"
        className="w-full border p-2"
      />

      <input
        name="subheading"
        value={form.subheading}
        onChange={handleChange}
        placeholder="Subheading"
        className="w-full border p-2"
      />

      <input
        name="ctaText"
        value={form.ctaText}
        onChange={handleChange}
        placeholder="CTA Text"
        className="w-full border p-2"
      />

      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
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

export default HeroEditor;
