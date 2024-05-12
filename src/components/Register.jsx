import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../axios";

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const onRegister = async (e) => {
    e.preventDefault();
    console.log(userDetails);
    setError("");

    // DOB
    if (new Date(userDetails.dob) > new Date()) {
      setError("Invalid Date of Birth");
      return;
    }

    // password
    if (userDetails.password.length < 8) {
      setError("Password must be at least 8 characters!");
      return;
    }

    setLoading(true);
    await axiosInstance
      .post("/admin/register", userDetails)
      .then((response) => {
        console.log(response);
        setSuccess(true);
        setUserDetails({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone: "",
          dob: "",
          gender: "",
          address: "",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        console.log("Error registering: ", err);
        if (!err.response) setToastMessage(err.message);
        else if (err.response.status < 500) setError(err.response.data.error);
        else setToastMessage(err.response.data.error);
      });
    setLoading(false);
  };

  useEffect(() => {
    if (toastMessage) {
      toast.error(toastMessage, { autoClose: 3000 });
      setToastMessage(false);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (success) {
      toast.success("Admin created successfully", { autoClose: 3000 });
      setSuccess(false);
    }
  }, [success]);

  return (
    <div className="p-8 bg-[#c3d0e0] flex flex-col justify-center items-center min-h-full">
      <ToastContainer />
      <div className="w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <div className="bg-slate-100 p-12">
          <span className="flex justify-center items-center mb-5">
            <p className="text-2xl font-semibold ">Register</p>
          </span>
          <form
            className="flex flex-col h-fit justify-center rounded-md "
            onSubmit={onRegister}
          >
            <label className="mb-2 text-md">First Name</label>
            <input
              type="text"
              name="first_name"
              value={userDetails.first_name}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="First Name"
            />
            <label className="mb-2 text-md">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={userDetails.last_name}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Last Name"
            />
            <label className="mb-2 text-md">Email</label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Email"
            />

            <label className="mb-2 text-md">Password</label>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userDetails.password}
                onChange={onChange}
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

            <label className="mb-2 text-md">Phone</label>
            <input
              type="text"
              name="phone"
              value={userDetails.phone}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Phone"
            />

            <label className="mb-2 text-md">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={userDetails.dob}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Date of Birth"
            />

            <label htmlFor="gender" className="mb-2 text-md">
              Gender
            </label>
            <select
              name="gender"
              value={userDetails.gender}
              required
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl border-r-[20px]"
              onChange={onChange}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="o">Others</option>
            </select>

            <label className="mb-2 text-md">Address</label>
            <input
              type="text"
              name="address"
              value={userDetails.address}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Address"
            />

            <div className="text-[0.9rem] text-red-600 text-right mb-4">
              {error}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white px-1 py-3 rounded-3xl mt-2 text-base hover:bg-teal-700 transition-colors duration-500"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
