import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (email && password) {
      setLoading(true);
      await axiosInstance
        .post("/admin/login", {
          email,
          password,
        })
        .then((response) => {
          console.log(response);
          localStorage.setItem("token", response.data.data.token);
          setEmail("");
          setPassword("");
          navigate("/home/users");
        })
        .catch((err) => {
          console.log("Error logging in: ", err);
          if (!err.response) setToastMessage(err.message);
          else if (err.response.status < 500) setError(err.response.data.error);
          else setToastMessage(err.response.data.error);
        });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      toast.error(toastMessage, { autoClose: 3000 });
      setToastMessage(false);
    }
  }, [toastMessage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home/users");
  });

  return (
    <div className="p-8 md:p-0 bg-[#beebd6] flex flex-col justify-center items-center md:bg-slate-200 min-h-screen">
      <ToastContainer />
      <p className="md:hidden text-3xl font-bold my-8 text-teal-800 text-center">
        Artist Management System
      </p>
      <div className="md:grid md:grid-cols-2 md:w-[80%] lg:w-[50%]">
        <div className="bg-slate-100 p-12">
          <span className="flex justify-center items-center mb-5">
            <FiLogIn className="mr-4 text-2xl text-red-500" />
            <p className="text-2xl font-semibold ">Log In</p>
          </span>
          <form
            className="flex flex-col h-fit justify-center rounded-md "
            onSubmit={onLogin}
          >
            <label className="mb-2 text-md">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Email"
            />

            <label className="mb-2 text-md">Password</label>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-200 focus:outline-none focus:border-transparent  px-5 py-3 rounded-3xl w-full"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-5 text-gray-600 text-lg"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {error && (
              <div className="text-[0.9rem] text-red-600 text-left mb-4 border-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white px-1 py-3 rounded-3xl mt-2 text-base hover:bg-teal-700 transition-colors duration-500"
            >
              Log In
            </button>

            <p className="md:hidden mt-3 text-center">
              Don't have an account?
              <br />
              <a
                href="/register"
                className="text-teal-600 hover:text-teal-800 hover:underline transition-all duration-500"
              >
                Create account
              </a>
            </p>
          </form>
        </div>
        <div className="hidden md:flex bg-teal-600 px-6 py-8 flex-col items-center justify-center text-slate-50">
          <p className="text-3xl font-bold text-center">
            Artist Management System
          </p>
          <p className="mt-6 text-base">Don't have an account?</p>
          <a href="/register">
            <button className="border-solid border-[1px] px-6 py-[0.6rem] rounded-3xl mt-3 text-base font-semibold hover:bg-slate-100 hover:text-teal-700 transition-colors duration-1000">
              Sign Up
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;
