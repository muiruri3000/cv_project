import { useEffect, useState } from "react";
import ArchitectureEditor from "../ArchitectureEditor";

const emptyArchitecture = () => ({
  title: "",
  description: "",
  image: null,
  services: [{ name: "" }],
  links: [{ label: "", href: "" }],
});

const ArchitectureManager = () => {
  const [architectures, setArchitectures] = useState([]);
  const [editorForm, setEditorForm] = useState(emptyArchitecture());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all architectures from backend
  const fetchArchitectures = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/architectures/`);
      if (!response.ok) throw new Error("Failed to fetch architectures");
      const data = await response.json();
      // Ensure services and links arrays exist
      const transformed = data.map((arch) => ({
        ...arch,
        services: arch.services || [{ name: "" }],
        links: arch.links || [{ label: "", href: "" }],
      }));
      setArchitectures(transformed);
    } catch (error) {
      console.error("Error fetching architectures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchitectures();
  }, []);

  // Save new or updated architecture
  const saveArchitecture = async () => {
    try {
      setLoading(true);
      const url = editingId
        ? `${API_URL}/api/architectures/${editingId}/`
        : `${API_URL}/api/architectures/`;
      const method = editingId ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("title", editorForm.title);
      formData.append("description", editorForm.description);
      if (editorForm.image instanceof File) {
        formData.append("image", editorForm.image);
      }
      formData.append("services", JSON.stringify(editorForm.services));
      formData.append("links", JSON.stringify(editorForm.links));

      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to save architecture");
      const saved = await response.json();

      // Update local state
      if (editingId) {
        setArchitectures((prev) =>
          prev.map((a) => (a.id === editingId ? saved : a))
        );
      } else {
        setArchitectures((prev) => [saved, ...prev]); // newest first
      }

      // Reset form
      setEditorForm(emptyArchitecture());
      setEditingId(null);
    } catch (error) {
      console.error("Error saving architecture:", error);
    } finally {
      setLoading(false);
    }
  };

  const editArchitecture = (arch) => {
    setEditorForm(arch);
    setEditingId(arch.id);
  };

  const handleNew = () => {
    setEditorForm(emptyArchitecture());
    setEditingId(null);
  };

  const deleteArchitecture = async (arch) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/architectures/${arch.id}/`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete architecture");

      setArchitectures((prev) => prev.filter((a) => a.id !== arch.id));

      if (editingId === arch.id) {
        setEditorForm(emptyArchitecture());
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error deleting architecture:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h3 className="text-3xl font-bold">Architectures</h3>

      <ArchitectureEditor architecture={editorForm} onChange={setEditorForm} />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={saveArchitecture}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {editingId ? "Update" : "Save"} Architecture
        </button>

        <button
          type="button"
          onClick={handleNew}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          + New
        </button>
      </div>

      {loading && <p className="text-gray-500 mt-2">Loading...</p>}

      <div className="space-y-2 mt-4">
        {architectures.length === 0 && !loading && (
          <p className="text-gray-500">No architectures yet.</p>
        )}

        {architectures.map((arch) => (
          <div
            key={arch.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{arch.title || "Untitled"}</span>
            <div className="flex gap-2">
              <button
                onClick={() => editArchitecture(arch)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteArchitecture(arch)}
                className="text-red-600 text-sm"
                disabled={loading}
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

export default ArchitectureManager;
