import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from 'axios';
import { AuthContext } from '../App';
import { API_URLS } from "../api/config";

const LoginPage = () => {
  const { setAuth } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const handlelogin = async (e) => {
    e.preventDefault();
    setEmailError(""); 
    setPasswordError(""); 
    setLoginError("");

    let isValid = true;
    if (!email) { setEmailError("Email is required"); 
      isValid = false; }
    else if (!validateEmail(email)) { 
      setEmailError("Invalid email format");
      isValid = false; }

    if (!password) { setPasswordError("Password is required"); isValid = false; }
    else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters, include 1 uppercase letter and 1 number");
      isValid = false;
    }
    if (!isValid) return;

    const url = API_URLS.USERS;

    try {
      const response = await axios.get(url);
      const users = response.data;
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        setLoginError("Invalid email or password");
        return;
      }

      const role = user.role || (user.email === "admin@example.com" ? "admin" : "user");
      localStorage.setItem("user", JSON.stringify({ ...user, role, userName: user.userName }));
      setAuth({ isLoggedIn: true, role, userName: user.userName });

      role === 'admin' ? navigate('/admin/dashboard') : navigate('/');
    } catch (err) {
      console.error(err);
      setLoginError("Login failed, try again later");
    }
  }

  return (
    <div className='flex justify-center items-center bg-gray-100'>
      <section className="my-16  p-8 w-[450px] rounded-lg shadow-lg text-center bg-white">
        <Typography variant="h3" color="blue-gray" className="mb-2">Sign In</Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </Typography>

        <form className="mx-auto max-w-[24rem] text-left" onSubmit={handlelogin}>
          <div className="mb-6">
            <label htmlFor="email">
              <Typography 
                variant="small" 
                className={`mb-2 block font-medium ${emailError ? "text-red-500" : "text-gray-900"}`}
              >
                {emailError ? emailError : "Email"}
              </Typography>
            </label>
            <Input
              id="email"
              type="email"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password">
              <Typography 
                variant="small" 
                className={`mb-2 block font-medium ${passwordError ? "text-red-500" : "text-gray-900"}`}
              >
                {passwordError ? passwordError : "Password"}
              </Typography>
            </label>
            <Input
              type={passwordShown ? "text" : "password"}
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              icon={<i onClick={togglePasswordVisiblity}>{passwordShown ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}</i>}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
            />
          </div>

          {loginError && <Typography className="text-red-500 text-sm mb-4">{loginError}</Typography>}

          <Button color="gray" size="lg" fullWidth type="submit">Sign In</Button>

          <div className="!mt-4 flex justify-end">
            <Typography
              as="a"
              href="#"
              onClick={(e) => e.preventDefault()}
              color="blue-gray"
              variant="small"
              className="font-medium"
            >
              Forgot password
            </Typography>
          </div>

          <Typography variant="small" color="gray" className="!mt-4 text-center font-normal">
            Not registered? <Link to='/signup' className="font-medium text-gray-900">Create account</Link>
          </Typography>
        </form>
      </section>
    </div>
  )
}

export default LoginPage;
