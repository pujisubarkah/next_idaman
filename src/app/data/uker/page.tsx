"use client";
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner'; // Adjust the path as necessary
import axios from 'axios'; // Axios for API call

export default function ListUnitPage() {
  const [searchTerm, setSearchTerm] = useState(''); // Track the search term
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<any[]>([]); // For storing all units
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]); // For storing filtered units based on search term

  // Fetch and process unit data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch unit data
        const response = await axios.get('/api/data/unit_kerja');
        const data = Array.isArray(response.data) ? response.data : [];

        // Recursive function to calculate employee count and structure data
        const formatUnitWithEmployeeCount = (unit: any) => {
          const currentPegawaiCount = unit.pegawai_count || 0;
          
          // Recursively format children units
          const formattedChildren = unit.children ? unit.children.map((child: any) => formatUnitWithEmployeeCount(child)) : [];

          return {
            ...unit,
            jumlahPegawai: currentPegawaiCount,
            children: formattedChildren,
          };
        };

        // Format the data with recursive function
        const formattedUnits = data.flatMap((satuan: any) =>
          satuan.units.map((unit: any) => formatUnitWithEmployeeCount(unit))
        );

        setUnits(formattedUnits);
        setFilteredUnits(formattedUnits); // Initially set filteredUnits to all units
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search (filtering based on selected unit)
  const handleSearch = (selectedUnit: string) => {
    setSearchTerm(selectedUnit);

      // Filter units based on the search term (this will search by `satuan_kerja_nama` and `unit_kerja_nama`)
      if (selectedUnit) {
        const filtered = units.filter((unit) =>
          unit.satuan_kerja_nama.toLowerCase().includes(selectedUnit.toLowerCase()) || // Check main unit name
          unit.unit_kerja_nama.toLowerCase().includes(selectedUnit.toLowerCase()) // Check sub-unit name
        );
        setFilteredUnits(filtered); // Update filtered units
      } else {
        setFilteredUnits(units); // If search term is cleared, show all units
      }
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
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)} // Handle search when a unit is selected
          >
            <option value="" disabled>Cari Satuan Kerja</option>
            {units
              .filter((unit, index, self) =>
                index === self.findIndex((u) => u.satuan_kerja_nama === unit.satuan_kerja_nama)
              ) // Ensure unique `satuan_kerja_nama` options in the dropdown
              .map((unit: any) => (
                <option key={unit.satuan_kerja_nama} value={unit.satuan_kerja_nama}>
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
            <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
              <thead>
                <tr className="bg-teal-900 text-white">
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Satker</th>
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Unit Kerja</th>
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Jumlah Pegawai</th>
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Pilihan</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                      <td className="px-4 py-2 border border-teal-300">{unit.satuan_kerja_nama}</td>
                      <td className="px-4 py-2 border border-teal-300">{unit.unit_kerja_nama}</td>
                      <td className="px-4 py-2 border border-teal-300">{unit.jumlahPegawai}</td>
                      <td className="px-4 py-2 border border-teal-300">
                        <button className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2">
                          Edit
                        </button>
                        <button className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2">
                          Tambah Unit Kerja Bawahan
                        </button>
                        <button className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
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
    </RootLayout>
  );
}
