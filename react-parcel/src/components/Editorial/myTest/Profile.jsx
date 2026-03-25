// // import cvApi from '../../../assets/api/cvApi'
// import { useState,useEffect } from 'react'

// const Profile = () => {
// const [prof, setProf] = useState({})
// const [loading, setLoading] = useState(true)

// useEffect(()=>{
//     cvApi.getProfile()

//     .then(data=>{
//         setProf(data)
//     })
//     .catch(err=>{
//         console.error(err)
//     })
//     .finally(()=>{
//         setLoading(false)
//     })
// },[])

// if (loading) return <p>Loading...</p>
// return (
//     <div>
//         {prof.name} || {prof.role}
//     </div>
// )
// }

// export default Profile;