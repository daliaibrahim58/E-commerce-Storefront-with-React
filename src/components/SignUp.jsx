import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase/auth";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";

const PRIMARY_GREEN = "#00A53E";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();

  // Minimal useEffect for redirect handling
  useEffect(() => {
    const redirectFlag = sessionStorage.getItem("redirectPending");
    if (!redirectFlag) return;
    getRedirectResult(auth).then(console.log).catch(console.error);
    return () => sessionStorage.removeItem("redirectPending");
  }, []);

  // Validation functions (kept for functionality)
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  // Form submission handlers (kept for functionality)
  const handleSignup = () => {
    if (
      !isValidEmail(email) ||
      !isValidPassword(password) ||
      !passwordMatch ||
      !firstName ||
      !lastName
    )
      return;
    createUserWithEmailAndPassword(auth, email, password)
      .then(console.log)
      .catch(console.error);
  };
  const handleGoogleSignup = () => {
    sessionStorage.setItem("redirectPending", "true");
    signInWithRedirect(auth, googleProvider);
  };
  const handleGithubSignup = () => {
    signInWithPopup(auth, githubProvider)
      .then(console.log)
      .catch(console.error);
  };
  const isPasswordMatch = (e) => {
    const value = e.target.value;
    setConfirmedPassword(value);
    setPasswordMatch(value === password);
  };

  return (
    // START: Centering Wrapper Box
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Horizontal centering
        alignItems: "center", // Vertical centering
        minHeight: "100vh", // Full viewport height
        py: 4, // Padding for small screens
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 800,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" align="center">
          Create Account
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Enter your details to get started
        </Typography>

        <Box
          component="form"
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* First & Last Name */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              variant="filled"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="filled"
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            variant="filled"
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Passwords */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Password */}
            <FormControl fullWidth variant="filled">
              <InputLabel>Password</InputLabel>
              <FilledInput
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* Confirm Password */}
            <FormControl
              fullWidth
              variant="filled"
              error={confirmedPassword && !passwordMatch}
            >
              <InputLabel>Confirm Password</InputLabel>
              <FilledInput
                type={showPassword ? "text" : "password"}
                value={confirmedPassword}
                onChange={isPasswordMatch}
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>

          {/* Feedback / Forgot Password */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: 20,
            }}
          >
            {confirmedPassword && !passwordMatch ? (
              <Typography color="error" variant="caption">
                Passwords do not match
              </Typography>
            ) : confirmedPassword && passwordMatch ? (
              <Typography color="green" variant="caption">
                Passwords match
              </Typography>
            ) : (
              <Box />
            )}
            <Button sx={{ color: PRIMARY_GREEN, textTransform: "none" }}>
              Forgot Password?
            </Button>
          </Box>

          {/* Create Account Button */}
          <Button
            onClick={handleSignup}
            variant="contained"
            sx={{ bgcolor: PRIMARY_GREEN }}
          >
            Create Account
          </Button>
        </Box>

        {/* Divider */}
        <Divider sx={{ width: "100%", my: 1 }}>
          <Typography color="text.secondary">Or continue with</Typography>
        </Divider>

        {/* Social Login */}
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <Button
            onClick={handleGoogleSignup}
            variant="outlined"
            fullWidth
            sx={{ color: "black", borderColor: "#BCACAC" }}
          >
            <Box
              component="img"
              src="/google.png"
              alt="google"
              sx={{
                width: 20,
                height: 20,
                mr: 1,
                transform: "rotate(90deg)", // Rotate the image 90 degrees
              }}
            />
            Google
          </Button>
          <Button
            onClick={handleGithubSignup}
            variant="outlined"
            fullWidth
            sx={{ color: "black", borderColor: "#BCACAC" }}
          >
            <Box
              component="img"
              src="/github.png"
              alt="github"
              sx={{ width: 20, height: 20, mr: 1 }}
            />
            GitHub
          </Button>
        </Box>

        {/* Login Prompt */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Typography color="text.secondary" sx={{ mr: 1 }}>
            Already have an account?
          </Typography>
          {/* Navigate to Sign In */}
          <Link to="/signin" style={{ textDecoration: "none" }}>
            <Button variant="text" sx={{ color: PRIMARY_GREEN }}>
              Sign In
            </Button>
          </Link>
        </Box>
      </Paper>
    </Box>
    // END: Centering Wrapper Box
  );
}

export default Signup;
