import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/SignUp";
import SignIn from "./components/SignIn";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
