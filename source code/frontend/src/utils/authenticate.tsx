import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const authenticate = (username: string) => {
  localStorage.getItem("username");
  const navigate = useNavigate();
  useEffect(() => {
    if (!username) {
      navigate("/user/login");
    }
  }, [username]);
  return username;
};

export default authenticate;
