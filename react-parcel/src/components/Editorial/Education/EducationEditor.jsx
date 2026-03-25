const EducationEditor = ({ education, onChange }) => {
  if (!education) return null;

  const handleFieldChange = (e, field) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="border p-4 rounded bg-stone-200 space-y-3">
      <input
        value={education.institution || ""}
        onChange={(e) => handleFieldChange(e, "institution")}
        placeholder="Institution"
        className="w-full p-2 bg-white rounded"
      />

      <input
        value={education.qualification || ""}
        onChange={(e) => handleFieldChange(e, "qualification")}
        placeholder="Qualification / Course"
        className="w-full p-2 bg-white rounded"
      />

      <div className="flex gap-2">
        <input
          value={education.start_year || ""}
          onChange={(e) => handleFieldChange(e, "start_year")}
          placeholder="Start Year"
          className="w-full p-2 bg-white rounded"
        />
        <input
          value={education.end_year || ""}
          onChange={(e) => handleFieldChange(e, "end_year")}
          placeholder="End Year"
          className="w-full p-2 bg-white rounded"
        />
      </div>
    </div>
  );
};

export default EducationEditor;
