"use client";  
import RootLayout from '../../pegawai/profile/edit/layout'; // Importing layout from home/layout.js  
import { useState, useEffect } from 'react';  
import LoadingSpinner from '../../../components/LoadingSpinner'; // Adjust the path as necessary  
import axios from 'axios'; // Axios for API call  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faPlus } from '@fortawesome/free-solid-svg-icons';  
  
export default function ListUnitPage() {  
  const [searchTerm, setSearchTerm] = useState(''); // Track the search term  
  const [loading, setLoading] = useState(false);  
  const [units, setUnits] = useState<any[]>([]); // For storing all units  
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]); // For storing filtered units based on search term  
  const [currentPage, setCurrentPage] = useState(1); // Current page number  
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of units per page  
  
  // Fetch and process unit data  
  useEffect(() => {  
    const fetchData = async () => {  
      setLoading(true);  
      try {  
        // Fetch unit data  
        const response = await axios.get('/api/data/jurusan');  
        const data = Array.isArray(response.data) ? response.data : [];  
  
        // Set units and initial filtered data  
        setUnits(data);  
        setFilteredUnits(data); // Initially set filteredUnits to all units  
      } catch (error) {  
        console.error('Error fetching data:', error);  
      } finally {  
        setLoading(false);  
      }  
    };  
  
    fetchData();  
  }, []);  
  
  // Handle search filtering  
  useEffect(() => {  
    if (searchTerm) {  
      const filtered = units.filter(unit =>  
        unit.jurusan_nm.toLowerCase().includes(searchTerm.toLowerCase())  
      );  
      setFilteredUnits(filtered);  
    } else {  
      setFilteredUnits(units);  
    }  
  }, [searchTerm, units]);  
  
  // Calculate paginated units to display  
  const indexOfLastUnit = currentPage * itemsPerPage;  
  const indexOfFirstUnit = indexOfLastUnit - itemsPerPage;  
  const currentUnits = filteredUnits.slice(indexOfFirstUnit, indexOfLastUnit);  
  
  // Change page handler  
  const handlePageChange = (page: number) => {  
    setCurrentPage(page);  
  };  
  
  // Calculate total pages  
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);  
  
  return (  
    <RootLayout>  
      <div className="flex-4 h-full px-4 overflow-auto">  
        <div className="text-center mb-4">  
          <h3 className="text-lg font-bold font-poppins">DAFTAR MASTER JURUSAN</h3>  
        </div>  
  
        <div className="text-right mb-4">  
          <button className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a5a8c] flex items-center">  
            <FontAwesomeIcon icon={faPlus} className="mr-2" />  
            Tambah Jurusan  
          </button>  
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
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">No</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Nama Jurusan</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Aksi</th>  
                </tr>  
              </thead>  
              <tbody>  
                {currentUnits.length > 0 ? (  
                  currentUnits.map((unit: any, index: number) => (  
                    <tr key={index} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>  
                      <td className="px-4 py-2 border border-[#f2bd1d]">{indexOfFirstUnit + index + 1}</td>  
                      <td className="px-4 py-2 border border-[#f2bd1d]">{unit.jurusan_nm}</td>  
                      <td className="px-4 py-2 border border-[#f2bd1d]">  
                        <button className="px-2 py-1 text-white bg-[#3781c7] rounded hover:bg-[#2a5a8c] mr-2">  
                          Edit  
                        </button>  
                        <button className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 mr-2">  
                          Hapus  
                        </button>  
                      </td>  
                    </tr>  
                  ))  
                ) : (  
                  <tr>  
                    <td colSpan={3} className="text-center py-4">  
                      No data found.  
                    </td>  
                  </tr>  
                )}  
              </tbody>  
            </table>  
  
            {/* Pagination */}  
            <div className="flex justify-center mt-4">  
              <button  
                onClick={() => handlePageChange(currentPage - 1)}  
                disabled={currentPage === 1}  
                className="px-4 py-2 bg-[#3781c7] text-white rounded-l-lg disabled:bg-gray-300"  
              >  
                Sebelumnya  
              </button>  
              <span className="px-4 py-2">{currentPage} of {totalPages}</span>  
              <button  
                onClick={() => handlePageChange(currentPage + 1)}  
                disabled={currentPage === totalPages}  
                className="px-4 py-2 bg-[#3781c7] text-white rounded-r-lg disabled:bg-gray-300"  
              >  
                Berikutnya  
              </button>  
            </div>  
          </div>  
        )}  
      </div>  
    </RootLayout>  
  );  
}  
