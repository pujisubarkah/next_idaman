"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter

const RiwayatJabatan = () => {
  interface dataJabatan {
    no: number;
    namaJabatan: string;
    golRuang: string;
    nomorSuratKeputusan: string;
    tanggalSuratKeputusan: string;
    jabatanPenandatangan: string;
    tmt: string;
    tmtAkhir: string;
    unitKerja: string;
    instansiRumpun: string;
    eselon: string;
    migrasiSiasn: string;
  }

  const [data, setData] = useState<dataJabatan[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

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

  const fetchRiwayatJabatan = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/jabatan?peg_id=${nip}`);
      const mappedData = response.data.map((item: any, index: number) => ({
        no: index + 1,
        namaJabatan: item.riw_jabatan_nm,
        golRuang: item.gol_id,
        nomorSuratKeputusan: item.riw_jabatan_no,
        tanggalSuratKeputusan: item.riw_jabatan_tgl,
        jabatanPenandatangan: item.riw_jabatan_pejabat,
        tmt: item.riw_jabatan_tmt,
        tmtAkhir: item.riw_jabatan_selesai_selesai_tmt,
        unitKerja: item.unit_kerja_id,
        instansiRumpun: item.rumpun_id,
        eselon: item.eselon_id,
        migrasiSiasn: item.sapk_synced,
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
      fetchRiwayatJabatan(nip);
    }
  }, [nip]);

  // Navigate to the 'riwayat-jabatan' path
  const handleTambah = () => {
    if (nip) {
      router.push(`/pegawai/profile/edit/${nip}/riwayat-jabatan`);
    }
  };

  const handleEdit = (jabatanId: string) => {
    if (nip) {
      router.push(`/pegawai/profile/edit/${nip}/riwayat-jabatan/${jabatanId}`);
    }
  };

  return (
    <div id="riwayat-jabatan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT JABATAN</h3>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleTambah}
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800"
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-teal-500">No</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Nama Jabatan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Gol Ruang</th>
            <th colSpan={3} className="p-3 border border-teal-500">Surat Keputusan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">TMT</th>
            <th rowSpan={2} className="p-3 border border-teal-500">TMT Akhir Jabatan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Unit Kerja</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Instansi & Rumpun</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Eselon</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Migrasi SIASN</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Jabatan Penandatangan</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={14} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.namaJabatan}</td>
                <td className="p-3 border border-teal-500">{item.golRuang}</td>
                <td className="p-3 border border-teal-500">{item.nomorSuratKeputusan}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSuratKeputusan}</td>
                <td className="p-3 border border-teal-500">{item.jabatanPenandatangan}</td>
                <td className="p-3 border border-teal-500">{item.tmt}</td>
                <td className="p-3 border border-teal-500">{item.tmtAkhir}</td>
                <td className="p-3 border border-teal-500">{item.unitKerja}</td>
                <td className="p-3 border border-teal-500">{item.instansiRumpun}</td>
                <td className="p-3 border border-teal-500">{item.eselon}</td>
                <td className="p-3 border border-teal-500">{item.migrasiSiasn}</td>
                <td className="p-3 border border-teal-500">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(item.no.toString())}
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

export default RiwayatJabatan;
