import { useNavigate } from "react-router-dom";
import Sign from "../components/Sign";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = async (
    e: React.FormEvent,
    username: string,
    email: string,
    password: string,
    usertype: string
  ) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5555/user/login", {
        username,
        email,
        password,
        usertype,
      });
      alert("Logged in successfully");
      if (usertype === "Instructor") navigate("/Instructor/Home");
      if (usertype === "Student") navigate("/Student/Home");
      if (usertype === "Admin") navigate("/Admin/Home");
    } catch (error: any) {
      console.log(error);
      if (error.response?.request.status === 404) alert("User not found");
      else if (error.response?.request.status === 401)
        alert("Invalid Password");
      else alert("Something went wrong.");
    }
  };

  const options = ["Select User Type", "Instructor", "Student", "Admin"];
  return (
    <Sign heading="Log in" options={options} onHandleSubmit={handleSubmit} />
  );
};

export default Login;
