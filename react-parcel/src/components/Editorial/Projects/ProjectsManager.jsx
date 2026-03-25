import { useEffect, useState } from "react";
import ProjectsEditor from "../ProjectsEditor";

const emptyProject = () => ({
  title: "",
  description: "",
  features: "",
  demoLink: "",
  github: "",
});
const API_URL = process.env.REACT_APP_API_URL
const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [editorForm, setEditorForm] = useState(emptyProject());
  const [editingIndex, setEditingIndex] = useState(null);

  // load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("projects"));
    if (Array.isArray(saved)) {
      setProjects(saved);
    }
  }, []);

  const saveProject = () => {
    const updated =
      editingIndex !== null
        ? projects.map((p, i) =>
            i === editingIndex ? editorForm : p
          )
        : [...projects, editorForm];

    localStorage.setItem("projects", JSON.stringify(updated));
    setProjects(updated);
    setEditorForm(emptyProject());
    setEditingIndex(null);
  };

  const editProject = (index) => {
    setEditorForm(projects[index]);
    setEditingIndex(index);
  };

  const deleteProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));

    if (editingIndex === index) {
      setEditorForm(emptyProject());
      setEditingIndex(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h3 className="text-3xl font-bold">Projects</h3>

      {/* EDITOR */}
      <ProjectsEditor
        project={editorForm}
        onChange={setEditorForm}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={saveProject}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingIndex !== null ? "Update" : "Save"} Project
        </button>

        <button
          type="button"
          onClick={() => {
            setEditorForm(emptyProject());
            setEditingIndex(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + New Project
        </button>
      </div>

      {/* LIST */}
      <div className="mt-6 space-y-2">
        <h4 className="text-xl font-semibold">Saved Projects</h4>

        {projects.length === 0 && (
          <p className="text-gray-500">No projects yet.</p>
        )}

        {projects.map((project, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-2"
          >
            <span className="font-medium">
              {project.title || `Untitled Project ${index + 1}`}
            </span>

            <div className="flex gap-3">
              <button
                onClick={() => editProject(index)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProject(index)}
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

export default ProjectsManager;
