

const AboutEditor = ({ about, onChange }) => {
  if (!about) return null;

  /* ---------- Paragraph handlers ---------- */
  const updateParagraph = (index, value) => {
    const updated = [...about.paragraphs];
    updated[index] = { ...updated[index], content: value };
    onChange("paragraphs", updated);
  };

  const addParagraph = () => {
    onChange("paragraphs", [
      ...about.paragraphs,
      { content: "", order: about.paragraphs.length },
    ]);
  };

  const removeParagraph = (index) => {
    onChange(
      "paragraphs",
      about.paragraphs.filter((_, i) => i !== index)
    );
  };

  /* ---------- Core strengths handlers ---------- */
  const updateStrength = (index, field, value) => {
    const updated = [...about.core_strengths];
    updated[index] = { ...updated[index], [field]: value };
    onChange("core_strengths", updated);
  };

  const addStrength = () => {
    onChange("core_strengths", [
      ...about.core_strengths,
      {
        pillar: "",
        description: "",
        order: about.core_strengths.length,
      },
    ]);
  };

  const removeStrength = (index) => {
    onChange(
      "core_strengths",
      about.core_strengths.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="border p-6 rounded bg-stone-200 space-y-6">
      {/* Headline */}
      <input
        value={about.headline || ""}
        onChange={(e) => onChange("headline", e.target.value)}
        placeholder="Headline"
        className="w-full p-2 bg-white rounded"
      />

      {/* Summary */}
      <textarea
        value={about.summary || ""}
        onChange={(e) => onChange("summary", e.target.value)}
        placeholder="Short summary"
        rows={3}
        className="w-full p-2 bg-white rounded"
      />

      {/* Paragraphs */}
      <div className="space-y-3">
        <h4 className="font-semibold">About Paragraphs</h4>

        {about.paragraphs.map((p, idx) => (
          <div key={idx} className="space-y-1">
            <textarea
              value={p.content || ""}
              onChange={(e) => updateParagraph(idx, e.target.value)}
              placeholder={`Paragraph ${idx + 1}`}
              className="w-full p-2 bg-white rounded"
            />
            <button
              type="button"
              onClick={() => removeParagraph(idx)}
              className="text-red-600 text-xs"
            >
              Remove paragraph
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addParagraph}
          className="text-blue-600 text-sm"
        >
          + Add paragraph
        </button>
      </div>

      {/* Core Strengths */}
      <div className="space-y-3">
        <h4 className="font-semibold">Core Strengths</h4>

        {about.core_strengths.map((s, idx) => (
          <div key={idx} className="border p-3 bg-white rounded space-y-2">
            <input
              value={s.pillar || ""}
              onChange={(e) =>
                updateStrength(idx, "pillar", e.target.value)
              }
              placeholder="Pillar"
              className="w-full p-2 bg-stone-100 rounded"
            />

            <textarea
              value={s.description || ""}
              onChange={(e) =>
                updateStrength(idx, "description", e.target.value)
              }
              placeholder="Description"
              rows={2}
              className="w-full p-2 bg-stone-100 rounded"
            />

            <button
              type="button"
              onClick={() => removeStrength(idx)}
              className="text-red-600 text-xs"
            >
              Remove strength
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addStrength}
          className="text-blue-600 text-sm"
        >
          + Add core strength
        </button>
      </div>
    </div>
  );
};

export default AboutEditor;
