import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
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
