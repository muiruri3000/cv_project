import { useState } from "react";

const ArchitectureEditor = ({ architecture, onChange }) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...architecture, [field]: value });
  };

  const handleServiceChange = (index, value) => {
    const newServices = [...architecture.services];
    newServices[index].name = value;
    onChange({ ...architecture, services: newServices });
  };

  const addService = () => {
    onChange({
      ...architecture,
      services: [...architecture.services, { name: "" }],
    });
  };

  const handleLinkChange = (index, key, value) => {
    const newLinks = [...architecture.links];
    newLinks[index][key] = value;
    onChange({ ...architecture, links: newLinks });
  };

  const addLink = () => {
    onChange({
      ...architecture,
      links: [...architecture.links, { label: "", href: "" }],
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange({ ...architecture, image: file });
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={architecture.title}
        onChange={(e) => handleFieldChange("title", e.target.value)}
        className="border p-2 w-full"
      />
      <textarea
        placeholder="Description"
        value={architecture.description}
        onChange={(e) => handleFieldChange("description", e.target.value)}
        className="border p-2 w-full"
      />

      <div>
        <label>Image:</label>
        <input type="file" onChange={handleImageChange} />
        {architecture.image && typeof architecture.image === "string" && (
          <img src={architecture.image} alt="Current" className="h-20 mt-2" />
        )}
      </div>

      <div>
        <label>Services:</label>
        {architecture.services.map((s, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Service ${i + 1}`}
            value={s.name}
            onChange={(e) => handleServiceChange(i, e.target.value)}
            className="border p-1 w-full mt-1"
          />
        ))}
        <button
          type="button"
          onClick={addService}
          className="bg-blue-500 text-white px-2 py-1 mt-1 rounded"
        >
          + Add Service
        </button>
      </div>

      <div>
        <label>Links:</label>
        {architecture.links.map((l, i) => (
          <div key={i} className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Label"
              value={l.label}
              onChange={(e) => handleLinkChange(i, "label", e.target.value)}
              className="border p-1 flex-1"
            />
            <input
              type="text"
              placeholder="URL"
              value={l.href}
              onChange={(e) => handleLinkChange(i, "href", e.target.value)}
              className="border p-1 flex-1"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="bg-blue-500 text-white px-2 py-1 mt-1 rounded"
        >
          + Add Link
        </button>
      </div>
    </div>
  );
};

export default ArchitectureEditor;
