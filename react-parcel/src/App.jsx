import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./security/AuthContext"

import Header from "./components/header/Header"
import ScrollToSection from "./sharedComponents/ScrollToSection"
import Home from "./components/home/Home"
import Create from "./components/Editorial/create/Create"
import DashboardLayout from "./components/Editorial/DashboardLayout"
// import AboutEditor from "./components/Editorial/AboutEditor"
// import SkillsEditor from "./components/Editorial/SkillsEditor"
// import ContactEditor from "./components/Editorial/ContactEditor"
// import HeroEditor from "./components/Editorial/HeroEditor"
// import EducationEditor from "./components/Editorial/EducationEditor"
// import ProjectsEditor from "./components/Editorial/ProjectsEditor"
// import ExperienceEditor from "./components/Editorial/ExperienceEditor"
// import ArchitectureEditor from "./components/Editorial/ArchitectureEditor"
// import SoftSkillsEditor from "./components/Editorial/SoftSkillsEditor"
import ArticlesManager from "./components/Editorial/Articles/ArticlesManager"
import ExperienceManager from "./components/Experience/ExperienceManager"
import RequireAuth from "./security/RequireAuth"
import AboutManager from "./components/Editorial/About/AboutManager"
// import Profile from "./components/Editorial/myTest/Profile"

import RequireRole from "./security/RequireRole"
import Login from "./components/login/Login"
import Unauthorized from "./components/Unauthorized"
import ArticleEditor from "./components/Editorial/Articles/ArticlesEditor"
import ContactManager from "./components/Editorial/Contact/ContactManager"
import SkillsManager from "./components/Editorial/Skills/SkillsManager"
import SoftSkillsManager from "./components/softskills/SoftSkillsManager"
import EducationManager from "./components/Editorial/Education/EducationManager"
import ProjectsManager from "./components/Editorial/Projects/ProjectsManager"
import ArchitectureManager from "./components/Editorial/Architecture/ArchitectureManager"
import HeroManager from "./components/Editorial/Hero/HeroManager"
import FeaturedProjectManager from "./components/Editorial/FeaturedManager"
import ProjectsList from "./components/projects/ProjectsList"
import ProjectDetail from "./components/projects/ProjectDetail"
import Login2 from "./components/login2/Login2"
import NewUser from "./components/NewUser"
import Dashboard from "./components/dashboard/Dashboard"
function App() {


  return (
 <AuthProvider>
 <BrowserRouter>
  <ScrollToSection />
  <Header />



  <Routes>
    <Route path="/" element={<Home/>}/>
  
    <Route path="/login2" element={<Login2/>}/>
    <Route path="new-user" element={<NewUser/>}/>
    <Route path="/login2" element={<Login2/>}/>
    <Route path="/unauthorized" element={<Unauthorized/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/projects/:id" element={<ProjectDetail />} />


    <Route path="/create" 
    element={
          <RequireAuth>
    <RequireRole allowedRoles={["ADMIN","editor"]}>
    <DashboardLayout/>
     </RequireRole>
    </RequireAuth>
  }
    
    >
 



    <Route index element={<Navigate to="hero" replace/>}/>
    
    <Route path="about" element={<AboutManager/>}/>
    <Route path="contact" element={<ContactManager/>}/>
    <Route path="hero" element={<HeroManager/>}/>
    <Route path="education" element={<EducationManager/>}/>
    <Route path="projects" element={<ProjectsManager/>}/>
    <Route path="skills" element={<SkillsManager/>}/>
    <Route path="projects" element={<ProjectsList/>}/>
    <Route path="architecture" element={<ArchitectureManager/>}/>
    <Route path="experience" element={<ExperienceManager/>}/>
    <Route path="softSkills" element={<SoftSkillsManager/>}/>
    <Route path="featured" element={<FeaturedProjectManager/>}/>
    <Route path="articles" element={<ArticlesManager/>}/>
    <Route path="articlesEditor" element={<ArticleEditor/>}/>
    
    </Route>
    {/* <Route path="/aboutEditor" element={<AboutEditor/>}/> */}
    

  </Routes>
  </BrowserRouter>
  {/* <Profile/> */}
</AuthProvider>  
)
}

export default App
