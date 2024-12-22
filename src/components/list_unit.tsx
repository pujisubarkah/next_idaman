"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DataItem {
  satuan_kerja_nama: string;
  unit_kerja_nama: string;
  jumlahPegawai: number;
  unit_kerja_id: string;
  unit_kerja_level: number;
  unit_kerja_parent: string | null;
  children?: DataItem[]; // Menambahkan properti children untuk anak unit kerja
}

const ListUnit = () => {
  const [units, setUnits] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/unit_kerja");
        const data = Array.isArray(response.data) ? response.data : [];

     // Fungsi untuk menyusun data dengan menghitung pegawai_count di setiap level
const formatUnitWithEmployeeCount = (unit) => {
  // Jika unit kerja memiliki pegawai, hitung jumlah pegawai untuk unit ini
  const currentPegawaiCount = unit.pegawai_count || 0;

  // Mengolah children secara rekursif, jika ada
  const formattedChildren = unit.children ? unit.children.map((child) => formatUnitWithEmployeeCount(child)) : [];

  // Gabungkan unit dengan anak-anaknya dan hitung jumlah pegawai pada unit ini
  return {
    ...unit,
    jumlahPegawai: currentPegawaiCount, // Pegawai count pada unit ini
    children: formattedChildren, // Rekursi children
  };
};

// Menyusun data berdasarkan format yang dibutuhkan
const formattedUnits = data.flatMap((satuan) =>
  satuan.units.map((unit) => {
    // Menyusun unit dengan pegawai count yang benar, termasuk di semua level children
    const formattedUnit = formatUnitWithEmployeeCount(unit);

    return {
      satuan_kerja_nama: satuan.satuan_kerja_nama,
      unit_kerja_nama: formattedUnit.unit_kerja_nama,
      jumlahPegawai: formattedUnit.jumlahPegawai, // Jumlah pegawai pada unit kerja saat ini
      unit_kerja_id: formattedUnit.unit_kerja_id,
      unit_kerja_level: formattedUnit.unit_kerja_level,
      unit_kerja_parent: formattedUnit.unit_kerja_parent,
      children: formattedUnit.children, // Menyertakan anak-anaknya yang sudah diformat
    };
  })
);


        setUnits(formattedUnits);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchClick = (unitKerjaId) => {
    if (!unitKerjaId) {
      console.error("unitKerjaId tidak ditemukan");
      return;
    }
    router.push(`/list-pegawai/all/${unitKerjaId}`);
  };

  // Fungsi untuk menentukan indentasi berdasarkan level unit kerja
  const getIndentationStyle = (level: number) => {
    return {
      paddingLeft: `${level * 20}px`, // Setiap level diberi margin lebih banyak
    };
  };

  // Fungsi untuk menampilkan unit kerja dengan rekursi (untuk children)
  const renderUnits = (unitList: DataItem[]) => {
    return unitList.map(({ satuan_kerja_nama, unit_kerja_nama, jumlahPegawai, unit_kerja_id, unit_kerja_level, children }, index) => {
      // Skip unit kerja dengan unit_kerja_id = 99
      if (unit_kerja_id === "99") {
        return null;
      }

      return (
        <>
          <tr key={unit_kerja_id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
            <td className="border px-4 py-2">{satuan_kerja_nama}</td>
            <td className="border px-4 py-2" style={getIndentationStyle(unit_kerja_level)}>
              {unit_kerja_nama}
            </td>
            <td className="border px-4 py-2">{jumlahPegawai}</td> {/* Menampilkan jumlah pegawai */}
            <td className="border px-4 py-2 text-center">
              <button
                className="bg-teal-500 text-white px-2 py-1 rounded hover:bg-teal-700"
                onClick={() => handleSearchClick(unit_kerja_id)}
              >
                Lihat Detail
              </button>
            </td>
          </tr>
          {/* Jika unit kerja memiliki children, render anak unit kerja dengan rekursi */}
          {children && children.length > 0 && renderUnits(children)}
        </>
      );
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4 text-center">List Unit Kerja</h2>
      <div className="mt-8">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
            <thead>
              <tr className="bg-teal-900 text-white">
                <th className="p-3 border text-center font-bold uppercase text-sm">Satker</th>
                <th className="p-3 border text-center font-bold uppercase text-sm">Unit Kerja</th>
                <th className="p-3 border text-center font-bold uppercase text-sm">Jumlah Pegawai</th> {/* Kolom jumlah pegawai */}
                <th className="p-3 border text-center font-bold uppercase text-sm">Pilihan</th>
              </tr>
            </thead>
            <tbody>
              {renderUnits(units)} {/* Menampilkan unit kerja dengan rekursi */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListUnit;
