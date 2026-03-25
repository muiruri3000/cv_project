import { useNavigate } from "react-router-dom";
import { useAuth } from "../../security/AuthContext";

const navLinks = [
  {

    label:"Hero",
    id:"hero"
  },
  {

    label:"About",
    id:"about"
  },
  {

    label:"Skills",
    id:"skills"
  },
  {

    label:"Experience / Projects",
    id:"projects"
  },

  {

    label:"Blog",
    id:"articles"
  },
  {

    label:"Education",
    id:"education"
  },
  {
    label:"Contact",
    id:"contact"
  }
]


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const [open, setOpen] = useState(false);
  const {user, logout} = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login2", {replace:true})
  }


    useEffect(()=>{
        const handleResize = () => {
            if (window.innerWidth >= 768){
                setOpen(false)
            }
        };

        window.addEventListener("resize", handleResize)
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    },[])


  return (
    <header className="bg-dusk-accent fixed top-0 left-0 z-50 right-0 text-dusk-section shadow-lg" id="header">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-6 py-4">
   

        {/* Nav */}
        <nav
          className={`
            ${open ? "flex" : "hidden"}
            flex-col md:flex-row gap-6 text-sm font-medium
            md:flex`}
        >
          {
            navLinks.map((item)=>(

              <Link to={`/#${item.id}`} key={item.id} onClick={() => setOpen(false)} className="hover:underline">{item.label}</Link>
            ))
          }
          <Link to="/create"onClick={()=>setOpen(false)}>Create Content</Link>
          <Link to="/login2"onClick={()=>setOpen(false)}>Login</Link>
          {
            user && (
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded"
              >
                Log Out
              </button>
            )
          }
        </nav>

        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
};

export default Header;
