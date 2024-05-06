import Navbar from "../../components/Navbar";
import "./Instructor.css";

const Home = () => {
  const item: string[] = ["Home", "My Courses"];
  return (
    <>
      <Navbar items={item} />
    </>
  );
};

export default Home;
