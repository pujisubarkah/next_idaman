import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Riwayatprestasi: React.FC = () => {
  interface RiwayatData {
    id: number;
    namapenghargaan: string;
    tahun: string;
    peran: string;
    tingkat: string;
    instansipemberi: string;
  }

  const [kelompokData, setKelompokData] = useState<RiwayatData[]>([]);
  const [pribadiData, setPribadiData] = useState<RiwayatData[]>([]);
  const [nip, setNip] = useState<string | null>(null);

  const fetchRiwayatPrestasiKelompok = useCallback(async (nip: string) => {
    try {
      const response = await axios.get(
        `/api/riwayat/prestasi_kelompok?peg_id=${nip}`
      );
      const mappedData: RiwayatData[] = response.data.map(
        (item: any, index: number) => ({
          id: index + 1,
          namapenghargaan: item.nama_penghargaan,
          tahun: item.tahun,
          peran: item.peran,
          tingkat: item.tingkat,
          instansipemberi: item.instansi_pemberi,
        })
      );
      setKelompokData(mappedData);
    } catch (error) {
      console.error("Error fetching Prestasi Kelompok data:", error);
    }
  }, []);

  const fetchRiwayatPrestasiPribadi = useCallback(async (nip: string) => {
    try {
      const response = await axios.get(
        `/api/riwayat/prestasi_pribadi?peg_id=${nip}`
      );
      const mappedData: RiwayatData[] = response.data.map(
        (item: any, index: number) => ({
          id: index + 1,
          namapenghargaan: item.nama_penghargaan,
          tahun: item.tahun,
          tingkat: item.tingkat,
          instansipemberi: item.instansi_pemberi,
        })
      );
      setPribadiData(mappedData);
    } catch (error) {
      console.error("Error fetching Prestasi Pribadi data:", error);
    }
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);

    if (nipFromUrl) {
      fetchRiwayatPrestasiKelompok(nipFromUrl);
      fetchRiwayatPrestasiPribadi(nipFromUrl);
    }
  }, [fetchRiwayatPrestasiKelompok, fetchRiwayatPrestasiPribadi]);

  const renderTable = (
    data: RiwayatData[],
    title: string,
    includePeran: boolean
  ) => (
    <div className="mb-8">
      <h3 className="text-center text-xl font-semibold my-4">{title}</h3>
      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-teal-500">No</th>
            <th className="p-3 border border-teal-500">Nama Penghargaan</th>
            <th className="p-3 border border-teal-500">Tahun</th>
            {includePeran && (
              <th className="p-3 border border-teal-500">Peran</th>
            )}
            <th className="p-3 border border-teal-500">Tingkat</th>
            <th className="p-3 border border-teal-500">Instansi Pemberi</th>
            <th className="p-3 border border-teal-500">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={includePeran ? 7 : 6} className="text-center p-4">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
              >
                <td className="p-3 border border-teal-500">{index + 1}</td>
                <td className="p-3 border border-teal-500">
                  {item.namapenghargaan}
                </td>
                <td className="p-3 border border-teal-500">{item.tahun}</td>
                {includePeran && (
                  <td className="p-3 border border-teal-500">{item.peran}</td>
                )}
                <td className="p-3 border border-teal-500">{item.tingkat}</td>
                <td className="p-3 border border-teal-500">
                  {item.instansipemberi}
                </td>
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
  
  return (
    <div id="prestasi" className="p-4">
      {renderTable(kelompokData, "Prestasi Kelompok", true)}
      {renderTable(pribadiData, "Prestasi Pribadi", false)}
    </div>
  );
  
};

export default Riwayatprestasi;
