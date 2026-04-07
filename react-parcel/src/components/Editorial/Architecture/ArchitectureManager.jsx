import { useEffect, useState } from "react";
import ArchitectureEditor from "../ArchitectureEditor";
import { customApi } from "../../../helpers/customImageFormsAPI";
import { form } from "framer-motion/client";

/* ---------------- SLUG HELPER ---------------- */
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-"); // collapse dashes

const emptyArchitecture = () => ({
  title: "",
  slug: "",
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

  /* ---------------- FETCH ---------------- */
  const fetchArchitectures = async () => {
    try {
      setLoading(true);

      const data = await customApi("/api/architectures/");

      const transformed = data.map((arch) => ({
        ...arch,
        services: arch.services || [{ name: "" }],
        links: arch.links || [{ label: "", href: "" }],
      }));

      setArchitectures(transformed);
    } catch (error) {
      console.error("Error fetching architectures:", error);
      setArchitectures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchitectures();
  }, []);

  /* ---------------- HANDLE TITLE CHANGE (AUTO SLUG) ---------------- */
  const handleChange = (updated) => {
    setEditorForm((prev) => {
      const newTitle =
        updated.title !== undefined ? updated.title : prev.title;

      return {
        ...prev,
        ...updated,
        slug: slugify(newTitle),
      };
    });
  };

  /* ---------------- SAVE ---------------- */
  const saveArchitecture = async () => {
    try {
      setLoading(true);

      const isEditing = Boolean(editingId);

      const formData = new FormData();
      formData.append("title", editorForm.title);
      formData.append("slug", editorForm.slug); // ✅ added slug
      formData.append("description", editorForm.description);

      if (editorForm.image instanceof File) {
        formData.append("image", editorForm.image);
      }

      formData.append("services", JSON.stringify(editorForm.services));
      formData.append("links", JSON.stringify(editorForm.links));

      const saved = await customApi(
        isEditing
          ? `/api/architectures/${editingId}/`
          : "/api/architectures/",
        {
          method: isEditing ? "PUT" : "POST",
          body: formData,
          headers: {},
        }
      );

      console.log("saving form data", formData);
      setArchitectures((prev) =>
        isEditing
          ? prev.map((a) => (a.id === editingId ? saved : a))
          : [saved, ...prev]
      );

      setEditorForm(emptyArchitecture());
      setEditingId(null);
    } catch (error) {
      console.error("Error saving architecture:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EDIT ---------------- */
  const editArchitecture = (arch) => {
    setEditorForm({
      ...arch,
      services: arch.services || [{ name: "" }],
      links: arch.links || [{ label: "", href: "" }],
    });
    setEditingId(arch.id);
  };

  const handleNew = () => {
    setEditorForm(emptyArchitecture());
    setEditingId(null);
  };

  /* ---------------- DELETE ---------------- */
  const deleteArchitecture = async (arch) => {
    try {
      setLoading(true);

      await customApi(`/api/architectures/${arch.id}/`, {
        method: "DELETE",
      });

      setArchitectures((prev) =>
        prev.filter((a) => a.id !== arch.id)
      );

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

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6 max-w-4xl h-screen">
      <h3 className="text-3xl font-bold">Architectures</h3>

      <ArchitectureEditor
        architecture={editorForm}
        onChange={handleChange}
      />

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

      {loading && (
        <p className="text-gray-500 mt-2">Loading...</p>
      )}

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