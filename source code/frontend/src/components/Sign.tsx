import { useState } from "react";
import logo from "../assets/logo.avif";
interface Props {
  heading: string;
  onHandleSubmit: (
    e: React.FormEvent,
    username: string,
    email: string,
    password: string,
    usertype: string
  ) => void;
  options: string[];
}
const Signup = (props: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    props.onHandleSubmit(e, username, email, password, usertype);
  };
  return (
    <>
      <div className="d-flex justify-content-center align-items-center bg-body-tertiary py-4 vh-100">
        <div className="form-signin w-25 m-25 text-center ">
          <form className="col-12" onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">{props.heading}</h1>
            <img src={logo} alt="Logo" height={200} width={200}/>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingUsername"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                required={true}
              />

              <label htmlFor="floatingUsername">User Name</label>
            </div>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
              <label htmlFor="floatingEmail">Email address</label>
            </div>

            <div className="form-floating position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pr-5"
                id="floatingPassword"
                placeholder="Password"
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "0.5rem",
                }}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash-fill"></i>
                ) : (
                  <i className="bi bi-eye-fill"></i>
                )}
                View
              </button>
            </div>

            <div className="form-floating">
              <select
                className="form-select"
                onChange={(e) => setUsertype(e.target.value)}
                required={true}
              >
                {props.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                )
              </select>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">
              {props.heading}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
