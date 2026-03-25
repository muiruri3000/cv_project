import { useEffect, useState } from "react";
import FeaturedProjectEditor from "./Featured/FeaturedEditor";
import { emptyProject } from "./Featured/FeaturedEditor";
const API_UR = process.env.REACT_APP_API_URL
const API_URL = `${API_UR}/api/featured-projects/`;

const FeaturedProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

const saveProject = async (project) => {
  try {
    // Remove read-only fields before sending to API
    const payload = {
      title: project.title,
      description: project.description,
      features: project.features,
      demo_link: project.demo_link,
      github: project.github,
      is_featured: project.is_featured,
      order: project.order,
    };

    const method = project.id ? "PATCH" : "POST";
    const url = project.id ? `${API_URL}${project.id}/` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
      console.error("Validation error:", errorData);
      alert("Failed to save project. Check console for details.");
      return;
    }

    await fetchProjects();
    setEditingProject(null);
  } catch (err) {
    console.error("Failed to save project:", err);
  }
};



  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <div className="max-w-5xl space-y-8">
      <h2 className="text-3xl font-bold">Featured Projects</h2>

      <FeaturedProjectEditor
        project={editingProject || emptyProject}
        onSave={saveProject}
        onCancel={() => setEditingProject(null)}
      />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Saved Projects</h3>

        {loading && <p>Loading…</p>}

        {!loading && projects.length === 0 && (
          <p className="text-gray-500">No projects yet.</p>
        )}

        {projects.map((p) => (
          <div
            key={p.id}
            className="border rounded p-4 bg-white flex justify-between"
          >
            <div>
              <h4 className="font-medium">
                {p.title}{" "}
                {p.is_featured && (
                  <span className="text-xs text-green-600">(Featured)</span>
                )}
              </h4>
              <p className="text-sm text-gray-600">{p.description}</p>

              {p.features && (
                <ul className="text-sm mt-2 list-disc list-inside font-mono">
                  {p.features.split("\n").map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingProject(p)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(p.id)}
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

export default FeaturedProjectManager;
