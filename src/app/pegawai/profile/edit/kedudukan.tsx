"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatKedudukanHukum = () => {
  interface RiwayatKedudukanData {
    no: number;
    status: string;
    noSk: string;
    tanggalSk: string;
    tmt: string;
    unitKerja: string;
  }

  const [data, setData] = useState<RiwayatKedudukanData[]>([]);
  const [nip, setNip] = useState<string | null>(null);

  const formatTanggal = (tanggal: string) => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const date = new Date(tanggal);
    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} - ${bulan} - ${tahun}`;
  };

  const fetchKedudukanHukum = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/kedudukan-hukum?peg_id=${nip}`);
      const mappedData = response.data.map((item: any, index: number) => ({
        no: index + 1,
        status: item.status,
        noSk: item.no_sk,
        tanggalSk: formatTanggal(item.tanggal_sk),
        tmt: formatTanggal(item.tmt),
        unitKerja: item.unit_kerja,
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
      fetchKedudukanHukum(nip);
    }
  }, [nip]);

  return (
    <div id="kedudukan-hukum" className="p-8">
      <h3 className="text-center text-xl font-semibold my-8 text-[#3781c7]">
        Riwayat Kedudukan Hukum
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
            <th className="p-3 border border-[#f2bd1d]">Status</th>
            <th className="p-3 border border-[#f2bd1d]">No. SK</th>
            <th className="p-3 border border-[#f2bd1d]">Tanggal SK</th>
            <th className="p-3 border border-[#f2bd1d]">TMT</th>
            <th className="p-3 border border-[#f2bd1d]">Unit Kerja</th>
            <th className="p-3 border border-[#f2bd1d]">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">
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
                <td className="p-3 border border-[#f2bd1d]">{item.status}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.noSk}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSk}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tmt}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.unitKerja}</td>
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

export default RiwayatKedudukanHukum;
