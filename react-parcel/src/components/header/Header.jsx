import { useNavigate } from "react-router-dom";
import { useAuth } from "../../security/AuthContext";
import navLinks from "../../assets/headerLinks/headerLinks.js";
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
    <header className="bg-dusk-accent fixed top-0 left-0 z-50 right-0 text-dusk-section shadow-lg p-5" id="header">
      <div className="logo">

        <span className="text-4xl font-bold">Muiruri Portfolio
          </span><br/>
      </div>
      <div className="max-w-7xl mx-auto flex items-center justify-between relative px-6 py-4">
   

        {/* Nav */}
   <nav
  className={`
    ${open ? "flex" : "hidden"}
    fixed top-20 left-0 w-full mobile-nav
    flex-col gap-4 text-sm font-medium p-6
    bg-black shadow-lg z-40
    md:static md:flex md:flex-row md:w-auto md:p-0 md:gap-6 md:bg-transparent md:shadow-none
  `}
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
          className="md:hidden cursor-pointer absolute top-0 cancel-btn rounded-md text-white text-xl hover:text-3xl"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
};

export default Header;
