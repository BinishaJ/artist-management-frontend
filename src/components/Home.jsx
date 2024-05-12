import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import AddArtist from "./Artists/AddArtist";
import Artists from "./Artists/Artists";
import UpdateArtist from "./Artists/UpdateArtist";
import Error from "./Error";
import Header from "./Header";
import AddSong from "./Songs/AddSong";
import Songs from "./Songs/Songs";
import UpdateSong from "./Songs/UpdateSong";
import AddUser from "./Users/AddUser";
import UpdateUser from "./Users/UpdateUser";
import Users from "./Users/Users";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Routes>
          <Route path="/users">
            <Route path="" element={<Users />} />
            <Route path=":id" element={<UpdateUser />} />
            <Route path="add" element={<AddUser />} />
          </Route>
          <Route path="/artists">
            <Route path="" element={<Artists />} />
            <Route path="add" element={<AddArtist />} />
            <Route path=":id" element={<UpdateArtist />} />
            <Route path=":id/songs" element={<Songs />} />
            <Route path=":id/songs/add" element={<AddSong />} />
          </Route>
          <Route path="/songs/:id" element={<UpdateSong />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
