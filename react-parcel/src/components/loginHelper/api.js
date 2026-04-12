export const apiFetch = async (endpoint, options = {}) => {
  let token = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  const makeRequest = async (tokenToUse) => {
    return fetch(`http://localhost:8000${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(tokenToUse && { Authorization: `Bearer ${tokenToUse}` }),
      },
    });
  };

  let response = await makeRequest(token);

  // 🔥 If token expired → refresh it
  if (response.status === 401 && refresh) {
    const refreshRes = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("access", data.access);

      // retry original request
      response = await makeRequest(data.access);
    } else {
      // refresh also failed → logout
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      throw new Error("Session expired. Please log in again.");
    }
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(result));
  }

  return result;
};