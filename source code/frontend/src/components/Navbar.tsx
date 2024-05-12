import { useLocation, useNavigate } from "react-router-dom";
import Logout from "./Logout";

interface Props {
  items: string[];
  routes: string[];
}
const Navbar = ({ items, routes }: Props) => {
  const {state} = useLocation();
  const {username} = state;
  const navigate = useNavigate();
  const handleNav = (route: string) =>{
    navigate(route, {
      state: {username: username}
    });
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid mx-5">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {items.map((item, index) => (
                <li className="nav-item" key={index}>
                  <a className="nav-link fw-semibold" onClick={() => {handleNav(routes[index])}}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <Logout />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
