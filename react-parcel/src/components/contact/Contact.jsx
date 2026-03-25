import { useState,useEffect } from "react"


const Contact = () => {
    const [profile,setProfile] = useState(
      {
        interestStatement:'',
        email:'',
        linkedIn:'',
        github:'',
        location:'',
        resumeLink:''
    }
    )
    const API_URL = process.env.REACT_APP_API_URL

    useEffect(()=>{
      const fetchProfile = async () => {
        try {
          const res = await fetch(`${API_URL}/api/profile/`)
          if (res.ok) {
            const data = await res.json()
            setProfile(data)
          } else {
            console.error("Failed to fetch profile", { status: res.status })
            }
          } catch (err) {
            console.error("Error fetching profile:", err)
          }
        }
        fetchProfile()
    },[])




    
    return  <section id="contact" className="bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20 ">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Contact
        </h2>

        <div className="mt-10 rounded-xl border border-slate-200 p-8 shadow-xl bg-white  border-l-4 border-l-blue-500">
          <p className="max-w-2xl text-gray-600">
         {profile.interestStatement}
          </p>

          <div className="mt-8 space-y-4 text-sm text-gray-700">
         
           <div>
              <span className="font-medium">Name:</span>{" "}
              <a
                href={`mailto:${profile.email}`}
                className="hover:underline"
              >
                {profile.name}
              </a>
            </div>
         
            <div>
              <span className="font-medium">Email:</span>{" "}
              <a
                href={`mailto:${profile.email}`}
                className="hover:underline"
              >
                {profile.email}
              </a>
            </div>

            <div>
              <span className="font-medium">LinkedIn:</span>{" "}
              <a
                href={profile.linkedIn}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                  {profile.linkedIn}
              </a>
            </div>

            <div>
              <span className="font-medium">GitHub:</span>{" "}
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {profile.github}
              </a>
            </div>

            <div>
              <span className="font-medium">Location:</span>{" "}
              {profile.location}
            </div>

            <div>
              <span className="font-medium">Resume:</span>{" "}
              <a
                href={profile.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Download PDF →
              </a>
            </div>
          </div>

          <p className="mt-10 text-sm text-blue-500">
            Let’s build secure, scalable, and reliable systems.
          </p>
        </div>
      </div>
    </section>
}


export default Contact