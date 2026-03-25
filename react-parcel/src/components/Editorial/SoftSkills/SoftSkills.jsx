// import { useEffect, useState } from "react"
// import SoftSkillsEditor from "../SoftSkillsEditor"

// const createEmptySoftSkill = () => ({
//   title: "",
//   desc: "",
// })

// const SoftSkillsManager = () => {
//   const [savedSkills, setSavedSkills] = useState([])
//   const [editorForm, setEditorForm] = useState(createEmptySoftSkill())
//   const [editingIndex, setEditingIndex] = useState(null)

//   // Load saved soft skills
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("softSkills"))
//     if (Array.isArray(saved)) setSavedSkills(saved)
//   }, [])

//   const handleEditorChange = (field, value) => {
//     setEditorForm(prev => ({ ...prev, [field]: value }))
//   }

//   const saveEntry = () => {
//     const updated =
//       editingIndex !== null
//         ? savedSkills.map((item, i) =>
//             i === editingIndex ? editorForm : item
//           )
//         : [...savedSkills, editorForm]

//     localStorage.setItem("softSkills", JSON.stringify(updated))
//     setSavedSkills(updated)
//     setEditorForm(createEmptySoftSkill())
//     setEditingIndex(null)
//   }

//   const editEntry = (index) => {
//     setEditorForm(savedSkills[index])
//     setEditingIndex(index)
//   }

//   const deleteEntry = (index) => {
//     const updated = savedSkills.filter((_, i) => i !== index)
//     setSavedSkills(updated)
//     localStorage.setItem("softSkills", JSON.stringify(updated))

//     if (editingIndex === index) {
//       setEditorForm(createEmptySoftSkill())
//       setEditingIndex(null)
//     }
//   }

//   return (
//     <div className="max-w-4xl space-y-6">
//       <h3 className="text-3xl font-bold">Soft Skills Manager</h3>

//       {/* Editor */}
//       <SoftSkillsEditor
//         softSkill={editorForm}
//         onChange={handleEditorChange}
//       />

//       {/* Actions */}
//       <div className="flex gap-4">
//         <button
//           type="button"
//           onClick={saveEntry}
//           className="bg-green-500 text-white p-3 rounded"
//         >
//           {editingIndex !== null ? "Update" : "Save"} Skill
//         </button>

//         <button
//           type="button"
//           onClick={() => {
//             setEditorForm(createEmptySoftSkill())
//             setEditingIndex(null)
//           }}
//           className="bg-blue-400 text-white p-3 rounded"
//         >
//           + New Skill
//         </button>
//       </div>

//       {/* Saved list */}
//       <div className="mt-6">
//         <h3 className="text-2xl font-bold">Saved Soft Skills</h3>

//         {savedSkills.length === 0 && (
//           <p className="text-gray-500">No soft skills added yet.</p>
//         )}

//         {savedSkills.map((skill, idx) => (
//           <div
//             key={idx}
//             className="flex justify-between items-center border-b py-2"
//           >
//             <span>{skill.title || `Skill ${idx + 1}`}</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => editEntry(idx)}
//                 className="text-blue-600 text-sm"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => deleteEntry(idx)}
//                 className="text-red-600 text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default SoftSkillsManager
