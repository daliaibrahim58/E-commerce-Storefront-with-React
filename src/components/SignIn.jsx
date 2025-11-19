import {
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { useEffect, useState } from "react";
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

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- UI Handlers ---
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();

  // --- Firebase Logic ---
  useEffect(() => {
    const redirectFlag = sessionStorage.getItem("redirectPending");
    if (!redirectFlag) return;

    getRedirectResult(auth)
      .then((result) => {
        if (result === null) return;
        console.log("Redirect login detected!", result.user);
      })
      .catch(console.error);

    return () => {
      sessionStorage.removeItem("redirectPending");
    };
  }, []);

  const handleSignIn = () => {
    if (!email || !password) {
      console.log("Please enter both email and password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User Signed In:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error:", error.code, error.message);
      });
  };

  const handleGoogleSignup = () => {
    sessionStorage.setItem("redirectPending", "true");
    signInWithRedirect(auth, googleProvider);
  };

  const handleGithubSignup = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => console.log("GitHub User:", result.user))
      .catch(console.error);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h4" align="center">
          Sign In
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Welcome back! Please enter your details.
        </Typography>

        <Box component="form" noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

          {/* Forgot Password */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button sx={{ color: PRIMARY_GREEN, textTransform: "none" }}>Forgot Password?</Button>
          </Box>

          {/* Sign In Button */}
          <Button
            onClick={handleSignIn}
            variant="contained"
            sx={{
              bgcolor: PRIMARY_GREEN,
              py: 1.5,
              fontSize: "1.2rem",
              width: "100%",
              borderRadius: "12px",
              "&:hover": { bgcolor: "#00912F" },
            }}
          >
            Sign In
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
            sx={{
              color: "black",
              borderColor: "#BCACAC",
              py: 1.2,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/google.png"
              alt="google"
              sx={{ width: 24, height: 24, mr: 1, transform: "rotate(90deg)" }}
            />
            Google
          </Button>

          <Button
            onClick={handleGithubSignup}
            variant="outlined"
            fullWidth
            sx={{
              color: "black",
              borderColor: "#BCACAC",
              py: 1.2,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box component="img" src="/github.png" alt="github" sx={{ width: 24, height: 24, mr: 1 }} />
            GitHub
          </Button>
        </Box>

        {/* Sign Up Prompt */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography color="text.secondary" sx={{ mr: 1 }}>
            Don't have an account?
          </Typography>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <Button sx={{ color: PRIMARY_GREEN, p: 0 }}>Sign Up</Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

export default SignIn;
