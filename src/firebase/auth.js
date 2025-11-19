import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
