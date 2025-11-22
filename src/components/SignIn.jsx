import { Link } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "../firebase/auth";
import logo from "../assets/logo-google.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSignin = async () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

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

    setErrors(newErrors);
    if (!valid) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      setEmail("");
      setPassword("");
      setErrors({ email: "", password: "" });
      alert("Sign in successful!");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        setErrors((prev) => ({ ...prev, email: "User not found" }));
      } else if (error.code === "auth/wrong-password") {
        setErrors((prev) => ({ ...prev, password: "Wrong password" }));
      } else {
        alert("Error signing in: " + error.message);
      }
    }
  };

  const handleGoogleSignIn = () => {
    sessionStorage.setItem("redirectPending", "true");
    signInWithRedirect(auth, googleProvider);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <section className="bg-white p-10 rounded-lg shadow-lg w-96 sm:w-md">
        <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
        <p className="text-gray-500 mt-1">
          Welcome back! Enter your credentials to log in.
        </p>

        <form className="mt-6 flex flex-col gap-6">
          <label className="flex flex-col">
            <span className="font-medium text-gray-700 mb-2">Email</span>
            <input
              type="text"
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

          <button
            type="button"
            onClick={handleSignin}
            className="w-full bg-black! hover:bg-gray-900 hover:border-none! hover:outline-none! text-white py-2 rounded mt-2"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2 py-2 rounded mt-2"
          >
            <img src={logo} alt="google" className="h-6 w-6" /> Sign in with
            Google
          </button>

          <p className="text-gray-500 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default SignIn;
