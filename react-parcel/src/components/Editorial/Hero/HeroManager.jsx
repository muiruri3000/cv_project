import { useEffect, useState } from "react";
import HeroEditor from "../HeroEditor";
import { apiFetch } from "../../loginHelper/api";

const emptyHero = {
  heading: "",
  subheading: "",
  cta_text: "",
};

const HeroManager = () => {
  const [heroes, setHeroes] = useState([]);
  const [editingHero, setEditingHero] = useState(null);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const data = await apiFetch("/api/hero/");
      setHeroes(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch heroes:", err);
      setHeroes([]);
    }
  };

  /* ---------- Save ---------- */
  const saveHero = async (hero) => {
    const method = hero.id ? "PUT" : "POST";
    const endpoint = hero.id
      ? `/api/hero/${hero.id}/`
      : "/api/hero/";

    try {
      const savedHero = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(hero),
      });

      setHeroes((prev) => {
        const exists = prev.some((h) => h.id === savedHero.id);

        if (exists) {
          return prev.map((h) =>
            h.id === savedHero.id ? savedHero : h
          );
        } else {
          return [...prev, savedHero];
        }
      });

      setEditingHero(null);
    } catch (err) {
      console.error("Error saving hero:", err);
    }
  };

  /* ---------- Delete ---------- */
  const deleteHero = async (hero) => {
    if (!hero.id) return;

    try {
      await apiFetch(`/api/hero/${hero.id}/`, {
        method: "DELETE",
      });

      setHeroes((prev) =>
        prev.filter((h) => h.id !== hero.id)
      );

      if (editingHero?.id === hero.id) {
        setEditingHero(null);
      }
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

      <div className="max-w-xl space-y-3 h-screen">
        <h3 className="text-lg font-semibold">
          Saved Hero Entries
        </h3>

        {heroes.length === 0 && (
          <p className="text-gray-500">
            No hero content added yet.
          </p>
        )}

        {heroes.map((hero, index) => (
          <div
            key={hero.id || index}
            className="border rounded p-4 flex justify-between items-start bg-white"
          >
            <div>
              <h4 className="font-medium">{hero.heading}</h4>
              <p className="text-sm text-gray-600">
                {hero.subheading}
              </p>
              <p className="text-sm italic">
                {hero.cta_text}
              </p>
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