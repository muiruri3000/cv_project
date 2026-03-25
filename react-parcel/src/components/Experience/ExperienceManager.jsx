import { useEffect, useState } from "react";
import ExperienceEditor from "../Editorial/ExperienceEditor";

// Blank experience factory
const createEmptyExperience = () => ({
  company: "",
  role: "",
  description: "",
  start_date: "",
  end_date: "",
  duties: [],
  order: 0,
});

// Format dates nicely
const formatDate = (dateStr) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([createEmptyExperience()]);
  const [editingIndex, setEditingIndex] = useState(0);
  const [savedExperiences, setSavedExperiences] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL
  // Fetch experiences from backend
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/experiences/`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        
        const withDuties = data.map((exp) => ({
          ...exp,
          duties: exp.duties ? exp.duties.map((d) => d.description) : [],
        }));
        setSavedExperiences(withDuties);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      }
    };
    fetchExperiences();
  }, []);

  // Handle field/duties change
 const handleChange = (index, field, value, dutyIndex = null) => {
  setExperiences((prev) =>
    prev.map((item, i) => {
      if (i !== index) return item;

      if (field !== "duties") return { ...item, [field]: value };

      // handle duties
      const updatedDuties = [...item.duties];
      if (dutyIndex >= updatedDuties.length) {
        updatedDuties.push(value);
      } else {
        updatedDuties[dutyIndex] = value;
      }

      return { ...item, duties: updatedDuties };
    })
  );
};

  const addExperience = () => {
    setExperiences([createEmptyExperience()]);
    setEditingIndex(0);
  };

  const editExperience = (exp) => {
    setExperiences([
      {
        ...exp,
        duties: Array.isArray(exp.duties) ? [...exp.duties] : [],
      },
    ]);
    setEditingIndex(0);
  };

const deleteExperience = async (index) => {
  const exp = savedExperiences[index];
  if (!exp.id) {
    // Not saved in backend yet, just remove locally
    setSavedExperiences((prev) => prev.filter((_, i) => i !== index));
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/experiences/${exp.id}/`, {
      method: "DELETE",
    });

    // If response is not ok, try to log body safely
    if (!res.ok) {
      let errorText;
      try {
        errorText = await res.text();
      } catch {
        errorText = "Could not read response body";
      }
      console.error("Failed to delete experience:", {
        status: res.status,
        body: errorText,
      });
      alert(`Failed to delete experience: ${errorText}`);
      return;
    }

    // Remove from local state if deleted successfully
    setSavedExperiences((prev) => prev.filter((_, i) => i !== index));
  } catch (err) {
    console.error("Failed to delete experience (network or JS error):", err);
    alert("Failed to delete experience. See console for details.");
  }
};
// Save a single experience
const saveExperience = async (exp) => {
  const method = exp.id ? "PUT" : "POST";
  const url = exp.id
    ? `${API_URL}/api/experiences/${exp.id}/`
    : `${API_URL}/api/experiences/`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exp),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to save experience", { status: res.status, body: errorText });
    alert(`Failed to save experience: ${errorText}`);
    return null; 
  }

  return res.json();
};

// Save all experiences in editor
const saveAll = async () => {
  try {
    const savedResults = await Promise.all(experiences.map(saveExperience));
    const successfulSaves = savedResults.filter((r) => r !== null);

    setSavedExperiences((prev) => [...prev, ...successfulSaves]);
    setExperiences([createEmptyExperience()]);
    setEditingIndex(0);

    if (successfulSaves.length) alert("Experiences saved successfully!");
  } catch (err) {
    console.error("Error saving experiences:", err);
    alert("An unexpected error occurred while saving experiences.");
  }
};


  return (
    <div className="max-w-4xl space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveAll();
        }}
        className="space-y-4"
      >
        <h3 className="text-3xl font-bold">Experience Editor</h3>

        {experiences[editingIndex] && (
          <ExperienceEditor
            key={editingIndex}
            index={editingIndex}
            experience={experiences[editingIndex]}
            onChange={handleChange}
            onDelete={() => setExperiences([])}
          />
        )}

        <div className="flex gap-4">
          <button type="button" onClick={addExperience} className="bg-blue-400 text-white p-3 rounded">
            + Add New Blank Experience
          </button>
          <button type="submit" className="bg-green-500 text-white p-3 rounded">
            Save 
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-2">Saved Experiences</h3>
        {savedExperiences.length ? (
          savedExperiences.map((exp, idx) => (
            <div key={idx} className="border-b py-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{exp.role} @ {exp.company}</span>
                <span className="ml-2 text-gray-500 text-sm">
                  {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                </span>
              </div>
              {exp.duties.length > 0 && (
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {exp.duties.map((duty, i) => (
                    <li key={i}>{duty}</li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => editExperience(exp)} className="text-blue-600 text-sm">
                  Edit
                </button>
                <button type="button" onClick={() => deleteExperience(idx)} className="text-red-600 text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-2">No experiences added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ExperienceManager;
