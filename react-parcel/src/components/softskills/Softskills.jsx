// const soft_skills = [
//   {
//     skill:' Communication',
//     description:'Communicate technical concepts clearly and concisely to engineers, stakeholders, and non-technical audiences.'
//   },
//   {
//     skill:'Stakeholder Communication',
//     description:'Engage stakeholders by translating business requirements into technical solutions and clearly explaining trade-offs and risks.'
//   },
//   {
//     skill:'Collaboration',
//     description:' Work effectively across cross-functional teams to deliver end-to-end solutions.'
//   },
//   {
//     skill:' Problem Solving',
//     description:'Approach complex problems analytically and break them down into practical, well-structured solutions.'
//   },
//   {
//     skill:'Decision Making Under Constraints',
//     description:'Make informed decisions by balancing time, cost, risk, and technical constraints in real-world scenarios.'
//   },
//   {
//     skill:'Ownership',
//     description:'Take responsibility for outcomes, from initial design through delivery, operation, and continuous improvement.'
//   },
  
// ]


import { useState,useEffect } from "react";
const SoftSkills = () => {
const [softSkills, setSoftSkills] = useState([])
useEffect(()=>{
    const saved = localStorage.getItem("softSkills")
    if (saved){
      setSoftSkills(JSON.parse(saved))
    }
},[])
if (!softSkills.length) return null
  return (
    <section id="softskills" className="bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Soft Skills
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
    

     {
      softSkills.map((skill,idx)=>(

     

          <div className="rounded-xl  bg-white p-6 shadow-xl" key={idx}>
            <h3 className="text-lg font-semibold">
              {skill.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
          {skill.desc}
            </p>
          </div>
           ))
     }
        </div>
      </div>
    </section>
  );
}
export default SoftSkills