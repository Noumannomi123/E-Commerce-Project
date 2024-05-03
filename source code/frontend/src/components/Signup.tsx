import { useState } from "react";
import axios from "axios";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5555/user/signup", {
        username,
        email,
        password,
      });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="d-flex align-items-center vh-100 bg-body-tertiary py-4">
        <div className="container form-signin w-25 m-auto text-center">
          <form className="col-12" onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">Sign up</h1>
            <div className="form-floating">
              <input
                type="username"
                className="form-control"
                id="floatingUserName"
                placeholder="noumannomi123"
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="floatingInput">User Name</label>
            </div>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="btn btn-primary w-100 py-2" type="submit">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
