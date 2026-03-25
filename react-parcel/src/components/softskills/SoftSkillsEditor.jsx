

const SoftSkillsEditor = ({ softSkill, onChange }) => {
  if (!softSkill) return null;

  return (
    <div className="border p-4 rounded bg-stone-200 space-y-3">
      <input
        type="text"
        value={softSkill.skill ?? ""}
        onChange={(e) => onChange("skill", e.target.value)}
        placeholder="Skill title"
        className="w-full border p-2 rounded"
      />

      <textarea
        value={softSkill.description ?? ""}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Skill description"
        rows={4}
        className="w-full border p-2 rounded"
      />
    </div>
  );
};

export default SoftSkillsEditor;
