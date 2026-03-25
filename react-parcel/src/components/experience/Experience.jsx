import { useEffect, useState } from "react";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true); // optional loading state
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/experiences/`);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        setExperiences(data);
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);
const formatDate = (dateStr) => {
  if (!dateStr) return "Present"; // if null or empty
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "short" }; // e.g., "Jul 2015"
  return date.toLocaleDateString("en-US", options);
};

  if (loading) return <p>Loading experiences...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section id="experience" className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Professional Experience
        </h2>

        <div className="mt-12 space-y-10">
          {experiences.length ? (
            experiences.map((xp, idx) => (
              <div key={idx}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold">
                    {xp.role} @ {xp.company}
                  </h3>
                  <span className="mt-1 text-sm text-gray-500 sm:mt-0">
                    {formatDate(xp.start_date)} - {formatDate(xp.end_date) || "Present"}
                  </span>
                </div>

                <p className="mt-3 max-w-3xl text-sm text-gray-600">
                  {xp.description || "No description provided."}
                </p>
<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
  {Array.isArray(xp.duties) &&
    xp.duties
      .filter(Boolean)
      .map((duty, index) => (
        <li key={duty.id || index}>{duty.description}</li>
      ))}
</ul>

              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No experiences added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
