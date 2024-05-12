import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Instructor.css";
import { useEffect } from "react";

const Home = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  useEffect(() => {
    if (!username) {
      navigate("/user/login");
    }
  }, [username]);
  const item: string[] = ["Home", "My Courses"];
  const routes = ["/Instructor/Home", "/Instructor/MyCourses"];
  return (
    <>
      <Navbar items={item} routes={routes} />
      <div>
        <h1>Home</h1>
      </div>
    </>
  );
};

export default Home;
