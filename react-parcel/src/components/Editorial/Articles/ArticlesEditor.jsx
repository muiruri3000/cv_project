const ArticleEditor = ({ article, onChange, onSave, isEditing }) => {
  return (
    <form
      onSubmit={onSave}
      className="space-y-4 bg-white p-6 rounded shadow"
    >
      {/* Title */}
      <input
        name="title"
        value={article?.title || ""}
        onChange={onChange}
        placeholder="Title"
        className="w-full p-2 border rounded"
        required
      />

      {/* Description */}
      <input
        name="description"
        value={article?.description || ""}
        onChange={onChange}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />

      {/* Body */}
      <textarea
        name="body"
        value={article?.body || ""}
        onChange={onChange}
        placeholder="Body"
        rows={8}
        className="w-full p-2 border rounded"
        required
      />

      {/* Tags */}
      <input
        name="tags"
        value={article?.tags || ""}
        onChange={onChange}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border rounded"
      />

      {/* Submit */}
      <button
        type="submit"
        className={`p-3 rounded text-white ${
          isEditing ? "bg-blue-500" : "bg-green-500"
        }`}
      >
        {isEditing ? "Update Article" : "Save Article"}
      </button>
    </form>
  );
};

export default ArticleEditor;