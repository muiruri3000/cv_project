const ProjectsEditor = ({
  project,
  index,
  onChange,
  onDelete,
}) => {
  if (!project) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, {
      ...project,
      [name]: value,
    });
  };

  return (
    <div className="border p-4 rounded space-y-3 bg-white max-w-2xl">
      <input
        type="text"
        name="title"
        value={project.title}
        onChange={handleChange}
        placeholder="Project Title"
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="description"
        value={project.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />

      <textarea
        name="features"
        value={project.features}
        onChange={handleChange}
        placeholder="Features"
        rows={4}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="demoLink"
        value={project.demoLink}
        onChange={handleChange}
        placeholder="Demo Link"
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="github"
        value={project.github}
        onChange={handleChange}
        placeholder="GitHub Repo"
        className="w-full p-2 border rounded"
      />

      <button
        type="button"
        onClick={() => onDelete(index)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default ProjectsEditor;
