const API_BASE = "http://backend:8000";

export const apiFetch = async(endpoint, options={})=>{
    const token = localStorage.getItem("access")


    const config = {
        ...options,
        headers:{
            "Content-Type":"application/json",
            ...(token && {"Authorization": `Bearer ${token}`}),
            ...options.headers
        }
    }
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if(!response.ok){
        console.error("API Error:", response.status, response.statusText);
        throw new Error(`API request failed: ${response.statusText}`);
    }
    return response;
}