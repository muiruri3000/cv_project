import { useEffect, useState } from "react";
const API_UR = process.env.REACT_APP_API_URL
const API_URL = `${API_UR}/api/skills/`; // Make sure this matches your backend

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Status ${res.status}: ${text}`);
        }

        const data = await res.json();

        const safeData = Array.isArray(data) ? data : [];

        // Sort categories and nested skills by order
        const sorted = safeData
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((cat) => ({
            ...cat,
            skills: Array.isArray(cat.skills)
              ? [...cat.skills].sort(
                  (a, b) => (a.order ?? 0) - (b.order ?? 0)
                )
              : [],
          }));

        setSkills(sorted);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) return null;
  if (!skills.length) return null;

  return (
    <section id="skills" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Skills
        </h2>

        <div className="mt-10 flex flex-wrap gap-12">
          {skills.map((category) => (
            <div
              key={category.id}
              className="w-full sm:w-[45%] lg:w-[30%]"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {category.category}
              </h3>

              <ul className="mt-4 space-y-2 text-gray-700">
                {(category.skills || []).map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
