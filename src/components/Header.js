import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Login from "./Login";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoApp from "../assets/images/logo192.png";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../redux/actions/userAction";

const Header = (props) => {
  const user = useSelector((state) => state.user.account);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(handleLogoutRedux());
  };

  useEffect(() => {
    if (
      user &&
      user.auth === false &&
      window.localStorage.pathname !== "/login"
    ) {
      navigate("/");
      toast.success("Log out success!");
    }
  }, [user]);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logoApp}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
            <span> Tquandoo's App</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {((user && user.auth) || window.location.pathname === "/") && (
              <>
                <Nav className="me-auto">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                  <NavLink to="/users" className="nav-link">
                    Manage Users
                  </NavLink>
                </Nav>
                <Nav>
                  {user && user.email && (
                    <span className="nav-link"> Welcome {user.email} </span>
                  )}
                  <NavDropdown
                    title="Setting"
                    id="basic-nav-dropdown"
                    className=" justify-content-end"
                  >
                    {user && user.auth === true ? (
                      <NavDropdown.Item onClick={() => handleLogout()}>
                        <NavLink to="/logout" className="nav-link">
                          Logout
                        </NavLink>
                      </NavDropdown.Item>
                    ) : (
                      <NavDropdown.Item>
                        <NavLink to="/login" className="nav-link">
                          Login
                        </NavLink>
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default Header;
