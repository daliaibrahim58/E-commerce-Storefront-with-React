import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/auth";
import logo from "../assets/logo-google.png";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    checkbox: "",
  });

  useEffect(() => {
    const redirectFlag = sessionStorage.getItem("redirectPending");
    if (!redirectFlag) return;
    getRedirectResult(auth).then(console.log).catch(console.error);
    return () => sessionStorage.removeItem("redirectPending");
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSignup = async () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "", checkbox: "" };

    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!isValidPassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include a number";
      valid = false;
    }
    if (!agree) {
      newErrors.checkbox = "You must agree to Terms and Conditions";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      setName("");
      setEmail("");
      setPassword("");
      setAgree(false);
      setErrors({ name: "", email: "", password: "", checkbox: "" });
      alert("Signup successful!");
      await auth.signOut();
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setErrors((prev) => ({ ...prev, email: "Email is already in use" }));
      } else if (error.code === "auth/invalid-email") {
        setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      } else if (error.code === "auth/weak-password") {
        setErrors((prev) => ({ ...prev, password: "Password is too weak" }));
      } else {
        alert("Error signing up: " + error.message);
      }
    }
  };

  const handleGoogleSignup = () => {
    sessionStorage.setItem("redirectPending", "true");
    signInWithRedirect(auth, googleProvider);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <section className="bg-white p-10 rounded-lg shadow-lg w-96 sm:w-md">
        <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
        <p className="text-gray-500 mt-1">
          Nice to meet you! Enter your details to register.
        </p>

        <form className="mt-6 flex flex-col gap-6">
          <label className="flex flex-col">
            <span className="font-medium text-gray-700 mb-2">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="userName"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </label>

          <label className="flex flex-col">
            <span className="font-medium text-gray-700 mb-2">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </label>

          <label className="flex flex-col">
            <span className="font-medium text-gray-700 mb-2">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="h-4 w-4"
            />
            <span className="text-gray-700 text-sm">
              I agree to{" "}
              <a href="#" className="text-blue-500">
                Terms and Conditions
              </a>
            </span>
          </label>
          {errors.checkbox && (
            <span className="text-red-500 text-sm">{errors.checkbox}</span>
          )}

          <button
            type="button"
            onClick={handleSignup}
            className="w-full bg-black! hover:bg-gray-900 hover:border-none! hover:outline-none! text-white py-2 rounded mt-2"
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2 py-2 rounded mt-2"
          >
            <img src={logo} alt="google" className="h-6 w-6" /> Sign up with
            Google
          </button>

          <p className="text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default SignUp;
