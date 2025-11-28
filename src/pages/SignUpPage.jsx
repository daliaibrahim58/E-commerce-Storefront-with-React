import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from 'axios';
import { API_URLS } from "../api/config";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  
  const validateName = (name) =>/^[\p{L} ]{2,30}$/u.test(name.trim());
  const validateEmail = (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const handleSignUp = async (e) => {
    e.preventDefault();

    setUserNameError("");
    setEmailError("");
    setPasswordError("");
    setSubmitError("");

    let isValid = true;

    if (!userName) { setUserNameError("Name is required"); isValid = false; }
    else if (!validateName(userName)) { setUserNameError("Name must be 2-30 letters and spaces only"); isValid = false; }

    if (!email) { setEmailError("Email is required"); isValid = false; }
    else if (!validateEmail(email)) { setEmailError("Invalid email format"); isValid = false; }

    if (!password) { setPasswordError("Password is required"); isValid = false; }
    else if (!validatePassword(password)) { 
      setPasswordError("Password must be at least 6 chars, include 1 uppercase & 1 number"); 
      isValid = false; 
    }

    if (!agree) {
      setSubmitError("You must agree to Terms and Conditions");
      isValid = false;
    }
    
    if (!isValid) return;

    try {
      // check if email already exists
      const { data: existingUsers } = await axios.get(
        API_URLS.USERS
      );

      const emailUsed = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
      if (emailUsed) {
        setEmailError("Email is already used");
        return;
      }

      const postData = {
        id: Math.floor(Math.random() * 1000),
        userName,
        email,
        password,
        role: "user",
      };

      await axios.post(
        API_URLS.USERS,
        postData
      );
      navigate("/login");
    } catch (err) {
      console.error(err);
      setSubmitError("Sign up failed. Try again later.");
    }
  };
 return (
    <div className='flex justify-center items-center bg-gray-100 pt-4'>
      <section className='my-6 p-8 rounded-lg shadow-lg bg-white'>
       <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSignUp}>
          <div className="mb-1 flex flex-col gap-5">
            <Typography variant="h6" color={userNameError ? "red" : "blue-gray"} className="-mb-4">
              {userNameError ? userNameError : "Your Name"}
            </Typography>
            <Input
              size="lg"
              placeholder="userName"
              value={userName}
              onChange={(e) => { setUserName(e.target.value); setUserNameError(""); }}
              
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color={emailError ? "red" : "blue-gray"} className="-mb-4">
              {emailError ? emailError : "Email"}
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e)=>{setEmail(e.target.value);setEmailError("");}}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color={passwordError ? "red" : "blue-gray"} className="-mb-4">
              {passwordError ? passwordError : "Password"}
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          {submitError && <Typography className="text-red-500 text-sm mt-2">{submitError}</Typography>}
          <Checkbox
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                I agree the
                <a
                  
                  className="font-medium transition-colors hover:text-gray-900"
                >
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          
          <Button className="mt-6" fullWidth type='submit'
          >
            sign up
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link to='/login' className="font-medium text-gray-900">
              Sign In
            </Link>
          </Typography>
        </form>
      </Card>
      </section>
    </div>
  )
}

export default SignUpPage