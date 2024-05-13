import axios from "axios";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.get("/user/logout");
      navigate("/user/login");
    } catch (error) {
      alert("Unable to login.");
      console.log(error);
    }
  };
  return (
    <button className="btn btn-primary mx-5" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
