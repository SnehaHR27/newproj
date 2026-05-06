import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/config";
import toast from "react-hot-toast";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isSignIn = type === "sign-in";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully. Please sign in.");
        navigate("/sign-in");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully.");
        navigate("/");
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error?.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      } else if (
        error?.code === "auth/invalid-credential" ||
        error?.code === "auth/wrong-password" ||
        error?.code === "auth/user-not-found"
      ) {
        errorMessage = "Invalid email or password.";
      } else if (error?.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <div className="w-full max-w-md border border-gray-800 rounded-2xl bg-gray-900 p-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/logo.png" alt="PrepWise" className="w-10 h-10 object-contain" />
          <h2 className="text-2xl font-bold text-cyan-400">PrepWise</h2>
        </div>
        <h3 className="text-center text-gray-400 mb-6">
          Practice job interviews with AI
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isSignIn && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-300">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading
              ? "Please wait..."
              : isSignIn
              ? "Sign In"
              : "Create an Account"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            to={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-cyan-400 ml-1 hover:underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
