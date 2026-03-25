import { useState, useEffect } from "react";

const Articles = () => {
  const [articles, setArticles] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL

  // Fetch articles from backend
  const fetchArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/articles/`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      // Optional: sort latest first if needed
      setArticles(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <section id="articles" className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Writing & Technical Notes
        </h2>

        <div className="mt-10 space-y-6">
          {articles.length === 0 && <p>No articles available.</p>}

          {articles.map((article) => {
            const tagList = article.tags
              ? article.tags.split(",").map((tag) => tag.trim())
              : [];

            return (
              <article
                key={article.id}
                className="
                  border border-slate-200
                  border-l-4 border-l-purple-600
                  shadow-xl
                  rounded-xl
                  p-6
                "
              >
                <h3 className="text-xl font-semibold">{article.title}</h3>

                {article.description && (
                  <p className="mt-2 text-gray-700 font-medium">
                    {article.description}
                  </p>
                )}

                <p className="mt-3 max-w-3xl text-gray-600">{article.body}</p>

                <div className="mt-4 flex items-center gap-6 text-sm flex-wrap">
                  {tagList.map((tag, i) => (
                    <span key={i} className="text-gray-500">
                      {tag}
                    </span>
                  ))}

                  {article.slug && (
                    <a
                      href={article.slug}
                      className="font-medium hover:underline text-blue-500"
                    >
                      Read →
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Articles;
