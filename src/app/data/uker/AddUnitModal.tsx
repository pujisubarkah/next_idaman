// AddUnitModal.tsx  
import React, { useState } from 'react';  
  
interface AddUnitModalProps {  
  isOpen: boolean;  
  onClose: () => void;  
  onSubmit: (data: {  
    satuanKerja: string;  
    unitKerjaNama: string;  
    kodeUnitKerja: string;  
    posisiUnitKerjaSetelah: string;  
    status: string;  
  }) => void;  
}  
  
const AddUnitModal: React.FC<AddUnitModalProps> = ({ isOpen, onClose, onSubmit }) => {  
  const [satuanKerja, setSatuanKerja] = useState('');  
  const [unitKerjaNama, setUnitKerjaNama] = useState('');  
  const [kodeUnitKerja, setKodeUnitKerja] = useState('');  
  const [posisiUnitKerjaSetelah, setPosisiUnitKerjaSetelah] = useState('');  
  const [status, setStatus] = useState('Aktif');  
  
  const handleSubmit = () => {  
    onSubmit({  
      satuanKerja,  
      unitKerjaNama,  
      kodeUnitKerja,  
      posisiUnitKerjaSetelah,  
      status,  
    });  
    onClose();  
  };  
  
  if (!isOpen) return null;  
  
  return (  
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">  
      <div className="bg-white p-6 rounded-lg w-96">  
        <h2 className="text-lg font-bold mb-4">Tambah Unit Kerja Bawahan</h2>  
        <form>  
          <div className="mb-4">  
            <label className="block text-sm font-medium mb-2">Satuan Kerja</label>  
            <input  
              type="text"  
              value={satuanKerja}  
              onChange={(e) => setSatuanKerja(e.target.value)}  
              className="w-full px-3 py-2 border rounded-md"  
            />  
          </div>  
          <div className="mb-4">  
            <label className="block text-sm font-medium mb-2">Unit Kerja Nama</label>  
            <input  
              type="text"  
              value={unitKerjaNama}  
              onChange={(e) => setUnitKerjaNama(e.target.value)}  
              className="w-full px-3 py-2 border rounded-md"  
            />  
          </div>  
          <div className="mb-4">  
            <label className="block text-sm font-medium mb-2">Kode Unit Kerja</label>  
            <input  
              type="text"  
              value={kodeUnitKerja}  
              onChange={(e) => setKodeUnitKerja(e.target.value)}  
              className="w-full px-3 py-2 border rounded-md"  
            />  
          </div>  
          <div className="mb-4">  
            <label className="block text-sm font-medium mb-2">Posisi Unit Kerja Setelah</label>  
            <input  
              type="text"  
              value={posisiUnitKerjaSetelah}  
              onChange={(e) => setPosisiUnitKerjaSetelah(e.target.value)}  
              className="w-full px-3 py-2 border rounded-md"  
            />  
          </div>  
          <div className="mb-4">  
            <label className="block text-sm font-medium mb-2">Status</label>  
            <div className="flex space-x-4">  
              <label>  
                <input  
                  type="radio"  
                  value="Aktif"  
                  checked={status === 'Aktif'}  
                  onChange={() => setStatus('Aktif')}  
                />  
                Aktif  
              </label>  
              <label>  
                <input  
                  type="radio"  
                  value="Tidak Aktif"  
                  checked={status === 'Tidak Aktif'}  
                  onChange={() => setStatus('Tidak Aktif')}  
                />  
                Tidak Aktif  
              </label>  
            </div>  
          </div>  
          <div className="flex justify-end space-x-2">  
            <button  
              type="button"  
              onClick={onClose}  
              className="px-4 py-2 bg-gray-500 text-white rounded-md"  
            >  
              Batal  
            </button>  
            <button  
              type="button"  
              onClick={handleSubmit}  
              className="px-4 py-2 bg-blue-500 text-white rounded-md"  
            >  
              Tambah  
            </button>  
          </div>  
        </form>  
      </div>  
    </div>  
  );  
};  
  
export default AddUnitModal;  
