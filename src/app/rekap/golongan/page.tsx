'use client';  
  
import React, { useEffect, useState } from 'react';  
import RootLayout from '../../pegawai/profile/edit/layout'; // Import layout  
import axios from 'axios'; // Import axios for API calls  
import LoadingSpinner from "../../../components/LoadingSpinner"; // Import your LoadingSpinner component  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon  
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons'; // Import faEye and faEdit icons  
  
const RekapGolonganPage: React.FC = () => {  
  const [data, setData] = useState<any[]>([]); // State to store the data  
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator  
  const [modalTitle, setModalTitle] = useState<string>(''); // State for modal title  
  const [modalValue, setModalValue] = useState<number>(0); // State for modal value  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal open  
  const [modalData, setModalData] = useState<any[]>([]); // State to store modal data  
  const [isPegawaiModalOpen, setIsPegawaiModalOpen] = useState<boolean>(false); // State for pegawai modal  
  
  // Golongan columns as defined in the structure  
  const golonganColumns = ['II/a', 'II/b', 'II/c', 'II/d', 'III/a', 'III/b', 'III/c', 'III/d', 'IV/a', 'IV/b', 'IV/c', 'IV/d', 'IV/e'];  
  
  // Fetch data from the API  
  useEffect(() => {  
    axios  
      .get('/api/rekap/golongan')  // Correct API endpoint  
      .then((response) => {  
        setData(response.data);  // Set the fetched data to state  
        setLoading(false);  // Turn off loading indicator  
      })  
      .catch((error) => {  
        console.error('Error fetching data:', error); // Handle error  
        setLoading(false);  // Turn off loading indicator  
      });  
  }, []);  
  
  // Calculate totals for each golongan  
  const totals = golonganColumns.map((golongan) =>   
    data.reduce((acc, row) => acc + (row.golongan_details[golongan]?.total || 0), 0)  
  );  
  
  // Handle cell click event for modals  
  const handleCellClick = (golongan: string, value: number, rowData: any) => {  
    setModalTitle(golongan);  
    setModalValue(value);  
    if (golongan !== 'Jumlah Seluruh' && golongan !== 'Belum Terdata') {  
      setModalData(rowData.golongan_details[golongan]?.pegawai || []); // Set pegawai data  
      setIsPegawaiModalOpen(true); // Open pegawai modal  
    } else {  
      setIsModalOpen(true); // For other cells (Jumlah Seluruh, Belum Terdata)  
    }  
  };  
  
  // Table body row generation  
  const renderTableRows = () => {  
    return data.map((row, index) => {  
      const jumlahSeluruh = golonganColumns.reduce((sum, golongan) =>   
        sum + (row.golongan_details[golongan]?.total || 0), 0);  
  
      return (  
        <tr key={index} className={index % 2 === 0 ? 'bg-[#87ceeb]' : 'bg-white'}>  
          <td className="p-3 border border-[#f2bd1d] text-center">{index + 1}</td>  
          <td className="p-3 border border-[#f2bd1d]">{row.satuan_kerja_nama}</td>  
          {golonganColumns.map((golongan) => (  
            <td   
              key={golongan}   
              className="p-3 border border-[#f2bd1d] text-center cursor-pointer"  
              onClick={() => handleCellClick(golongan, row.golongan_details[golongan]?.total || 0, row)}  
            >  
              {row.golongan_details[golongan]?.total || 0}  
            </td>  
          ))}  
          <td   
            className="p-3 border border-[#f2bd1d] text-center"   
            onClick={() => handleCellClick('Belum Terdata', 0, row)}  
          >  
            0  
          </td>  
          <td   
            className="p-3 border border-[#f2bd1d] text-center cursor-pointer"  
            onClick={() => handleCellClick('Jumlah Seluruh', jumlahSeluruh, row)}  
          >  
            {jumlahSeluruh}  
          </td>  
        </tr>  
      );  
    });  
  };  
  
  return (  
    <RootLayout>  
      <div className="my-5">  
        {/* Title */}  
        <h1 className="text-center text-2xl font-bold text-[#3781c7] mb-2">  
          REKAPITULASI APARATUR SIPIL NEGARA  
        </h1>  
        <h1 className="text-center text-2xl font-bold text-[#3781c7] mb-2">  
          DI LINGKUNGAN LEMBAGA ADMINISTRASI NEGARA  
        </h1>  
  
        {/* Table */}  
        <div className="overflow-x-auto">  
          {loading ? (  
            <LoadingSpinner /> // Show loading spinner when data is fetching  
          ) : (  
            <table className="w-full border border-[#3781c7] rounded-lg">  
              <thead>  
                <tr className="bg-[#3781c7] text-white">  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm" rowSpan={2}>  
                    No  
                  </th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm" rowSpan={2}>  
                    Nama Satker  
                  </th>  
                  <th className="p-3 border border-[#f2bd1d] text-center font-bold uppercase text-sm" colSpan={golonganColumns.length}>  
                    Golongan  
                  </th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm" rowSpan={2}>  
                    Belum Terdata  
                  </th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm" rowSpan={2}>  
                    Jumlah Seluruh  
                  </th>  
                </tr>  
                <tr className="bg-[#3781c7] text-white">  
                  {golonganColumns.map((golongan) => (  
                    <th key={golongan} className="p-2 border border-[#f2bd1d] text-center">  
                      {golongan}  
                    </th>  
                  ))}  
                </tr>  
              </thead>  
              <tbody>  
                {renderTableRows()}  
  
                {/* Totals Row */}  
                <tr className="bg-[#87ceeb]">  
                  <td colSpan={2} className="p-3 text-center font-bold">Total</td>  
                  {totals.map((total, index) => (  
                    <td key={index} className="p-3 border border-[#f2bd1d] text-center font-bold">{total}</td>  
                  ))}  
                  <td className="p-3 border border-[#f2bd1d] text-center">-</td>  
                  <td className="p-3 border border-[#f2bd1d] text-center">-</td>  
                </tr>  
              </tbody>  
            </table>  
          )}  
        </div>  
      </div>  
  
      {/* Modal for Detail Pegawai */}  
      {isPegawaiModalOpen && (  
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">  
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%]">  
            <h2 className="text-lg font-bold mb-4">Detail Pegawai</h2>  
            <div className="overflow-y-auto max-h-[400px]">  
              <table className="w-full border border-gray-300">  
                <thead>  
                  <tr className="bg-gray-100">  
                    <th className="p-2 border border-gray-300 text-left">Nama</th>  
                    <th className="p-2 border border-gray-300 text-left">NIP</th>  
                    <th className="p-2 border border-gray-300 text-left">Satuan Kerja</th>  
                    <th className="p-2 border border-gray-300 text-left">Unit Kerja Parent</th>  
                    <th className="p-2 border border-gray-300 text-left">Unit Kerja</th>  
                    <th className="p-2 border border-gray-300 text-left">Jabatan</th>  
                    <th className="p-2 border border-gray-300 text-left">Pilihan</th>  
                  </tr>  
                </thead>  
                <tbody>  
                  {modalData.map(({ peg_nip, peg_nama, satuan_kerja_nama, unit_kerja_parent_nama, unit_kerja_nama, jabatan_nama }, index) => (  
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>  
                      <td className="p-2 border border-gray-300">{peg_nama}</td>  
                      <td className="p-2 border border-gray-300">{peg_nip}</td>  
                      <td className="p-2 border border-gray-300">{satuan_kerja_nama}</td>  
                      <td className="p-2 border border-gray-300">{unit_kerja_parent_nama}</td>  
                      <td className="p-2 border border-gray-300">{unit_kerja_nama}</td>  
                      <td className="p-2 border border-gray-300">{jabatan_nama}</td>  
                      <td className="p-2 border border-gray-300">  
                        <div className="flex gap-x-2">  
                          <button  
                            className="bg-[#3781c7] text-white px-2 py-1 rounded hover:bg-[#2a5a8c] flex items-center"  
                            onClick={() => window.open(`/pegawai/profile/edit/${peg_nip}`, "_blank")}  
                          >  
                            <FontAwesomeIcon icon={faEye} className="mr-2" />  
                            View  
                          </button>  
                          <button  
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center"  
                            onClick={() => window.open(`/edit-pegawai/${peg_nip}`, "_blank")}  
                          >  
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />  
                            Edit  
                          </button>  
                        </div>  
                      </td>  
                    </tr>  
                  ))}  
                </tbody>  
              </table>  
            </div>  
            <button  
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"  
              onClick={() => setIsPegawaiModalOpen(false)}  
            >  
              Close  
            </button>  
          </div>  
        </div>  
      )}  
    </RootLayout>  
  );  
};  
  
export default RekapGolonganPage;  
