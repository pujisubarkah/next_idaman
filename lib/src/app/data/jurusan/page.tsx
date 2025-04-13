"use client";
import RootLayout from '../../pegawai/profile/edit/layout';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';

export default function ListUnitPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<any[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [newUnitName, setNewUnitName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/data/jurusan');
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

  const indexOfLastUnit = (currentPage + 1) * itemsPerPage;
  const indexOfFirstUnit = indexOfLastUnit - itemsPerPage;
  const currentUnits = filteredUnits.slice(indexOfFirstUnit, indexOfLastUnit);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingUnit(null);
    setNewUnitName('');
    setModalIsOpen(true);
  };

  const openEditModal = (unit: any) => {
    setIsEditing(true);
    setEditingUnit(unit);
    setNewUnitName(unit.jurusan_nm);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && editingUnit) {
        await axios.put(`/api/data/jurusan/${editingUnit.id}`, { jurusan_nm: newUnitName });
      } else {
        await axios.post('/api/data/jurusan', { jurusan_nm: newUnitName });
      }
      const response = await axios.get('/api/data/jurusan');
      const data = Array.isArray(response.data) ? response.data : [];
      setUnits(data);
      setFilteredUnits(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleDelete = async (unitId: number) => {
    if (window.confirm('Apakah Anda Yakin Akan menghapus ini?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/data/jurusan/${unitId}`);
        const response = await axios.get('/api/data/jurusan');
        const data = Array.isArray(response.data) ? response.data : [];
        setUnits(data);
        setFilteredUnits(data);
      } catch (error) {
        console.error('Error deleting unit:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <RootLayout>
      <div className="flex-4 h-full px-4 overflow-auto">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold font-poppins">DAFTAR MASTER JURUSAN</h3>
        </div>

        <div className="text-right mb-4">
          <button
            className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a5a8c] flex items-center"
            onClick={openAddModal}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Tambah Pengajuan
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <label htmlFor="itemsPerPage" className="mr-4">Items per page:</label>
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

          <div className="flex items-center">
            <label htmlFor="search" className="mr-4">Cari:</label>
            <input
              id="search"
              type="text"
              placeholder="Cari Jurusan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

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
                        <button
                          className="px-2 py-1 text-white bg-[#3781c7] rounded hover:bg-[#2a5a8c] mr-2"
                          onClick={() => openEditModal(unit)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 mr-2"
                          onClick={() => handleDelete(unit.id)}
                        >
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

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Add/Edit Unit Modal"
          className="bg-white rounded-lg p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-lg font-bold mb-4">{isEditing ? 'Edit Data Jurusan' : 'Tambah Data Jurusan'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unitName">
                Nama Jurusan
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="unitName"
                type="text"
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a5a8c] mr-2"
                type="submit"
              >
                Simpan
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={closeModal}
                type="button"
              >
                Batal
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </RootLayout>
  );
}
