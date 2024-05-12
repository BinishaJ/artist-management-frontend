import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const { pathname } = useLocation();
  return (
    <header className="min-h-[80px] bg-[#5130b0] flex justify-end items-center px-6 py-1">
      <NavLink
        to="/home/users"
        className={`mr-8 text-[1.2rem] hover:text-[#9f84f8] font-semibold text-white px-2 py-2 ${
          pathname === "/home/users" ? "border-b-2 border-white" : ""
        }`}
      >
        Users
      </NavLink>
      <NavLink
        to="/home/artists"
        className={`mr-8 text-[1.2rem] hover:text-[#9f84f8] font-semibold  text-white px-2 py-2 ${
          pathname === "/home/artists" ? "border-b-2 border-white" : ""
        } `}
      >
        Artists
      </NavLink>
      <NavLink
        to="/logout"
        className="mr-8 text-[1.2rem] hover:text-[#9f84f8] font-semibold  text-white px-2 py-2"
      >
        Logout
      </NavLink>
    </header>
  );
};

export default Header;
