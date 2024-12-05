"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faRedo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users", {
          params: {
            searchQuery,
            page: currentPage,
            itemsPerPage,
          },
        });
        console.log("Fetched data:", response.data);
        const { data } = response.data;
        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchData();
  }, [currentPage, searchQuery, itemsPerPage]);
  
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleResetPassword = (userId) => {
    alert(`Reset password for user ID: ${userId}`);
  };

  const handleEditUser = (userId) => {
    alert(`Edit user with ID: ${userId}`);
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      alert(`Delete user with ID: ${userId}`);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">DAFTAR PENGGUNA</h3>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="mr-2">Show:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari Pengguna..."
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
          <thead className="bg-teal-600">
            <tr className="bg-teal-900 text-white">
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Nama</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Username</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Role</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Satuan Kerja</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Status Aktif</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No users found.
                </td>
              </tr>
            ) : (
                users.map(({ 
                    id, 
                    nama, 
                    username, 
                    satuan_kerja_nama, 
                    status_aktif, 
                    m_status: { role_name } 
                  }, index) => (
                <tr key={id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                  <td className="p-3 border border-teal-500">{nama}</td>
                  <td className="p-3 border border-teal-500">{username}</td>
                  <td className="p-3 border border-teal-500">{role_name}</td>
                  <td className="p-3 border border-teal-500">{satuan_kerja_nama}</td>
                  <td className="p-3 border border-teal-500">
                    {status_aktif === 1 ? "Aktif" : "Tidak Aktif"}
                  </td>
                  <td className="p-3 border border-teal-500">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleResetPassword(id)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Reset Password"
                      >
                        <FontAwesomeIcon icon={faRedo} /> Reset Password
                      </button>
                      <button
                        onClick={() => handleEditUser(id)}
                        className="text-green-500 hover:text-green-700"
                        aria-label="Edit User"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete User"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListUsers;
