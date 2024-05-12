import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../../axios";

const UpdateArtist = () => {
  const { id } = useParams();
  const [artistName, setArtistName] = useState("");
  const [artistDetails, setArtistDetails] = useState({
    dob: "",
    gender: "",
    address: "",
    first_release_year: "",
    no_of_albums_released: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const onChange = (e) => {
    setArtistDetails({ ...artistDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axiosInstance
      .get(`/artists/${id}`)
      .then((response) => {
        const { data } = response.data;
        console.log(data);
        const { name, ...artistDetails } = data.artist;
        const dob = new Date(data.artist.dob);
        const formattedDob = `${dob.getFullYear()}-${(dob.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${dob.getDate().toString().padStart(2, "0")}`;
        setArtistName(name);
        setArtistDetails({
          ...artistDetails,
          dob: formattedDob,
        });
      })
      .catch((err) => {
        console.error("Error getting artist details:", err);
        if (!err.response) setToastMessage(err.message);
        else if (err.response.status === 404) {
          setToastMessage(err.response.data.error);
          setTimeout(() => {
            navigate("/home/artists");
          }, 3000);
        } else setToastMessage(err.response.data.error);
      });
    setLoading(false);
  }, [id, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(artistDetails);

    //  DOB
    if (new Date(artistDetails.dob) > new Date()) {
      setError("Invalid Date of Birth");
      return;
    }

    // release year
    if (
      artistDetails.first_release_year > new Date().getFullYear() ||
      artistDetails.first_release_year < 1900
    ) {
      setError("Invalid Release Year");
      return;
    }

    // albums released
    if (artistDetails.no_of_albums_released < 0) {
      setError("Invalid Albums Released");
      return;
    }

    setLoading(true);
    await axiosInstance
      .patch(`/artists/${id}`, artistDetails)
      .then((response) => {
        console.log(response);
        setSuccess(true);
        setError("");
        setLoading(false);
        setArtistDetails({
          dob: "",
          gender: "",
          address: "",
          first_release_year: "",
          no_of_albums_released: "",
        });
        setArtistName("");
        setTimeout(() => {
          navigate("/home/artists");
        }, 3000);
      })
      .catch((err) => {
        console.error("Error updating artist details:", err);

        if (!err.response) setToastMessage(err.message);
        else if (err.response.status < 500) setError(err.response.data.error);
        else setToastMessage(err.response.data.error);
      });
    setLoading(false);
  };

  useEffect(() => {
    if (success) {
      toast.success("Artist updated successfully", { autoClose: 2000 });
      setSuccess(false);
    }
  }, [success]);

  useEffect(() => {
    if (toastMessage) {
      toast.error(toastMessage, { autoClose: 3000 });
      setToastMessage(false);
    }
  }, [toastMessage]);

  return (
    <div className="p-8 bg-[#e4e5e5] flex flex-col justify-center items-center min-h-full">
      <ToastContainer />
      <div className="w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] shadow-[0px_2px_10px_0_rgba(0,0,0,0.2)]">
        <div className="bg-slate-100 p-12">
          <span className="flex justify-center items-center mb-5">
            <p className="text-[1.7rem] font-semibold ">Edit Artist</p>
          </span>
          <form
            className="flex flex-col h-fit justify-center rounded-md "
            onSubmit={onSubmit}
          >
            <label className="mb-2 text-md">Name</label>
            <input
              type="text"
              name="name"
              readOnly
              value={artistName}
              className="cursor-default bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
            />

            <label className="mb-2 text-md">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={artistDetails.dob}
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
              value={artistDetails.gender}
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
              value={artistDetails.address}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Address"
            />

            <label className="mb-2 text-md">First Release Year</label>
            <input
              type="number"
              name="first_release_year"
              value={artistDetails.first_release_year}
              required
              min="1980"
              max={new Date().getFullYear()}
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="First Release Year"
            />

            <label className="mb-2 text-md">Albums Released</label>
            <input
              type="number"
              name="no_of_albums_released"
              value={artistDetails.no_of_albums_released}
              required
              min="0"
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Albums Released"
            />

            <div className="text-[0.9rem] text-red-600 text-right mb-4">
              {error}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex justify-end gap-2">
              <button
                type="cancel"
                disabled={loading}
                onClick={() => navigate("/home/artists")}
                className="flex items-center justify-center bg-pink-600 text-white px-1 py-3 rounded-3xl mt-2 text-base hover:bg-pink-700 transition-colors duration-500 w-full md:w-24 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center bg-teal-600 text-white px-1 py-3 rounded-3xl mt-2 text-base hover:bg-teal-700 transition-colors duration-500 w-full md:w-24"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateArtist;
