import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../../axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/users?page=${page}`);
        const { data } = response.data;
        console.log(data);
        setUsers(data.users);
        if (data.users.length > 0) {
          setTotalUsers(data.total_users);
          setTotalPages(Math.ceil(totalUsers / 10));
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response) setToastMessage(err.response.data.error);
        else setToastMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, totalUsers]);

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

  const onDeleteUser = async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      if (response) {
        setToastMessage("");
        console.log(response.data.data);
        setUsers(users.filter((user) => user.id !== id));
        setTotalUsers(totalUsers - 1);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      if (err.response) setToastMessage(err.response.data.error);
      else setToastMessage(err.message);
    }
  };

  return (
    <div className="px-8 md:px-8 py-6">
      <ToastContainer />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col">
          <NavLink to="/home/users/add" className="self-end">
            <button className="flex items-center bg-teal-700 hover:bg-teal-800 transition-colors duration-500 px-5 py-3 rounded-lg text-white mb-6 ">
              <MdAdd className="mr-1 text-xl font-semibold" />
              Add User
            </button>
          </NavLink>
          <div className="overflow-x-auto shadow-[0px_2px_4px_0_rgba(0,0,0,0.1)]">
            <table className="table-auto border-collapse border-2 border-gray-300 border-spacing-2 w-full">
              <thead className="text-base font-light">
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{new Date(user.dob).toLocaleDateString()}</td>
                    <td>
                      {user.gender === "f"
                        ? "Female"
                        : user.gender === "m"
                        ? "Male"
                        : "Others"}
                    </td>
                    <td>{user.address}</td>
                    <td>
                      <span className="flex justify-center">
                        <NavLink to={`/home/users/${user.id}`}>
                          <MdEdit className="text-xl text-blue-600 hover:text-blue-800 hover:cursor-pointer mr-1" />
                        </NavLink>
                        <MdDelete
                          className="text-xl text-red-600 hover:text-red-700 hover:cursor-pointer"
                          onClick={() => onDeleteUser(user.id)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="min-[500px]:flex mt-5">
            <p className="flex-grow max-[500px]:mb-3 max-[500px]:text-center">
              Showing {totalUsers ? (page - 1) * 10 + 1 : 0}-
              {page * 10 > totalUsers ? totalUsers : page * 10} of {totalUsers}{" "}
              entries
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

export default Users;
