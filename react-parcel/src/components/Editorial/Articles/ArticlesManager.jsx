import { useState, useEffect } from "react";
import ArticleEditor from "../Articles/ArticlesEditor";

const EMPTY_ARTICLE = {
  title: "",
  description: "",
  body: "",
  tags: "",
  slug: "",
};

const ArticlesManager = () => {
  const [draft, setDraft] = useState(EMPTY_ARTICLE);
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URLs

  // Fetch all articles from backend
  const fetchArticles = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle draft field change
  const handleDraftChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  // Save or update article
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/api/articles/${editingId}/` : `${API_URL}/api/articles/`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!response.ok) throw new Error("Failed to save article");

      setDraft(EMPTY_ARTICLE);
      setEditingId(null);
      fetchArticles(); // refresh the list
    } catch (error) {
      console.error(error);
    }
  };

  // Edit article
  const handleEdit = (article) => {
    setDraft(article);
    setEditingId(article.id);
  };

  // Delete article
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/articles/${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete article");
      fetchArticles(); // refresh after deletion
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <ArticleEditor
        article={draft}
        onChange={handleDraftChange}
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
