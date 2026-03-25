import { useEffect, useState } from "react";

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch(`${API_URL}/api/education/`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setEducation(data);
      } catch (err) {
        console.error("Failed to fetch education:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-gray-500">Loading education…</p>
        </div>
      </section>
    );
  }

  if (education.length === 0) {
    return null;
  }

  return (
    <section id="education" className="bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Education & Certifications
        </h2>

        <div className="mt-10 space-y-6">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-xl border border-slate-200 p-8 shadow-xl bg-white border-l-4 border-l-green-400"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold">
                    {edu.qualification}
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {edu.institution}
                  </p>
                </div>

                <p className="mt-4 sm:mt-0 text-sm text-gray-400">
                  {edu.start_year}
                  {edu.end_year && ` – ${edu.end_year}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
