import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Riwayatpublikasi = () => {
const dataDummy = [
    {
        id: 1,
        judul: "Publikasi A",
        penerbit: "Penerbit A",
        Tahunterbit: "2023",
        Levelpenerbit: "Nasional",
        Linkpublikasi: "https://publikasi.com",
             },
];

  return (
    <div id="cuti" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat Publikasi
      </h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-teal-500" rowSpan={2}>No</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Judul
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Penerbit
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tahun Terbit
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Level Penerbit </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Link Publikasi</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Pilihan</th>
          </tr>
          
        </thead>

        <tbody>
          {dataDummy.length === 0 ? (
            <tr>
              <td colSpan={12} className="text-center p-4">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            dataDummy.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
              >
                <td className="p-3 border border-teal-500">{index + 1}</td>
                <td className="p-3 border border-teal-500">{item.judul}</td>
                <td className="p-3 border border-teal-500">{item.penerbit}</td>
                <td className="p-3 border border-teal-500">{item.Tahunterbit}</td>
                <td className="p-3 border border-teal-500">{item.Levelpenerbit}</td>
                <td className="p-3 border border-teal-500">{item.Linkpublikasi}</td>
             
      
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

export default Riwayatpublikasi;