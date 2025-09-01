import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormField from "../components/FormField";
import FormPassword from "../components/FormPassword";
import FormFooter from "../components/FormFooter";
import { Link } from "react-router-dom";
import ProcessWrapper from "../components/ProcessWrapper";
import FormImg from "../components/FormImg";
import api from "../utils/axios";
import { useDispatch } from "react-redux";
import { setLoginData } from "../redux/reducer/loginSlice";


function Login() {
  const data = {
    title: "Hello, again!",
    para: "Fresh bids & smart analytics are just a click away! Never miss an opportunity.",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h1",
    pSize: "text-xl",
  };
  const formHeader = {
    title: "Register",
    link: "/register",
    steps: "",
    activeStep: "",
  };
  const formFooter = {
    back: {
      text: "Don’t  have an account, Register",
      link: "/register",
    },
    next: {
      text: "Login",
      link: "/",
    },
  };

  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Real-time validation: only show error for invalid email format or password < 6
  const validateField = (name, value) => {
    let msg = "";
    if (name === "email" && value && !emailRegex.test(value)) {
      msg = "Please enter a valid email";
    } else if (name === "password" && value && value.length < 6) {
      msg = "Please enter a valid password";
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
    setLoginError(""); // Clear login error on change
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const getMessageType = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "error" : "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    // Only check for empty fields and format errors
    let valid = true;
    let newErrors = { ...errors };
    if (!fields.email || !emailRegex.test(fields.email)) {
      newErrors.email = !fields.email ? "Please enter a valid email format" : errors.email;
      valid = false;
    }
    if (!fields.password || fields.password.length < 6) {
      newErrors.password = !fields.password ? "Please enter a valid password" : errors.password;
      valid = false;
    }
    setErrors(newErrors);
    if (!valid) return;
    try {
      const res = await api.post("/auth/login/", fields);
      const loginPayload = {
        user: res.data.user,
  access: res.data.access,
      }
      if (res.data && res.data.access) {
        localStorage.setItem("access_token", res.data.access);
      }
      dispatch(setLoginData(loginPayload));
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setLoginError("Invalid email or password");
      } else if (err.response) {
        setLoginError("Invalid email or password");
      } else {
        setLoginError("Network Error: " + err.message);
      }
    }
  };

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3  flex flex-col h-full justify-between">
          <div className="">
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>
          <form
            action=""
            method="post"
            className="flex flex-col justify-between h-full"
            onSubmit={handleLogin}
          >
            <div className="">
              <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="e.g. jopseph.mark12@gmail.com"
                delay={100}
                value={fields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                message={errors.email}
                messageType={getMessageType("email")}
              />
              <FormPassword
                label="Password"
                placeholder="e.g. m@rkJos6ph"
                name="password"
                id="password"
                delay={100}
                value={fields.password}
                onChange={handleChange}
                onBlur={handleBlur}
                message={errors.password}
                messageType={getMessageType("password")}
              />
              <div className="float-right pr-20">
              {loginError && (
                <div style={{ marginTop: "2px", color: "#ef4444", fontSize: "15px" }}>{loginError}</div>
              )}
              </div>
              <Link to="/forgot-password" >  
               <span className="text-white text-sm underline">Forgot Password</span>
               </Link>
            </div>

           
            <FormFooter data={formFooter} onNextClick={handleLogin} />
          </form>
        </div>
      </div>
      <div className="sticky top-0">
        <FormImg src={"loginbid.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default Login;