import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewUser = () => {
    const API_URL = process.env.REACT_APP_API_URL
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    })

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.username.trim()) newErrors.username = "Username is required";
        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!form.firstName.trim()) newErrors.firstName = "First name is required";
        if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!form.role) newErrors.role = "Role is required";
        setErrors(newErrors);
        return newErrors;
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleCreateUser = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try{
            const token = localStorage.getItem("access");
               if (!token) {
            throw new Error("No access token found. Please log in.");
        }
            const response = await fetch(`${API_URL}/api/create-user/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    username:form.username, password:form.password, first_name:form.firstName, last_name:form.lastName, 
                    email:form.email, 
                    role:form.role })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                   if (errorData.code === "token_not_valid") {
                throw new Error("Your session has expired. Please log in again.");
            }

                throw new Error("User creation failed");
            }
            const data = await response.json();
            console.log("User created:", data);
            navigate("/users")
        }
        catch(error){
            console.error("User creation failed:", error);
        }
    }
    return (
        <div className="mt-5 pt-5">

        <div>
                <h2>Create New User</h2>
        </div>
        <form onSubmit={handleCreateUser} noValidate>
            <div>

        <input placeholder="Username" value={form.username} onChange={handleChange} name="username" />
            </div>
            <div>

        <input placeholder="Password" value={form.password} onChange={handleChange} name="password" />
            </div>
            <div>

        <input placeholder="First Name" value={form.firstName} onChange={handleChange} name="firstName" />
            </div>
            <div>

        <input placeholder="Last Name" value={form.lastName} onChange={handleChange} name="lastName" />
            </div>
            <div>
                
        <input placeholder="Email" value={form.email} onChange={handleChange} name="email" />
            </div>
            <div>

        <select value={form.role} onChange={handleChange} name="role">
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
        </select>
            </div>
            <div>

        <button type="submit">Create User</button>
            </div>
        </form>
        </div>
    )
}

export default NewUser;