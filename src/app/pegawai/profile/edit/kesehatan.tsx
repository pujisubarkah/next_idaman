"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const RiwayatKesehatan = () => {
  interface RiwayatKesehatanType {
    no: number;
    namaPenyakit: string;
    tindakLanjut: string;
  }

  const [data, setData] = useState<RiwayatKesehatanType[]>([]);

  useEffect(() => {
    // Simulasi fetch data
    const dummyData: RiwayatKesehatanType[] = [
      {
        no: 1,
        namaPenyakit: "Demam Berdarah",
        tindakLanjut: "Rawat Inap 3 Hari",
      },
      {
        no: 2,
        namaPenyakit: "Asma",
        tindakLanjut: "Kontrol Rutin",
      },
    ];

    setData(dummyData);
  }, []);

  return (
    <div className="p-8">
      <h3 className="text-center text-xl font-semibold my-8 text-[#3781c7]">
        Riwayat Kesehatan
      </h3>

      <div className="flex justify-end mb-4">
        <button className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-[#f2bd1d]">No</th>
            <th className="p-3 border border-[#f2bd1d]">Nama Penyakit</th>
            <th className="p-3 border border-[#f2bd1d]">Tindak Lanjut Pengobatan</th>
            <th className="p-3 border border-[#f2bd1d]">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
              >
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.namaPenyakit}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tindakLanjut}</td>
                <td className="p-3 border border-[#f2bd1d]">
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

export default RiwayatKesehatan;
