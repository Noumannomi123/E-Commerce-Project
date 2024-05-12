import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Instructor/Home";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import AddCourse from "./pages/Instructor/AddCourse";
import EditCourse from "./pages/Instructor/EditCourse";

const App = () => {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/Instructor/Home" element={<Home />} />
        <Route path="/Instructor/AddCourse/:username" element={<AddCourse />} />
        <Route path="/Instructor/EditCourse/:id" element={<EditCourse />} />
      </Routes>
    </>
  );
};

export default App;
