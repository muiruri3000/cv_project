import { useState, useEffect } from "react";

const Projects = () => {
  const [featuredProject, setFeaturedProject] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL
  useEffect(() => {
    const fetchFeaturedProject = async () => {
      try {
        const res = await fetch(`${API_URL}/api/featured-projects/`);
        if (!res.ok) throw new Error("Failed to fetch featured project");
        const data = await res.json();
        // Pick the first featured project if API returns an array
        setFeaturedProject(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeaturedProject();
  }, []);

  if (!featuredProject) return null;

  const featuresArray = featuredProject.features
    ? featuredProject.features.split("\n").map((f) => f.trim())
    : [];

  return (
    <section id="projects" className="bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Featured Project
        </h2>

        <div className="mt-10 rounded-xl border-2 border-dusk-accentHover bg-white p-8 shadow-xl">
          <h3 className="text-2xl font-semibold">{featuredProject.title}</h3>

          <p className="mt-3 max-w-3xl text-gray-600">
            {featuredProject.description}
          </p>

          <ul className="mt-6 space-y-3 text-gray-600 list-disc list-inside">
            {featuresArray.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>

          <div className="mt-6 flex gap-6 text-sm font-medium">
            {featuredProject.demo_link && (
              <a
                href={featuredProject.demo_link}
                className="hover:underline text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live demo →
              </a>
            )}
            {featuredProject.github && (
              <a
                href={featuredProject.github}
                className="hover:underline text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
