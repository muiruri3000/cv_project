import { useEffect,useState } from "react";
import { useNavigate } from "react-router";

const API_UR= process.env.REACT_APP_API_URL
const API_URL = `${API_UR}/api/featured-projects/`;

const ProjectsList = () => {

    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    },[]);
    const fetchProjects = async () => {
            try {
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error("Failed to fetch projects");
                const data = await res.json();
                setProjects(Array.isArray(data) ? data.slice(0,6) : []);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        }
    return (
        <section className="max-w-6xl mx-auto px-6 py-20" id="projects">
            <h2 className="text-3xl font-bold text-center mb-10">Top 6 Projects</h2>
        <div className="grid gap-8 md:grid-cols-3">
            {
                projects.map((project) => (
                    <div key={project.id}
                    onClick={()=>navigate(`/projects/${project.id}`)}
                    className="rounded-lg p-6 border border-dusk-accentHover bg-white cursor-pointer shadow-lg">
                        <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                            {project.description}
                        </p>
                        </div>
                )
                )
            }
        </div>
        </section>
    )
}

export default ProjectsList;