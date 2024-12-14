"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaKey, FaPlus } from "react-icons/fa";

const UserTable: React.FC = () => {
  interface User {
    id: number;
    nama: string;
    username: string;
    m_status: {
      role_name: string;
    };
    satuan_kerja_nama: string;
    status_aktif: number;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users/datauser");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
  return (
    <div className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">DAFTAR USER</h3>

      <div className="flex justify-between items-center mb-4">
        <button className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-700 flex items-center">
          <FaPlus className="mr-2" /> Tambah User
        </button>
        <div className="flex items-center space-x-4">
          <label className="mr-2">Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Pengguna..."
            className="p-2 border rounded"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-teal-700 rounded-lg overflow-hidden my-5">
          <thead className="bg-teal-900">
            <tr className="text-white">
              {["Nama", "Username", "Role", "Satuan Kerja", "Status Aktif", "Aksi"].map((header) => (
                <th key={header} className="p-3 border text-left font-bold uppercase text-sm">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map(({ id, nama, username, m_status, satuan_kerja_nama, status_aktif }, index) => (
                <tr key={id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                  <td className="p-3 border">{nama}</td>
                  <td className="p-3 border">{username}</td>
                  <td className="p-3 border">{m_status?.role_name}</td>
                  <td className="p-3 border">{satuan_kerja_nama}</td>
                  <td className="p-3 border">{status_aktif === 1 ? "Aktif" : "Tidak Aktif"}</td>
                  <td className="p-3 border">
                    <div className="flex space-x-4">
                      <button className="text-blue-500 hover:text-blue-700" aria-label="Reset Password">
                        <FaKey /> Reset
                      </button>
                      <button className="text-green-500 hover:text-green-700" aria-label="Edit User">
                        <FaEdit /> Edit
                      </button>
                      <button className="text-red-500 hover:text-red-700" aria-label="Delete User">
                        <FaTrash /> Delete
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
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
