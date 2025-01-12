'use client';  
  
import React, { useEffect, useState } from 'react';  
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js  
  
interface Role {  
  id: number;  
  name: string;  
  userCount: number;  
}  
  
const RolesPage: React.FC = () => {  
  const [roles, setRoles] = useState<Role[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');  
  
  useEffect(() => {  
    fetch('/api/users/roles')  
      .then((response) => response.json())  
      .then((data) => {  
        setRoles(data);  
        setLoading(false);  
      })  
      .catch((error) => {  
        setError('Error fetching roles');  
        setLoading(false);  
      });  
  }, []);  
  
  return (  
    <RootLayout>  
      <div className="p-4">  
        <h3 className="text-center text-xl font-semibold my-8 text-[#3781c7]">DAFTAR ROLE</h3>  
        <div className="flex justify-end mb-4">  
          <button className="bg-[#3781c7] text-white px-4 py-2 rounded flex items-center hover:bg-[#2a5a8c]">  
            <i className="fa fa-plus mr-2"></i>  
            Buat Role Baru  
          </button>  
        </div>  
  
        {loading ? (  
          <p className="text-center">Loading data...</p>  
        ) : error ? (  
          <p className="text-center text-red-500">{error}</p>  
        ) : (  
          <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">  
            <thead className="bg-[#3781c7]">  
              <tr className="text-white">  
                {['ID', 'Nama Role', 'Jumlah Akun'].map((header) => (  
                  <th key={header} className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">  
                    {header}  
                  </th>  
                ))}  
              </tr>  
            </thead>  
            <tbody>  
              {roles.length === 0 ? (  
                <tr>  
                  <td colSpan={3} className="text-center p-4">  
                    No roles found.  
                  </td>  
                </tr>  
              ) : (  
                roles.map(({ id, name, userCount }, index) => (  
                  <tr key={id} className={index % 2 === 0 ? 'bg-teal-50' : 'bg-white'}>  
                    <td className="p-3 border border-[#f2bd1d]">{id}</td>  
                    <td className="p-3 border border-[#f2bd1d]">{name}</td>  
                    <td className="p-3 border border-[#f2bd1d]">{userCount}</td>  
                  </tr>  
                ))  
              )}  
            </tbody>  
          </table>  
        )}  
      </div>  
    </RootLayout>  
  );  
};  
  
export default RolesPage;  
