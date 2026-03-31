import { NavLink } from "react-router-dom"
import { useAuth } from "../../../security/AuthContext"
const side_links = [
    {
     id:1,
     label:"Hero",
     path: "hero",
     roles:[ "editor","ADMIN"]
    },
    {
          id:2,
        label: "About",
        path: "about",
        roles:["ADMIN"]
    },
    {
        id:3,
        
      label: "Education",
        path: "education",
        roles:["editor","ADMIN"]
    },

    {
        id:4,
        label:"Skill",
        path:"skills",
        roles:["ADMIN"]
    },
        {
        id:5, 
        label:"softSkills",
        path:"softSkills",
        roles:["ADMIN"]
    },
            {
        id:6,
        label:"Experience",
        path:"Experience",
        roles:["ADMIN"]
    },
                {
        id:7,
        label:"Architectures",
        path:"architecture",
        roles:["ADMIN"]
    },
                        {
        id:8,
        label:"Featured Project",
        path:"featured",
        roles:["ADMIN"]
    },
                            {
        id:9,
        label:"Articles",
        path:"articles",
        roles:["ADMIN"]
    },
                    {
        id:10,
        label:"Contact",
        path:"contact",
        roles:["ADMIN"]
    },
]
const Aside = () => {
    const {user} = useAuth()
return <div className="w-64 pt-24 h-screen">
 
  <ul className="flex flex-col gap-3">
    {side_links.filter(link=>link.roles.includes(user.role))
    .map((link) => (
      <li key={link.id}>
        <NavLink
          to={link.path}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md transition
             ${isActive
               ? "bg-blue-300 text-white py-4 font-medium"
               : "hover:bg-stone-300"}`
          }
        >
          {link.label}
        </NavLink>
      </li>
    ))}
  </ul>

</div>
}

export default Aside