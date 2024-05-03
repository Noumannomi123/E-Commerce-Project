import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/user/signup" element={<Signup />} />
      </Routes>
    </>
  );
};

export default App;
