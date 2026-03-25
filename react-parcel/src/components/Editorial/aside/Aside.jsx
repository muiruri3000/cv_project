import { NavLink } from "react-router-dom"
import { useAuth } from "../../../security/AuthContext"
const side_links = [
    {
     label:"Hero",
     path: "hero",
     roles:[ "editor","ADMIN"]
    },
    {

        label: "About",
        path: "about",
        roles:["ADMIN"]
    },
    {
        label: "Education",
        path: "education",
        roles:["editor","ADMIN"]
    },

    {
        label:"Skill",
        path:"skills",
        roles:["ADMIN"]
    },
        {
        label:"softSkills",
        path:"softSkills",
        roles:["ADMIN"]
    },
            {
        label:"Experience",
        path:"Experience",
        roles:["ADMIN"]
    },
                {
        label:"Architectures",
        path:"architecture",
        roles:["ADMIN"]
    },
                        {
        label:"Featured Project",
        path:"featured",
        roles:["ADMIN"]
    },
                            {
        label:"Articles",
        path:"articles",
        roles:["ADMIN"]
    },
                    {
        label:"Contact",
        path:"contact",
        roles:["ADMIN"]
    },
]
const Aside = () => {
    const {user} = useAuth()
return <div className="bg-blue-50 w-48 shadow-lg pt-8 ">
 
  <ul className="flex flex-col gap-1">
    {side_links.filter(link=>link.roles.includes(user.role))
    .map((link) => (
      <li key={link.path}>
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