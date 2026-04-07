const API_URL = "http://localhost:8000";
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("access");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.error("API Error:", response.status, data);
    throw new Error(
      typeof data === "object"
        ? JSON.stringify(data)
        : data || response.statusText
    );
  }

  return data;
};