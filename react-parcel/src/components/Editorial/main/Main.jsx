
const Main = ({children}) => {
    return <div className="flex flex-1 flex-col h-screen " >
    
    <div className=" bg-blue-100 pt-28 px-48 text-center text-xl">
        {children}
    </div>
    </div>
}

export default Main