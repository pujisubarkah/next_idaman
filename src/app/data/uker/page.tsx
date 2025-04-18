"use client";      
import React, { useState, useEffect } from 'react';    
import RootLayout from '../../pegawai/profile/edit/layout';      
import LoadingSpinner from '../../../components/LoadingSpinner';      
import axios from 'axios';      
import AddUnitModal from './AddUnitModal'; // Import AddUnitModal  
import EditUnitModal from './EditUnitModal'; // Import EditUnitModal  
  
export default function ListUnitPage() {      
  const [loading, setLoading] = useState(false);      
  const [units, setUnits] = useState<any[]>([]);      
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);      
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState<string>('');      
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add Modal  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit Modal  
  const [selectedUnit, setSelectedUnit] = useState<any>(null); // State for selected unit data  
  
  // Fetch and process unit data      
  useEffect(() => {      
    const fetchData = async () => {      
      setLoading(true);      
      try {      
        const response = await axios.get('/api/data/unit_kerja');      
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
      const filtered = units.filter((unit) =>      
        unit.satuan_kerja_nama === selectedUnit      
      ).flatMap(unit => unit.units);      
      setFilteredUnits(filtered);      
    } else {      
      setFilteredUnits([]);      
    }      
  };      
  
  // Handle Add Unit  
  const handleAddUnit = (data: {  
    satuanKerja: string;  
    unitKerjaNama: string;  
    kodeUnitKerja: string;  
    posisiUnitKerjaSetelah: string;  
    status: string;  
  }) => {  
    console.log('Adding Unit:', data);  
    // Add API call to save the new unit  
  };  
  
  // Handle Edit Unit  
  const handleEditUnit = (data: {  
    satuanKerja: string;  
    unitKerjaNama: string;  
    kodeUnitKerja: string;  
    posisiUnitKerjaSetelah: string;  
    status: string;  
  }) => {  
    console.log('Editing Unit:', data);  
    // Add API call to update the unit  
  };  
  
  // Recursive function to render nested units      
  const renderUnits = (units: any[], level: number = 1) => {      
    return units.map((unit, index) => (      
      <React.Fragment key={unit.unit_kerja_id}>      
        <tr className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"} style={{ marginLeft: `${(level - 1) * 20}px` }}>      
          <td className="px-4 py-2 border border-[#f2bd1d]">{unit.satuan_kerja_nama}</td>      
          <td className="px-4 py-2 border border-[#f2bd1d]">{unit.unit_kerja_nama}</td>      
          <td className="px-4 py-2 border border-[#f2bd1d]">{unit.pegawai_count}</td>      
          <td className="px-4 py-2 border border-[#f2bd1d] flex space-x-2">      
            <button  
              className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"  
              onClick={() => {  
                setSelectedUnit(unit);  
                setIsEditModalOpen(true);  
              }}  
            >      
              Edit      
            </button>      
            {unit.unit_kerja_level < 4 && (      
              <button  
                className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"  
                onClick={() => setIsAddModalOpen(true)}  
              >      
                Tambah Unit Kerja Bawahan      
              </button>      
            )}      
            <button className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">      
              Hapus      
            </button>      
          </td>      
        </tr>      
        {unit.children && unit.children.length > 0 && renderUnits(unit.children, level + 1)}      
      </React.Fragment>      
    ));      
  };      
  
  return (      
    <RootLayout>      
      <div className="flex-4 h-full px-4 overflow-auto">      
        <div className="text-center mb-4">      
          <h3 className="text-lg font-bold font-poppins">DAFTAR UNIT KERJA LAN JAKARTA</h3>      
        </div>      
  
        {/* Search Dropdown */}      
        <div className="mb-2 flex justify-center items-center space-x-2">      
          <select      
            className="px-3 py-2 border rounded-md w-64"      
            value={selectedSatuanKerja}      
            onChange={(e) => handleSearch(e.target.value)}      
          >      
            <option value="" disabled>Cari Satuan Kerja</option>      
            {units      
              .map((unit) => (      
                <option key={unit.satuan_kerja_id} value={unit.satuan_kerja_nama}>      
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
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Satker</th>      
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Unit Kerja</th>      
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jumlah Pegawai</th>      
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Pilihan</th>      
                </tr>      
              </thead>      
              <tbody>      
                {filteredUnits.length > 0 ? (      
                  renderUnits(filteredUnits)      
                ) : (      
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
  
      {/* Add Unit Modal */}  
      <AddUnitModal  
        isOpen={isAddModalOpen}  
        onClose={() => setIsAddModalOpen(false)}  
        onSubmit={handleAddUnit}  
      />  
  
      {/* Edit Unit Modal */}  
      <EditUnitModal  
        isOpen={isEditModalOpen}  
        onClose={() => setIsEditModalOpen(false)}  
        onSubmit={handleEditUnit}  
        initialData={{  
          satuanKerja: selectedUnit?.satuan_kerja_nama || '',  
          unitKerjaNama: selectedUnit?.unit_kerja_nama || '',  
          kodeUnitKerja: selectedUnit?.kode_unit_kerja || '',  
          posisiUnitKerjaSetelah: selectedUnit?.posisi_unit_kerja_setelah || '',  
          status: selectedUnit?.status || 'Aktif',  
        }}  
      />  
    </RootLayout>      
  );      
}  
