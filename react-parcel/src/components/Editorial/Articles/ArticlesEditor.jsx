const ArticleEditor = ({ article, onChange, onSave, isEditing }) => {
  return (
    <form onSubmit={onSave} className="space-y-3 bg-white p-4 rounded shadow">
      <input
        name="title"
        value={article.title}
        onChange={onChange}
        placeholder="Title"
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="description"
        value={article.description}
        onChange={onChange}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />

      <textarea
        name="body"
        value={article.body}
        onChange={onChange}
        placeholder="Body"
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="tags"
        value={article.tags}
        onChange={onChange}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border rounded"
      />

      <input
        name="slug"
        value={article.slug}
        onChange={onChange}
        placeholder="Slug"
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="bg-green-500 text-white p-3 rounded"
      >
        {isEditing ? "Update Article" : "Save Article"}
      </button>
    </form>
  );
};

export default ArticleEditor;
