const BASE_URL = "http://localhost:8000"; // change if needed

export const customApi = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("access"); // adjust if needed

    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    const response = await fetch(BASE_URL + url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");

    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        typeof data === "string" ? data : JSON.stringify(data)
      );
    }

    return data;
  } catch (err) {
    console.error("Custom API Error:", err);
    throw err;
  }
};