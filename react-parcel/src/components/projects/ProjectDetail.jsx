import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router";
const API_UR = process.env.REACT_APP_API_URL
const API_URL = `${API_UR}/api/featured-projects/`;

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetchProject();
    },[id]);

    const fetchProject = async () => {
        try{
            const res = await fetch(`${API_URL}${id}/`);
            if (!res.ok) throw new Error("Failed to fetch project");
            const data = await res.json();
            setProject(data);
        } catch (err) {
            console.error("Failed to fetch project", err);
        }

    };
    if (!project) return null;

    return (
        <section className="max-w-4xl mx-auto px-6 py-20">
        <button
        onClick={() => navigate(-1)
        }
        className="mb-6 text-sm text-blue-500 hover:underline"
        >
            ← Back to Projects
        </button>
        <h1
        className="text-3xl font-bold mb-4"
        >
            {project.title}
        </h1>
        <p className="text-gray-700 mb-6">
            {project.description}
        </p>

        {
            project.features && (
                <>
                <h3 
                className="font-semibold mb-2"
                >
                    Key Features
                </h3>
                <ul 
                className="list-disc list-inside mb-6 text-gray-600"
                >
                    {
                        project.features.split("\n").map((f,i)=>(
                            <li key={i}>{f}</li>
                        ))
                    }
                </ul>
                </>
            )
        }

        <div className="flex gap-4">
            {
                project.demo_link && (
                <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline rounded px-3 py-2 text-white">
                    Live Demo
                </a>
                )
            }

            {
                project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline rounded px-3 py-2 text-white">
                    Source Code
                </a>
                )
            }

        </div>
        </section>
    )
}
export default ProjectDetail;