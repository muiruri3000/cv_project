import { useState, useEffect } from "react";

const About = () => {
  const [content, setContent] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_URL}/api/about/`); 
        if (!res.ok) throw new Error("Failed to fetch About content");
        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAbout();
  }, []);

  if (!content) return null;

  return (
    <section id="about" className="bg-dusk-accent/20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl text-center font-extrabold tracking-tight">
          {content.headline}
        </h2>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          {/* Left column: Paragraphs */}
          <div className="space-y-6 text-gray-600 leading-relaxed">
            {Array.isArray(content.paragraphs) &&
              content.paragraphs
                .sort((a, b) => a.order - b.order) // ensure correct order
                .map((para) => (
                  <p key={para.id}>
                    {para.content}
                  </p>
                ))}
          </div>

          {/* Right column: Core Strengths */}
          <div>
            <h3 className="text-sm font-semibold uppercase mb-5 tracking-wide text-gray-500">
              Core Strengths
            </h3>

            {Array.isArray(content.core_strengths) &&
              content.core_strengths
                .sort((a, b) => a.order - b.order)
                .map((strength) => (
                  <div key={strength.id} className="mb-4">
                    <h4 className="font-medium text-gray-900">
                      {strength.pillar}
                    </h4>
                    <p className="text-sm">{strength.description}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
