const Button = ({ children }) => {
  return (
    <button className="p-2 rounded bg-blue-500 hover:bg-blue-600 transition text-white m-5">
      {children}
    </button>
  );
}


export default Button;
