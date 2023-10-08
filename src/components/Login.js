import { useContext, useEffect, useState } from "react";
import { loginApi } from "../services/UserService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { loginContext } = useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState("false");
  const [loadingAPI, setLoadingAPI] = useState(false);

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
    setLoadingAPI(true);
    let res = await loginApi(email, password);
    if (res && res.token) {
      loginContext(email, res.token);
      navigate("/");
    } else {
      if (res && +res.status === 400) {
        toast.error(res.data.error);
      }
    }
    setLoadingAPI(false);
  };

  const handleGoBack = () => {
    navigate("/");
  };
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
        <i className={loadingAPI ? "fa-solid fa-sync fa-spin" : "disable"}></i>
        &nbsp; Login
      </button>
      <div className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <span onClick={() => handleGoBack()}> &nbsp; Go back</span>
      </div>
      s
    </div>
  );
};
export default Login;
