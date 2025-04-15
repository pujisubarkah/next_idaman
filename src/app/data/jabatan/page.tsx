'use client';

import React, { useState, useEffect } from 'react';
import RootLayout from '../../pegawai/profile/edit/layout';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

type Jabatan = {
  jabatan_id: string;
  jabatan_nama: string;
};

type UnitKerja = {
  unit_kerja_id: string;
  unit_kerja_nama: string;
  satuan_kerja_nama: string;
  pegawai_count: number;
  unit_kerja_level: number;
  siap_skpd_m_spg_unit_kerja?: UnitKerja[];
  m_spg_jabatan?: Jabatan[];
};

type SatuanKerja = {
  satuan_kerja_id: string;
  satuan_kerja_nama: string;
  siap_skpd_m_spg_unit_kerja: UnitKerja[];
};

export default function ListUnitPage() {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<SatuanKerja[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<UnitKerja[]>([]);
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState<string>('');
  const [selectedUnitKerja, setSelectedUnitKerja] = useState<UnitKerja | null>(null);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch and process unit data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/data/jabatan');
        const data = Array.isArray(response.data) ? response.data : [];
        setUnits(data);
        setFilteredUnits(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search (filtering based on selected satuan kerja)
  const handleSearch = (selectedUnit: string) => {
    setSelectedSatuanKerja(selectedUnit);
    if (selectedUnit) {
      const filtered = units
        .filter((unit) => unit.satuan_kerja_nama === selectedUnit)
        .flatMap(unit => unit.siap_skpd_m_spg_unit_kerja || []);
      setFilteredUnits(filtered);
    } else {
      setFilteredUnits([]);
    }
  };

  // Handle Unit Kerja click to show Jabatan
  const handleUnitKerjaClick = (unit: UnitKerja) => {
    setSelectedUnitKerja(unit);
    setJabatanList(unit.m_spg_jabatan || []);
    setIsAddModalOpen(true);
  };

  const handleAddJabatan = async () => {
    const jabatanNama = prompt("Masukkan nama jabatan:");
    if (!jabatanNama || !selectedUnitKerja) return;

    try {
      const res = await axios.post('/api/data/jabatan', {
        unit_kerja_id: selectedUnitKerja.unit_kerja_id,
        jabatan_nama: jabatanNama,
        jabatan_jenis: 'Struktural', // default value
        jabatan_kelas: 9 // default value
      });

      setJabatanList((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding jabatan:", error);
      alert("Gagal menambahkan jabatan.");
    }
  };

  const handleDeleteJabatan = async (jabatan) => {
    if (!confirm(`Yakin ingin menghapus jabatan ${jabatan.jabatan_nama}?`)) return;
  
    try {
      const response = await axios.request({
        method: 'DELETE',
        url: '/api/data/jabatan',
        data: { jabatan_id: jabatan.jabatan_id },  // make sure jabatan_id is sent in the body
      });
  
      // Handle success
      setJabatanList((prev) => prev.filter(j => j.jabatan_id !== jabatan.jabatan_id));
    } catch (error) {
      console.error("Error deleting jabatan:", error);
      alert("Gagal menghapus jabatan.");
    }
  };
  

  // Recursive function to render nested units
  const renderUnits = (units: UnitKerja[], level: number = 1) => {
    return units.map((unit, index) => (
      <React.Fragment key={unit.unit_kerja_id}>
        <tr className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"} style={{ marginLeft: `${(level - 1) * 20}px` }}>
          <td className="px-4 py-2 border border-[#f2bd1d]">{unit.satuan_kerja_nama}</td>
          <td className="px-4 py-2 border border-[#f2bd1d] cursor-pointer" onClick={() => handleUnitKerjaClick(unit)}>
            {unit.unit_kerja_nama}
          </td>
          <td className="px-4 py-2 border border-[#f2bd1d]">{unit.pegawai_count}</td>
          <td className="px-2 py-1 border border-[#f2bd1d]">
            {unit.unit_kerja_level < 4 && (
              <button
                className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => handleUnitKerjaClick(unit)}
              >
                Lihat Jabatan
              </button>
            )}
          </td>
        </tr>
        {unit.siap_skpd_m_spg_unit_kerja && unit.siap_skpd_m_spg_unit_kerja.length > 0 && renderUnits(unit.siap_skpd_m_spg_unit_kerja, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <RootLayout>
      <div className="flex-4 h-full px-4 overflow-auto">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold font-poppins">DAFTAR JABATAN PADA UNIT KERJA LAN JAKARTA</h3>
        </div>

        {/* Search Dropdown */}
        <div className="mb-2 flex justify-center items-center space-x-2">
          <select
            className="px-3 py-2 border rounded-md w-64"
            value={selectedSatuanKerja}
            onChange={(e) => handleSearch(e.target.value)}
          >
            <option value="" disabled>Cari Satuan Kerja</option>
            {units.map((unit) => (
              <option key={`${unit.satuan_kerja_id}-${unit.satuan_kerja_nama}`} value={unit.satuan_kerja_nama}>
                {unit.satuan_kerja_nama}
              </option>
            ))}
          </select>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">
              <thead>
                <tr className="bg-[#3781c7] text-white">
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Satuan Kerja</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Unit Kerja</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jumlah Pegawai</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Pilihan</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.length > 0 ? renderUnits(filteredUnits) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Jabatan List Modal */}
      {isAddModalOpen && selectedUnitKerja && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Daftar Jabatan - <span className="text-blue-600">{selectedUnitKerja.unit_kerja_nama}</span>
      </h2>

      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {jabatanList.length > 0 ? (
          jabatanList.map((jabatan, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 transition"
            >
              <span>{jabatan.jabatan_nama}</span>
              <button
  className="text-red-500 hover:text-red-700"
  onClick={() => handleDeleteJabatan(jabatan)}
>
  <FontAwesomeIcon icon={faMinus} />
</button>

            </li>
          ))
        ) : (
          <li className="text-center py-2 text-gray-500">Tidak ada jabatan tersedia</li>
        )}
      </ul>

      <div className="mt-6 flex justify-between">
        <button
  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
  onClick={handleAddJabatan}
>
  <FontAwesomeIcon icon={faPlus} />
  Tambah Jabatan
</button>

        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => setIsAddModalOpen(false)}
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}
    </RootLayout>
  );
}
