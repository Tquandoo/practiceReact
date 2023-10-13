import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginRedux } from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState("false");

  const isLoading = useSelector((state) => state.user.isLoading);
  const account = useSelector((state) => state.user.account);
  // useEffect(() => {
  //   let token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/");
  //   }
  // }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email/password is required!");
      return;
    }
    dispatch(handleLoginRedux(email, password));
  };

  const handleGoBack = () => {
    navigate("/");
  };
  const handlePressEnter = (e) => {
    if (e && e.key === "Enter") {
      handleLogin();
    }
  };
  useEffect(() => {
    if (account && account.auth === true) {
      navigate("/");
    }
  }, [account]);
  return (
    <div className="login-container col-12 col-sm-4">
      <div className="title">Log In</div>
      <div className="text">
        <span>Email or usernamee (eve.holt@reqres.in)</span>
        <span>Log in with phone</span>
      </div>
      <input
        type="text"
        placeholder="Email or username..."
        className="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <div className="input-2">
        <input
          type={isShowPassword ? "password" : "text"}
          placeholder="Password..."
          className="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => handlePressEnter(e)}
        ></input>
        <i
          onClick={() => setIsShowPassword(!isShowPassword)}
          className={
            isShowPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
          }
        ></i>
      </div>
      <button
        className={email && password ? "active" : ""}
        disabled={email && password ? false : true}
        onClick={() => handleLogin()}
      >
        <i className={isLoading ? "fa-solid fa-sync fa-spin" : "disable"}></i>
        &nbsp; Login
      </button>
      <div className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <span onClick={() => handleGoBack()}> &nbsp; Go back</span>
      </div>
    </div>
  );
};
export default Login;
