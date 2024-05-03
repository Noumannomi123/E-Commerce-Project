import Sign from "../components/Sign";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Signup = () => {
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
      console.log(username, email, password, usertype);
      const res = await axios.post("http://localhost:5555/user/signup", {
        username,
        email,
        password,
        usertype,
      });
      console.log(res.data);

      if (usertype === "Instructor") {
        alert("Sign up successful as instructor\nLoggin in.");
        navigate("/Instructor/Home");
      }
      if (usertype === "Student") {
        alert("Sign up successful as student\nLoggin in.");
        navigate("/Student/Home");
      }
      if (usertype === "Admin") {
        alert("Sign up successful as admin\nLoggin in.");
        navigate("/Admin/Home");
      }
    } catch (error: any) {
      console.log(error.response?.data.error);
      if (error.response?.request.status === 400) alert("User already exists");
      else alert("An error occurred while signing up. Check console.");
    }
  };
  const options =["Select User Type", "Instructor", "Student", "Admin"]
  return <Sign heading="Sign up" options={options} onHandleSubmit={handleSubmit} />;
};

export default Signup;
