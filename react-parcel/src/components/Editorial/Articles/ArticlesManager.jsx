import { useState, useEffect } from "react";
import ArticleEditor from "../Articles/ArticlesEditor";
import { apiFetch } from "../../loginHelper/api";

const EMPTY_ARTICLE = {
  title: "",
  description: "",
  body: "",
  tags: "",

};

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")  // replace spaces & special chars with "-"
    .replace(/^-+|-+$/g, "");     // remove leading/trailing hyphens

const ArticlesManager = () => {
  const [draft, setDraft] = useState(EMPTY_ARTICLE);
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const API_URL = "/api/articles/";

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await apiFetch(API_URL);
        setArticles(data || []);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    fetchArticles();
  }, []);

  // ---------------- SAVE (CREATE / UPDATE) ----------------
const handleSave = async (e) => {
  e.preventDefault();

  const hasId = Boolean(editingId);

  const url = hasId
    ? `${API_URL}${editingId}/`
    : API_URL;

  const method = hasId ? "PUT" : "POST";

  const payload = {
    ...draft,
    slug: slugify(draft.slug || draft.title), // ✅ enforce valid slug
  };

  try {
    const saved = await apiFetch(url, {
      method,
      body: JSON.stringify(payload),
    });

    setDraft(EMPTY_ARTICLE);
    setEditingId(null);

    // refresh list
    const refreshed = await apiFetch(API_URL);
    setArticles(refreshed || []);
  } catch (error) {
    console.error("Failed to save article:", error);
  }
};
  // ---------------- EDIT ----------------
  const handleEdit = (article) => {
    setDraft(article);
    setEditingId(article.id);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    try {
      await apiFetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      // refresh list
      const refreshed = await apiFetch(API_URL);
      setArticles(refreshed || []);
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  return (
    <div className="space-y-8 h-screen">
      <ArticleEditor
        article={draft}
        onChange={(e) => {
          const { name, value } = e.target;
          setDraft((prev) => ({ ...prev, [name]: value }));
        }}
        onSave={handleSave}
        isEditing={!!editingId}
      />

      <div className="space-y-4">
        {articles.length === 0 && <p>No articles yet.</p>}

        {articles.map((article) => (
          <div key={article.id} className="border p-4 bg-stone-200">
            <h3 className="font-bold">{article.title}</h3>
            <p className="text-sm">{article.description}</p>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => handleEdit(article)}
                className="bg-blue-400 p-2 text-white"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(article.id)}
                className="bg-red-400 p-2 text-white"
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

export default ArticlesManager;