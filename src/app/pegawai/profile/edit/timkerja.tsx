"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Riwayattimkerja = () => {
  interface DataTimKerja {
    no: number;
    namakegiatan: string;
    peran: string;
    nomorsk: string;
    tahun: string;
    tingkat: string;
    penandatangan: string;
  }

  const [data, setData] = useState<DataTimKerja[]>([]);
    const [nip, setNip] = useState<string | null>(null);



const fetchRiwayattimkerja = async (nip: string) => {
  try {
    const response = await axios.get(
      `/api/kinerja/timkerja?peg_id=${nip}`
    );
    
    const mappedData = response.data.map((item: any, index: number) => ({
      no: index + 1,
      namakegiatan: item.timkerja_nama,
      peran: item.timkerja_peran,
      nomorsk: item.timkerja_nomor,
      tahun: item.timkerja_tahun,
      tingkat: item.timkerja_tingkat,
      penandatangan: item.timkerja_penandatangan,
    }));

    setData(mappedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

useEffect(() => {
  const path = window.location.pathname;
  const segments = path.split("/");
  const nipFromUrl = segments[segments.length - 1];
  setNip(nipFromUrl);
}, []);

useEffect(() => {
  if (nip) {
    fetchRiwayattimkerja(nip);
  }
}, [nip]);



  return (
    <div id="timkerja" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat Tim Kerja
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
              Nama Kegiatan
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Peran
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Nomor SK
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tahun  </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Tingkat</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Penandatangan</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Pilihan</th>
          </tr>
          
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={12} className="text-center p-4">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
              >
                <td className="p-3 border border-teal-500">{index + 1}</td>
                <td className="p-3 border border-teal-500">{item.namakegiatan}</td>
                <td className="p-3 border border-teal-500">{item.peran}</td>
                <td className="p-3 border border-teal-500">{item.nomorsk}</td>
                <td className="p-3 border border-teal-500">{item.tahun}</td>
                <td className="p-3 border border-teal-500">{item.tingkat}</td>
                <td className="p-3 border border-teal-500">{item.penandatangan}</td>
               
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

export default Riwayattimkerja;
