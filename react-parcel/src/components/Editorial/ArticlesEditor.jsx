import { useState } from "react"

const ArticlesEditor = () => {
  const [form, setForm] = useState([
    {
    title: '',
    description: '',
    body: '',
    tags: '',
    slug: '',
  },

    ]
)

  const handleChange = (e,index) => {
    const {name,value} = e.target 
    setForm((prev)=>
    prev.map((item,i)=>
    i === index
    ? {...item, [name]:value}
    : item
    )
    )
  }

  const addArticle = () => {
    setForm(prev=>
    [
      ...prev,
      {
    title: '',
    description: '',
    body: '',
    tags: '',
    slug: '',
      }
    ]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    localStorage.setItem(
      "articles",
      JSON.stringify(form)
    )

    alert("Article saved")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {
          form.map((article, idx)=>(
            <div key={idx} className="space-y-2 border p-4 bg-stone-300">
              <input 
              name="title"
              value={article.title}
              onChange={(e)=>handleChange(e,idx)}
              className="bg-white w-full p-2 rounded"
              placeholder="title"
              />

                      <input 
              name="description"
              value={article.description}
              onChange={(e)=>handleChange(e,idx)}
               className="bg-white w-full p-2 rounded"
              placeholder="description"
              />

                      <textarea 
              name="body"
              value={article.body}
              onChange={(e)=>handleChange(e,idx)}
               className="bg-white w-full p-2 rounded"
              placeholder="body"
              />

                      <input 
              name="tags"
              value={article.tags}
              onChange={(e)=>handleChange(e,idx)}
               className="bg-white w-full p-2 rounded"
              placeholder="tags"
              />
                      <input 
              name="slug"
              value={article.slug}
              onChange={(e)=>handleChange(e,idx)}
               className="bg-white w-full p-2 rounded"
              placeholder="slug"
              />
            </div>
          ))
        }

        <div className="flex w-full justify-around">
        <button 
        className="p-4 bg-blue-400 text-white"
        onClick={addArticle}
        type="button"
        >Add New</button>
        <button className="p-4 bg-green-400 text-white" type="submit">Save</button>
        </div>
    </form>
  )
}

export default ArticlesEditor
