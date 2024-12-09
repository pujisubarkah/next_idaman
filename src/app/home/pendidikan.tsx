"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

interface Pendidikan {
  tingpend_id: string;
  jurusan_id: string;
  riw_pendidikan_sttb_ijazah: string;
  riw_pendidikan_tanggal: string;
  riw_pendidikan_pejabat: string;
  riw_pendidikan_nm: string;
  riw_pendidikan_lokasi: string;
}

const RiwayatPendidikan = () => {
  const [dataPendidikan, setDataPendidikan] = useState<Pendidikan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (username: string) => {
    try {
      const res = await axios.get(`/api/riwayat/pendidikan?peg_id=${username}`, {
        headers: { "Cache-Control": "no-cache" },
      });

      if (Array.isArray(res.data.data)) {
        setDataPendidikan(res.data.data);
      } else {
        console.error("Data tidak valid:", res.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.username) {
      fetchData(user.username);
    } else {
      console.warn("User tidak ditemukan di localStorage.");
      setLoading(false);
    }
  }, []);

  return (
    <div id="pendidikan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT PENDIDIKAN</h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-teal-500">No</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Tingkat Pendidikan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Jurusan</th>
            <th colSpan={3} className="p-3 border border-teal-500">STTB/Ijazah</th>
            <th colSpan={2} className="p-3 border border-teal-500">Sekolah/Pendidikan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Pejabat</th>
            <th className="p-3 border border-teal-500">Nama</th>
            <th className="p-3 border border-teal-500">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center p-4">Memuat data...</td>
            </tr>
          ) : dataPendidikan.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataPendidikan.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{index + 1}</td>
                <td className="p-3 border border-teal-500">{item.tingpend_id}</td>
                <td className="p-3 border border-teal-500">{item.jurusan_id}</td>
                <td className="p-3 border border-teal-500">{item.riw_pendidikan_sttb_ijazah}</td>
                <td className="p-3 border border-teal-500">{item.riw_pendidikan_tanggal}</td>
                <td className="p-3 border border-teal-500">{item.riw_pendidikan_pejabat}</td>
                <td className="p-3 border border-teal-500">{item.riw_pendidikan_nm}</td>
                <td className="p-3 border border-teal-500">{item.riw_pendidikan_lokasi}</td>
                <td className="p-3 border border-teal-500">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
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
    </div>
  );
};

export default RiwayatPendidikan;
