import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const RiwayatPelatihanTeknis = () => {
const dataDummy = [
    {
        id: 1,
        nama: "Pelatihan Teknis",
        lainnya : "Pelatihan Teknis Lainnya",
        tanggalMulai: "01-01-2023",
        tanggalSelesai: "10-01-2023",
        jumlahJam: 40,
        nomorSTTP: "STTP-001",
        tanggalSTTP: "11-01-2023",
        jabatanPenandatangan: "Direktur Pelatihan",
        instansi: "Instansi Pelatihan B",
        lokasi: "Bandung"
    }
];

  return (
    <div id="pelatihan-teknis" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat Pelatihan Teknis
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
              Nama Pelatihan Teknis
            </th>
            <th className="p-3 border border-teal-500" colSpan={2}>
              Nama Teknis Lainnya
            </th>
            <th className="p-3 border border-teal-500" colSpan={2}>
              Tanggal
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Jumlah Jam</th>
            <th className="p-3 border border-teal-500" colSpan={3}>
              STTP
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Instansi Penyelenggara
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Pilihan</th>
          </tr>
          <tr className="bg-teal-900 text-white text-sm">
            <th className="p-3 border border-teal-500">Mulai</th>
            <th className="p-3 border border-teal-500">Selesai</th>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Jabatan Penandatangan</th>
            <th className="p-3 border border-teal-500">Instansi</th>
            <th className="p-3 border border-teal-500">Lokasi</th>
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
                <td className="p-3 border border-teal-500">{item.nama}</td>
                <td className="p-3 border border-teal-500">{item.lainnya}</td>
                <td className="p-3 border border-teal-500">{item.tanggalMulai}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSelesai}</td>
                <td className="p-3 border border-teal-500">{item.jumlahJam}</td>
                <td className="p-3 border border-teal-500">{item.nomorSTTP}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSTTP}</td>
                <td className="p-3 border border-teal-500">{item.jabatanPenandatangan}</td>
                <td className="p-3 border border-teal-500">{item.instansi}</td>
                <td className="p-3 border border-teal-500">{item.lokasi}</td>
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

export default RiwayatPelatihanTeknis;
