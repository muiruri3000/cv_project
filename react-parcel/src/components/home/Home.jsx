
import Header from "../header/Header.jsx"
import Hero from "../hero/Hero.jsx"
import About from "../about/About.jsx"
import Skills from "../skills/Skills.jsx"
import DiagramArchitectures from "../../components/diagramArchitectures/DiagramArchitectures.jsx"
import Education from "../education/Education.jsx"
import Articles from "../articles/Articles.jsx"
import Contact from "../contact/Contact.jsx"
import SoftSkills from "../softskills/Softskills.jsx"
import Experience from "../experience/Experience.jsx"
import ScrollToSection from "../../sharedComponents/ScrollToSection.jsx"
import ProjectsList from "../projects/ProjectsList.jsx"

const Home = () => {
  return   <>
    <ScrollToSection />
     <Header />
    <Hero />
    <About />
    <Skills />
    <SoftSkills /> 
    <DiagramArchitectures />
    <ProjectsList />
    <Experience />
    <Education />
    <Articles />
    <Contact />
  </>
  
};

export default Home;