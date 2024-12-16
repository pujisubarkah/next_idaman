import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Riwayatcuti = () => {
const dataDummy = [
    {
        id: 1,
        jeniscuti: "Cuti Tahunan",
        nosurat: "STTP-001",
        tanggalMulai: "01-01-2023",
        tanggalSelesai: "10-01-2023",   
        keterangan: "Cuti Tahunan",
         },
];

  return (
    <div id="cuti" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat Cuti
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
              Jenis Cuti
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              No Surat
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tanggal Mulai
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tanggal Selesai </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Keterangan</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Aksi</th>
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
                <td className="p-3 border border-teal-500">{item.jeniscuti}</td>
                <td className="p-3 border border-teal-500">{item.nosurat}</td>
                <td className="p-3 border border-teal-500">{item.tanggalMulai}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSelesai}</td>
                <td className="p-3 border border-teal-500">{item.keterangan}</td>
      
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

export default Riwayatcuti;
