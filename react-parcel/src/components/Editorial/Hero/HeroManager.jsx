import { useEffect, useState } from "react";
import HeroEditor from "../HeroEditor";

const emptyHero = {
  heading: "",
  subheading: "",
  ctaText: ""
};

const HeroManager = () => {
  const [heroes, setHeroes] = useState([]);
  const [editingHero, setEditingHero] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL
  // Load heroes from backend
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hero/`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setHeroes(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Failed to fetch heroes:", err);
        setHeroes([]); 
      }
    };
    fetchHeroes();
  }, []);

  const saveHero = async (hero) => {
    try {
      const method = hero.id ? "PUT" : "POST";
      const url = hero.id
        ? `${API_URL}/hero/${hero.id}/`
        : `${API_URL}/api/hero/`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to save hero:", errText);
        return;
      }

      const savedHero = await res.json();

      // Update state
      setHeroes((prev) => {
        if (editingHero) {
          return prev.map((h) => (h.id === savedHero.id ? savedHero : h));
        }
        return [...prev, savedHero];
      });

      setEditingHero(null);
    } catch (err) {
      console.error("Error saving hero:", err);
    }
  };

  const deleteHero = async (hero) => {
    if (!hero.id) return;
    try {
      await fetch(`${API_URL}/api/hero/${hero.id}/`, {
        method: "DELETE",
      });
      setHeroes((prev) => prev.filter((h) => h.id !== hero.id));
      if (editingHero?.id === hero.id) setEditingHero(null);
    } catch (err) {
      console.error("Failed to delete hero:", err);
    }
  };

  return (
    <div className="space-y-6">
      <HeroEditor
        initialData={editingHero || emptyHero}
        onSave={saveHero}
        onCancel={() => setEditingHero(null)}
      />

      <div className="max-w-xl space-y-3">
        <h3 className="text-lg font-semibold">Saved Hero Entries</h3>
        {heroes.length === 0 && <p className="text-gray-500">No hero content added yet.</p>}

        {heroes.map((hero) => (
          <div
            key={hero.id}
            className="border rounded p-4 flex justify-between items-start bg-white"
          >
            <div>
              <h4 className="font-medium">{hero.heading}</h4>
              <p className="text-sm text-gray-600">{hero.subheading}</p>
              <p className="text-sm italic">{hero.cta_text}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingHero(hero)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteHero(hero)}
                className="text-red-600"
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

export default HeroManager;
