import { useState, useEffect } from "react";

const DiagramArchitectures = () => {
  const [architectures, setArchitectures] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL
  useEffect(() => {
  const fetchArchitectures = async () => {
  try {
    const response = await fetch(`${API_URL}/api/architectures/`);
    if (!response.ok) throw new Error("Failed to fetch architectures");
    const data = await response.json();
    // Ensure latest first
    const transformed = data.map(arch => ({
      ...arch,
      services: arch.services || [],
      links: arch.links || [],
    }));
    setArchitectures(transformed); // backend already returns latest first
  } catch (error) {
    console.error("Error fetching architectures:", error);
  }
};


    fetchArchitectures();
  }, []);

  return (
    <section id="architecture" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Architecture Portfolio
        </h2>
        <p className="mt-4 max-w-2xl text-purple-400">
          A selection of cloud architectures I’ve designed and implemented,
          documented using diagrams-first system design.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {architectures.map((project, idx) => (
            <div
              key={idx}
              className="w-full sm:w-[48%] lg:w-[31%] rounded-xl bg-white p-6 shadow-xl border border-slate-200 border-l-4 border-l-purple-400"
            >
              <div className="h-40 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-contain rounded-lg"
                  />
                ) : (
                  <span>No Diagram</span>
                )}
              </div>

              <h3 className="mt-6 text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-purple-400">{project.description}</p>

              <ul className="mt-4 list-disc list-inside text-sm text-gray-700">
                {project.services?.map((service, sIdx) => (
                  <li key={sIdx}>{service.name}</li>
                ))}
              </ul>

              <div className="mt-6 flex gap-4 text-sm font-medium">
                <ul className="flex gap-6">
                  {project.links?.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="text-black hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiagramArchitectures;
