import React from "react";

const ExperienceEditor = ({ experience, index, onChange, onDelete }) => {
  if (!experience) return null;

  const handleFieldChange = (e, field) => {
    onChange(index, field, e.target.value);
  };

  const handleDutyChange = (e, dutyIndex) => {
    const updatedDuty = {
      ...experience.duties[dutyIndex],
      description: e.target.value,
    };
    onChange(index, "duties", updatedDuty, dutyIndex);
  };

  const addDuty = () => {
    const newDuty = { description: "" };
    onChange(index, "duties", newDuty, experience.duties.length);
  };

  return (
    <div className="border p-4 rounded bg-stone-200 space-y-2">
      <input
        value={experience.company || ""}
        onChange={(e) => handleFieldChange(e, "company")}
        placeholder="Company"
        className="w-full p-2 bg-white rounded"
      />

      <input
        value={experience.role || ""}
        onChange={(e) => handleFieldChange(e, "role")}
        placeholder="Role"
        className="w-full p-2 bg-white rounded"
      />

      <div className="flex gap-2">
        <input
          value={experience.start_date || ""}
          onChange={(e) => handleFieldChange(e, "start_date")}
          placeholder="Start Date"
          className="w-full p-2 bg-white rounded"
        />
        <input
          value={experience.end_date || ""}
          onChange={(e) => handleFieldChange(e, "end_date")}
          placeholder="End Date"
          className="w-full p-2 bg-white rounded"
        />
      </div>

      <textarea
        value={experience.description || ""}
        onChange={(e) => handleFieldChange(e, "description")}
        placeholder="Description"
        className="w-full p-2 bg-white rounded"
      />

      <div className="space-y-2">
        {Array.isArray(experience.duties) &&
          experience.duties.map((duty, dIndex) => (
            <input
              key={dIndex}
              value={duty?.description || ""}
              onChange={(e) => handleDutyChange(e, dIndex)}
              placeholder={`Duty ${dIndex + 1}`}
              className="w-full p-2 bg-white rounded"
            />
          ))}
        <button
          type="button"
          onClick={addDuty}
          className="text-sm text-blue-600"
        >
          + Add Duty
        </button>
      </div>

      <button
        type="button"
        onClick={() => onDelete(index)}
        className="text-red-600 text-sm"
      >
        Delete Experience
      </button>
    </div>
  );
};

export default ExperienceEditor;
