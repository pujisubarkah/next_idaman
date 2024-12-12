"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const RiwayatPasangan = () => {
  const [isMale, setIsMale] = useState<boolean | null>(null);
  interface DataDummy {
    no: number;
    nik: string;
    namaPasangan: string;
    tempatTanggalLahir: string;
    tanggalNikah: string;
    memperolehTunjangan: string;
    pendidikan: string;
    pekerjaan: string;
    keterangan: string;
  }

  const [dataDummy, setDataDummy] = useState<DataDummy[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("User from localStorage:", user);

    if (user && user.username) {
      const genderDigit = user.username.charAt(14); 
      setIsMale(genderDigit === '1'); 
    }
  }, []); 

  useEffect(() => {
    setDataDummy([
      {
        no: 1,
        nik: "1234567890123456",
        namaPasangan: "Siti Aisyah",
        tempatTanggalLahir: "Jakarta, 15/05/1990",
        tanggalNikah: "20/12/2015",
        memperolehTunjangan: "Ya",
        pendidikan: "S1 Ekonomi",
        pekerjaan: "Guru",
        keterangan: "Aktif",
      },
      {
        no: 2,
        nik: "9876543210987654",
        namaPasangan: "Mira Sari",
        tempatTanggalLahir: "Bandung, 22/07/1985",
        tanggalNikah: "10/10/2012",
        memperolehTunjangan: "Tidak",
        pendidikan: "S2 Teknik Informatika",
        pekerjaan: "Pengusaha",
        keterangan: "Cuti",
      },
    ]);
  }, []);

  if (isMale === null) {
    return <div>Loading...</div>;
  }

  return (
    <div id="pasangan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">
        {isMale ? "RIWAYAT ISTRI" : "RIWAYAT SUAMI"}
      </h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th className="p-3 border border-teal-500">No</th>
            <th className="p-3 border border-teal-500">NIK</th>
            <th className="p-3 border border-teal-500">
              {isMale ? "Nama Istri" : "Nama Suami"}
            </th>
            <th className="p-3 border border-teal-500">Tempat dan Tanggal Lahir</th>
            <th className="p-3 border border-teal-500">Tanggal Nikah</th>
            <th className="p-3 border border-teal-500">Memperoleh Tunjangan</th>
            <th className="p-3 border border-teal-500">Pendidikan</th>
            <th className="p-3 border border-teal-500">Pekerjaan</th>
            <th className="p-3 border border-teal-500">Keterangan</th>
            <th className="p-3 border border-teal-500">Pilihan</th>
          </tr>
        </thead>
        <tbody>
          {dataDummy.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataDummy.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.nik}</td>
                <td className="p-3 border border-teal-500">{item.namaPasangan}</td>
                <td className="p-3 border border-teal-500">{item.tempatTanggalLahir}</td>
                <td className="p-3 border border-teal-500">{item.tanggalNikah}</td>
                <td className="p-3 border border-teal-500">{item.memperolehTunjangan}</td>
                <td className="p-3 border border-teal-500">{item.pendidikan}</td>
                <td className="p-3 border border-teal-500">{item.pekerjaan}</td>
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

export default RiwayatPasangan;
