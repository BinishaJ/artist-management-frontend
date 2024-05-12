import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdMusicNote } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../../axios";

const Artist = () => {
  const [artists, setArtist] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArtists, setTotalArtists] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axiosInstance.get(`/artists?page=${page}`);
        const { data } = response.data;
        console.log(data);
        setArtist(data.artists);
        if (data.artists.length > 0) {
          setTotalArtists(data.total_artists);
          setTotalPages(Math.ceil(totalArtists / 10));
        }
      } catch (err) {
        console.error("Error fetching artists:", err);
        if (err.response) setToastMessage(err.response.data.error);
        else setToastMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [page, totalArtists]);

  useEffect(() => {
    if (toastMessage) {
      toast.error(toastMessage, { autoClose: 3000 });
      setToastMessage(false);
    }
  }, [toastMessage]);

  const onNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const onPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const onDeleteArtist = async (id) => {
    try {
      const response = await axiosInstance.delete(`/artists/${id}`);
      if (response) {
        setToastMessage("");
        console.log(response.data.data);
        setArtist(artists.filter((artist) => artist.id !== id));
        setTotalArtists(totalArtists - 1);
      }
    } catch (err) {
      console.error("Error deleting artist:", err);
      if (err.response) setToastMessage(err.response.data.error);
      else setToastMessage(err.message);
    }
  };

  return (
    <div className="px-8 md:px-8 py-6 bg-gray-100">
      <ToastContainer />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col">
          <NavLink to="/home/artists/add" className="self-end">
            <button className="flex items-center bg-teal-700 hover:bg-teal-800 transition-colors duration-500 px-5 py-3 rounded-lg text-white mb-6 ">
              <MdAdd className="mr-1 text-xl font-semibold" />
              Add Artist
            </button>
          </NavLink>

          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {artists.length > 0 ? (
              artists.map((artist) => (
                <div
                  key={artist.id}
                  className=" py-6 px-8 rounded-md bg-white shadow-[0px_2px_4px_0_rgba(0,0,0,0.2)] border-solid border border-yellow-400 leading-[1.65rem]"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#67a577] rounded-[50%] w-fit py-2 px-4 text-white mr-3">
                      {artist.name[0].toUpperCase()}
                    </div>
                    <p>{artist.name}</p>
                  </div>
                  <p>
                    {artist.gender === "f"
                      ? "Female"
                      : artist.gender === "m"
                      ? "Male"
                      : "Others"}
                  </p>
                  <p>DOB: {new Date(artist.dob).toLocaleDateString()}</p>
                  <p>Address: {artist.address}</p>
                  <p>First Release Year: {artist.first_release_year}</p>
                  <p>Albums Released: {artist.no_of_albums_released}</p>
                  <p>Songs: {artist.songs}</p>
                  <span className="flex justify-end mt-2 text-2xl ">
                    <NavLink
                      to={`/home/artists/${artist.id}/songs`}
                      className="relative inline-block group"
                    >
                      <MdMusicNote className="text-yellow-500 hover:text-yellow-600 cursor-pointer mr-2" />
                      <span className="hidden group-hover:inline-block bg-black text-white text-xs px-2 py-1 rounded absolute -bottom-[1/2] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        Songs
                      </span>
                    </NavLink>
                    <NavLink
                      to={`/home/artists/${artist.id}`}
                      className="relative inline-block group"
                    >
                      <MdEdit className="text-blue-600 hover:text-blue-800 cursor-pointer mr-2" />
                      <span className="hidden group-hover:inline-block bg-black text-white text-xs px-2 py-1 rounded absolute -bottom-[1/2] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        Edit
                      </span>
                    </NavLink>
                    <div className="relative inline-block group">
                      <MdDelete
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                        onClick={() => onDeleteArtist(artist.id)}
                      />
                      <span className="hidden group-hover:inline-block bg-black text-white text-xs px-2 py-1 rounded absolute -bottom-[1/2] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        Delete
                      </span>
                    </div>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xl">Sorry! No artists Available!!</p>
            )}
          </div>

          <div className="min-[500px]:flex mt-7">
            <p className="flex-grow max-[500px]:mb-3 max-[500px]:text-center">
              Showing {totalArtists ? (page - 1) * 10 + 1 : 0}-
              {page * 10 > totalArtists ? totalArtists : page * 10} of{" "}
              {totalArtists} entries
            </p>
            <div className="flex max-[500px]:justify-center">
              <button
                onClick={onPrev}
                className={`mr-6 text-blue-600 hover:text-[#1942cc] ${
                  page === 1
                    ? "text-gray-400 hover:text-gray-400 hover:cursor-default"
                    : ""
                }`}
              >
                &lt;&lt;&nbsp;Previous
              </button>
              <button
                onClick={onNext}
                className={`text-blue-600 hover:text-[#1942cc] ${
                  page >= totalPages
                    ? "text-gray-400 hover:text-gray-400 hover:cursor-default"
                    : ""
                }`}
              >
                Next&nbsp;&gt;&gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artist;
