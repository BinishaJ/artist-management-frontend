import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../../axios";

const Songs = () => {
  const { id } = useParams();
  const [songs, setSong] = useState([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axiosInstance.get(`/artists/${id}/songs`);
        const { data } = response.data;
        console.log(data);
        setSong(data.songs);
        setTotalSongs(data.total_songs);
      } catch (err) {
        console.error("Error fetching songs:", err);
        if (err.response) setToastMessage(err.response.data.error);
        else setToastMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id]);

  useEffect(() => {
    if (toastMessage) {
      toast.error(toastMessage, { autoClose: 3000 });
      setToastMessage(false);
    }
  }, [toastMessage]);

  const onDeleteSong = async (id) => {
    try {
      const response = await axiosInstance.delete(`/songs/${id}`);
      if (response) {
        setToastMessage("");
        console.log(response.data.data);
        setSong(songs.filter((song) => song.id !== id));
        setTotalSongs(totalSongs - 1);
      }
    } catch (err) {
      console.error("Error deleting song:", err);
      if (err.response) setToastMessage(err.response.data.error);
      else setToastMessage(err.message);
    }
  };

  return (
    <div className="px-8 md:px-8 py-6 bg-gray-100 h-full">
      <ToastContainer />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col">
          <NavLink to={`/home/artists/${id}/songs/add`} className="self-end">
            <button className="flex items-center bg-teal-700 hover:bg-teal-800 transition-colors duration-500 px-5 py-3 rounded-lg text-white mb-6 ">
              <MdAdd className="mr-1 text-xl font-semibold" />
              Add Song
            </button>
          </NavLink>

          {songs.length === 0 ? (
            <>No Songs available for the artist</>
          ) : (
            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className=" py-6 px-8 rounded-md bg-white shadow-[0px_2px_4px_0_rgba(0,0,0,0.2)] border-solid border border-yellow-400 leading-[1.65rem]"
                >
                  <p>Title: {song.title}</p>
                  <p>Album Name: {song.album_name}</p>
                  <p className="capitalize">Genre: {song.genre}</p>
                  <span className="flex justify-end mt-2 text-2xl ">
                    <NavLink
                      to={`/home/songs/${song.id}`}
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
                        onClick={() => onDeleteSong(song.id)}
                      />
                      <span className="hidden group-hover:inline-block bg-black text-white text-xs px-2 py-1 rounded absolute -bottom-[1/2] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        Delete
                      </span>
                    </div>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Songs;
