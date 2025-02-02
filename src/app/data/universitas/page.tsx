"use client";  
import RootLayout from '../../pegawai/profile/edit/layout'; // Importing layout from home/layout.js  
import { useState, useEffect } from 'react';  
import LoadingSpinner from '../../../components/LoadingSpinner'; // Adjust the path as necessary  
import axios from 'axios'; // Axios for API call  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faPlus } from '@fortawesome/free-solid-svg-icons';  
import ReactPaginate from 'react-paginate'; // Import react-paginate

export default function ListUnitPage() {  
  const [searchTerm, setSearchTerm] = useState(''); // Track the search term  
  const [loading, setLoading] = useState(false);  
  const [units, setUnits] = useState<any[]>([]); // For storing all units  
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]); // For storing filtered units based on search term  
  const [currentPage, setCurrentPage] = useState(0); // Current page number (0-indexed)  
  const [itemsPerPage, setItemsPerPage] = useState(20); // Number of units per page (default 20)  
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [newUnit, setNewUnit] = useState({ univ_nmpti: '', univ_kota: '' }); // State for new unit data

  // Fetch and process unit data  
  useEffect(() => {  
    const fetchData = async () => {  
      setLoading(true);  
      try {  
        // Fetch unit data  
        const response = await axios.get('/api/master_data/universitas');  
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
      const filtered = units.filter(unit => {  
        const nmpti = unit.univ_nmpti ? unit.univ_nmpti.toLowerCase() : '';  
        const kota = unit.univ_kota ? unit.univ_kota.toLowerCase() : '';  
        return nmpti.includes(searchTerm.toLowerCase()) || kota.includes(searchTerm.toLowerCase());  
      });  
      setFilteredUnits(filtered);  
    } else {  
      setFilteredUnits(units);  
    }  
  }, [searchTerm, units]);  

  // Calculate paginated units to display  
  const indexOfLastUnit = (currentPage + 1) * itemsPerPage;  
  const indexOfFirstUnit = indexOfLastUnit - itemsPerPage;  
  const currentUnits = filteredUnits.slice(indexOfFirstUnit, indexOfLastUnit);  

  // Handle page change
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // Update current page
  };

  // Calculate total pages  
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);  

  // Handle items per page change  
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {  
    setItemsPerPage(Number(event.target.value));  
    setCurrentPage(0); // Reset to first page when items per page changes  
  };  

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Send a POST request to add the new unit
      await axios.post('/api/master_data/universitas', newUnit);
      // Fetch updated data
      const response = await axios.get('/api/master_data/universitas');
      const data = Array.isArray(response.data) ? response.data : [];
      setUnits(data);
      setFilteredUnits(data);
      setNewUnit({ univ_nmpti: '', univ_kota: '' }); // Reset form
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error('Error adding new unit:', error);
    }
  };

  return (  
    <RootLayout>  
      <div className="flex-4 h-full px-4 overflow-auto">  
        <div className="text-center mb-4">  
          <h3 className="text-lg font-bold font-poppins">DAFTAR MASTER UNIVERSITAS</h3>  
        </div>  

        <div className="text-right mb-4">  
          <button 
            className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a5a8c] flex items-center" 
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >  
            <FontAwesomeIcon icon={faPlus} className="mr-2" />  
            Tambah Universitas  
          </button>  
        </div>  

        {/* Search Input Field */}
        <div className="flex items-center mb-4">
          <label htmlFor="search" className="mr-2 text-sm font-medium">Cari:</label>
          <input
            id="search" // Add an id for accessibility
            type="text"
            placeholder="Search by university name or city" // Optional placeholder
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Items per page dropdown */}  
        <div className="mb-4">  
          <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>  
          <select  
            id="itemsPerPage"  
            value={itemsPerPage}  
            onChange={handleItemsPerPageChange}  
            className="px-2 py-1 border border-gray-300 rounded"  
          >  
            <option value={10}>10</option>  
            <option value={20}>20</option>  
            <option value={50}>50</option>  
            <option value={100}>100</option>  
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
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Nama Universitas</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Kota</th>  
                </tr>  
              </thead>  
              <tbody>  
                {currentUnits.length > 0 ? (  
                  currentUnits.map((unit: any, index: number) => (  
                    <tr key={index} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>  
                      <td className="px-4 py-2 border border-[#f2bd1d]">{unit.univ_nmpti}</td>  
                      <td className="px-4 py-2 border border-[#f2bd1d]">{unit.univ_kota}</td>  
                    </tr>  
                  ))  
                ) : (  
                  <tr>  
                    <td colSpan={2} className="text-center py-4">  
                      No data found.  
                    </td>  
                  </tr>  
                )}  
              </tbody>  
            </table>  

            {/* Pagination using react-paginate */}  
            <ReactPaginate  
              previousLabel={"Sebelumnya"}  
              nextLabel={"Berikutnya"}  
              breakLabel={"..."}  
              pageCount={totalPages}  
              marginPagesDisplayed={2}  
              pageRangeDisplayed={5}  
              onPageChange={handlePageChange}  
              containerClassName={"flex justify-center mt-4"}  
              pageClassName={"mx-1"}  
              pageLinkClassName={"px-4 py-2 border border-[#3781c7] rounded hover:bg-[#2a5a8c] text-[#3781c7]"}  
              previousClassName={"mx-1"}  
              previousLinkClassName={"px-4 py-2 border border-[#3781c7] rounded hover:bg-[#2a5a8c] text-[#3781c7]"}  
              nextClassName={"mx-1"}  
              nextLinkClassName={"px-4 py-2 border border-[#3781c7] rounded hover:bg-[#2a5a8c] text-[#3781c7]"}  
              activeClassName={"bg-[#3781c7] text-white"}  
              disabledClassName={"opacity-50 cursor-not-allowed"}  
            />  
          </div>  
        )}  

        {/* Modal for adding new university */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Tambah Data Universitas</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="univ_nmpti" className="block text-sm font-medium mb-1">Nama Universitas:</label>
                  <input
                    id="univ_nmpti"
                    type="text"
                    value={newUnit.univ_nmpti}
                    onChange={(e) => setNewUnit({ ...newUnit, univ_nmpti: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="univ_kota" className="block text-sm font-medium mb-1">Kota:</label>
                  <input
                    id="univ_kota"
                    type="text"
                    value={newUnit.univ_kota}
                    onChange={(e) => setNewUnit({ ...newUnit, univ_kota: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setIsModalOpen(false)}>Batal</button>
                  <button type="submit" className="px-4 py-2 bg-[#3781c7] text-white rounded">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>  
    </RootLayout>  
  );  
}


