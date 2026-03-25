import { useEffect, useState } from "react";

const Hero = () => {
  const [content, setContent] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hero/`);
        if (!res.ok) throw new Error("Failed to fetch hero content");
        const data = await res.json();
        console.log("Fetched hero content:", data);
        // If API returns an array, pick the first hero
        setContent(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHero();
  }, []);

  if (!content) return null;

  return (
    <section
      className="bg-dusk-sectionLighter text-black from-gray-50 to-white"
      id="hero"
    >
      <div className="mx-auto max-w-3xl px-6 py-28 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Joseph Muiruri
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-black">
          {content.heading}
        </h2>

        <p className="mt-2 text-sm font-medium text-black">
          {content.subheading}
        </p>

        <p className="mt-6 max-w-3xl text-black leading-relaxed">
          {content.cta_text}
        </p>
      </div>
    </section>
  );
};

export default Hero;
