import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../../axios";

const UpdateSong = () => {
  const { id } = useParams();
  const [songDetails, setSongDetails] = useState({
    title: "",
    album_name: "",
    genre: "",
    artist_id: id,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const onChange = (e) => {
    setSongDetails({ ...songDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axiosInstance
      .get(`/songs/${id}`)
      .then((response) => {
        const { data } = response.data;
        console.log(data);
        setSongDetails(data.song);
      })
      .catch((err) => {
        console.error("Error fetching song details:", err);
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
    console.log(songDetails);

    setLoading(true);
    await axiosInstance
      .patch(`/songs/${id}`, songDetails)
      .then((response) => {
        console.log(response);
        setSuccess(true);
        setError("");
        setLoading(false);
        setSongDetails({
          dob: "",
          gender: "",
          address: "",
          first_release_year: "",
          no_of_albums_released: "",
        });
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      })
      .catch((err) => {
        console.log("Error updating song: ", err);
        if (!err.response) setToastMessage(err.message);
        else if (err.response.status < 500) setError(err.response.data.error);
        else setToastMessage(err.response.data.error);
      });
    setLoading(false);
  };

  useEffect(() => {
    if (success) {
      toast.success("Song updated successfully", { autoClose: 2000 });
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
            <p className="text-[1.7rem] font-semibold ">Edit Song</p>
          </span>
          <form
            className="flex flex-col h-fit justify-center rounded-md "
            onSubmit={onSubmit}
          >
            <label className="mb-2 text-md">Name</label>
            <input
              type="text"
              name="title"
              value={songDetails.title}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Title"
            />

            <label className="mb-2 text-md">Album Name</label>
            <input
              type="text"
              name="album_name"
              value={songDetails.album_name}
              required
              onChange={onChange}
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl"
              placeholder="Album Name"
            />

            <label htmlFor="genre" className="mb-2 text-md">
              Genre
            </label>
            <select
              name="genre"
              value={songDetails.genre}
              required
              className="bg-slate-200 focus:outline-none focus:border-transparent mb-4 px-5 py-3 rounded-3xl border-r-[20px]"
              onChange={onChange}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="rnb">RnB</option>
              <option value="country">Country</option>
              <option value="classic">Classic</option>
              <option value="rock">Rock</option>
              <option value="jazz">Jazz</option>
            </select>

            <div className="text-[0.9rem] text-red-600 text-right mb-4">
              {error}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex justify-end gap-2">
              <button
                type="cancel"
                disabled={loading}
                onClick={() => navigate(-1)}
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

export default UpdateSong;
