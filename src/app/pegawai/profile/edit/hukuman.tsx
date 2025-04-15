"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const CatatanHukuman = () => {
  interface HukumanType {
    no: number;
    kategori: string;
    namaHukuman: string;
    noSk: string;
    tanggalSk: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    keterangan: string;
  }

  const [data, setData] = useState<HukumanType[]>([]);

  useEffect(() => {
    const dummyData: HukumanType[] = [
      {
        no: 1,
        kategori: "Sedang",
        namaHukuman: "Penurunan Pangkat",
        noSk: "123/ABC/2022",
        tanggalSk: "2022-05-01",
        tanggalMulai: "2022-06-01",
        tanggalSelesai: "2022-12-01",
        keterangan: "Terlambat masuk kerja lebih dari 30 hari.",
      },
    ];
    setData(dummyData);
  }, []);

  return (
    <div className="p-8">
      <h3 className="text-center text-xl font-semibold my-8 text-[#3781c7]">
        Catatan Hukuman Disiplin
      </h3>

      <div className="flex justify-end mb-4">
        <button className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-[#3781c7] rounded-lg">
          <thead className="bg-[#3781c7] text-white">
            <tr className="text-sm uppercase text-center">
              <th className="p-3 border border-[#f2bd1d]">No</th>
              <th className="p-3 border border-[#f2bd1d]">Kategori Hukuman</th>
              <th className="p-3 border border-[#f2bd1d]">Nama Hukuman</th>
              <th className="p-3 border border-[#f2bd1d]" colSpan={2}>
                SK
              </th>
              <th className="p-3 border border-[#f2bd1d]" colSpan={2}>
                Lama
              </th>
              <th className="p-3 border border-[#f2bd1d]">Keterangan Pelanggaran</th>
              <th className="p-3 border border-[#f2bd1d]">Pilihan</th>
            </tr>
            <tr className="bg-[#4d94d8] text-white text-sm text-center">
              <th></th>
              <th></th>
              <th></th>
              <th className="p-2 border border-[#f2bd1d]">No SK</th>
              <th className="p-2 border border-[#f2bd1d]">Tanggal SK</th>
              <th className="p-2 border border-[#f2bd1d]">Tanggal Mulai</th>
              <th className="p-2 border border-[#f2bd1d]">Tanggal Selesai</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
                >
                  <td className="p-3 border border-[#f2bd1d] text-center">{item.no}</td>
                  <td className="p-3 border border-[#f2bd1d] text-center">{item.kategori}</td>
                  <td className="p-3 border border-[#f2bd1d] text-center">{item.namaHukuman}</td>
                  <td className="p-3 border border-[#f2bd1d] text-center">{item.noSk}</td>
                  <td className="p-3 border border-[#f2bd1d] text-center">{item.tanggalSk}</td>
                  <td className="p-3 border border-[#f2bd1d] text-center">{item.tanggalMulai}</td>
                  <td className="p-3 border border-[#f2bd1d] text-center">{item.tanggalSelesai}</td>
                  <td className="p-3 border border-[#f2bd1d]">{item.keterangan}</td>
                  <td className="p-3 border border-[#f2bd1d] text-center">
                    <div className="flex space-x-4 justify-center">
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
                        <FontAwesomeIcon icon={faTrash} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatatanHukuman;
