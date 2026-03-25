export const createEmptyContact = () => ({
  name:"",
  title:"",
  interestStatement: "",
  email: "",
  linkedIn: "",
  github: "",
  location: "",
  resumeLink: "",
})

const ContactEditor = ({ contact = createEmptyContact(), onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  return (
    <div className="space-y-4 border p-4 rounded bg-stone-200">
     
      <input
        type="text"
        name="name"
        value={contact.name}
        onChange={handleChange}
        placeholder="Joseph Muiruri"
        className="w-full p-2 border rounded"
      />
          <input
        type="text"
        name="title"
        value={contact.title}
        onChange={handleChange}
        placeholder="Web Developer"
        className="w-full p-2 border rounded"
      />
     
      <textarea
        name="interestStatement"
        value={contact.interestStatement}
        onChange={handleChange}
        placeholder="Bio"
        className="w-full p-2 border rounded"
        rows={4}
      />

      <input
        type="email"
        name="email"
        value={contact.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="linkedIn"
        value={contact.linkedIn}
        onChange={handleChange}
        placeholder="LinkedIn"
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="github"
        value={contact.github}
        onChange={handleChange}
        placeholder="GitHub"
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="location"
        value={contact.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="resumeLink"
        value={contact.resumeLink}
        onChange={handleChange}
        placeholder="Resume link"
        className="w-full p-2 border rounded"
      />
    </div>
  )
}

export default ContactEditor
