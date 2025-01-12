import React, { useEffect, useState } from 'react';  
import axios from 'axios';  
  
const OperatorStatistics = () => {  
  const [userDocuments, setUserDocuments] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [currentPage, setCurrentPage] = useState(1);  
  const [entriesPerPage, setEntriesPerPage] = useState(10);  
  
  // Fetch data from the API using Axios  
  const fetchOperatorData = async () => {  
    setLoading(true);  
    try {  
      const response = await axios.get('/api/operator');  
      // Assuming the data structure returned is as follows:  
      // [{ username, count, nama, actions }, ...]  
      setUserDocuments(response.data); // Set the data directly  
    } catch (error) {  
      console.error('Error fetching data:', error.response ? error.response.data : error.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  useEffect(() => {  
    fetchOperatorData();  
  }, []);  
  
  const handlePageChange = (page) => {  
    setCurrentPage(page);  
  };  
  
  // Calculate the index of the last entry on the current page  
  const indexOfLastEntry = currentPage * entriesPerPage;  
  // Calculate the index of the first entry on the current page  
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;  
  // Get current entries  
  const currentEntries = userDocuments.slice(indexOfFirstEntry, indexOfLastEntry);  
  
  return (  
    <div>  
      {/* Tabel untuk User */}  
      <div className="text-center mb-10">  
        <h3 className="text-lg font-bold font-poppins">STATISTIK OPERATOR</h3>  
      </div>  
      <hr className="my-4 border-gray-300" />  
      {loading ? (  
        <p>Loading...</p>  
      ) : (  
        <div className="overflow-x-auto">  
          <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">  
            <thead>  
              <tr className="bg-[#3781c7] text-white">  
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Nama Operator</th>  
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jumlah</th>  
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Aksi</th>  
              </tr>  
            </thead>  
            <tbody>  
              {currentEntries.map(({ username, count, nama, actions }, index) => (  
                <tr key={username} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>  
                  <td className="px-4 py-2 border border-[#f2bd1d]">{nama}</td>  
                  <td className="px-4 py-2 border border-[#f2bd1d]">{count}</td>  
                  <td className="px-4 py-2 border border-[#f2bd1d]">  
                    <a href={`/list-log-edit/${username}`} className="text-[#3781c7] hover:underline">  
                      Lihat Detail  
                    </a>  
                  </td>  
                </tr>  
              ))}  
            </tbody>  
          </table>  
        </div>  
      )}  
  
      {/* Pagination */}  
      <div className="flex justify-between items-center mt-4">  
        <div className="flex space-x-2">  
          <button  
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"  
            disabled={currentPage === 1}  
            onClick={() => handlePageChange(currentPage - 1)}  
          >  
            Previous  
          </button>  
          {/* Assuming you want to show a limited number of pages */}  
          {[...Array(Math.ceil(userDocuments.length / entriesPerPage)).keys()].map((page) => (  
            <button  
              key={page + 1}  
              className={`px-3 py-1 text-sm rounded ${  
                page + 1 === currentPage  
                  ? "text-white bg-blue-600 hover:bg-blue-700"  
                  : "text-gray-600 border border-gray-300 hover:bg-gray-100"  
              }`}  
              onClick={() => handlePageChange(page + 1)}  
            >  
              {page + 1}  
            </button>  
          ))}  
          <button  
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"  
            disabled={currentPage === Math.ceil(userDocuments.length / entriesPerPage)}  
            onClick={() => handlePageChange(currentPage + 1)}  
          >  
            Next  
          </button>  
        </div>  
      </div>  
    </div>  
  );  
};  
  
export default OperatorStatistics;  
