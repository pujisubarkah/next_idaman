import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const RiwayatKGB = () => {
const dataDummy = [
    {
        id: 1,
        golongan: "III/B",
        gaji: "Rp 3.000.000",
        nomorkgb: "KGB-001",
        tanggalsk: "01-01-2023",
        yadkgb: "01-01-2023",
        tahunkgb: "2023",
        bulankgb: "Januari",
        kgbtanggalsurat: "01-01-2023",
        nosuratkgb: "KGB-001",
     },
];

  return (
    <div id="kgb" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat KGB
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
              Golongan
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Gaji
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              KGB No SK
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tanggal SK </th>

            <th className="p-3 border border-teal-500" rowSpan={2}>Yad KGB</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Tahun KGB</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Bulan KGB</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>KGB Tanggal Surat</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>KGB No Surat</th>
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
                <td className="p-3 border border-teal-500">{item.golongan}</td>
                <td className="p-3 border border-teal-500">{item.gaji}</td>
                <td className="p-3 border border-teal-500">{item.nomorkgb}</td>
                <td className="p-3 border border-teal-500">{item.tanggalsk}</td>
                <td className="p-3 border border-teal-500">{item.yadkgb}</td>
                <td className="p-3 border border-teal-500">{item.tahunkgb}</td>
                <td className="p-3 border border-teal-500">{item.bulankgb}</td>
                <td className="p-3 border border-teal-500">{item.kgbtanggalsurat}</td>
                <td className="p-3 border border-teal-500">{item.nosuratkgb}</td>
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

export default RiwayatKGB;
