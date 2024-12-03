'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  params: { id: string };
}

const EditProfile = ({ params }: Props) => {
  const { id } = params; // Dapatkan ID dari parameter URL
  const [section, setSection] = useState<string | null>('data-pribadi');
  const pathname = usePathname(); // Dapatkan URL lengkap

  useEffect(() => {
    // Ambil hash fragment (bagian setelah #)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') || 'data-pribadi';
      setSection(hash);
    }
  }, [pathname]);

  useEffect(() => {
    console.log(`ID Pegawai: ${id}, Bagian: ${section}`);
  }, [id, section]);

  return (
    <div>
      <h1>Edit Profil Pegawai</h1>
      <p>ID Pegawai: {id}</p>
      <p>Seksi Aktif: {section}</p>

      {/* Render berdasarkan bagian */}
      {section === 'data-pribadi' && <DataPribadi />}
      {section === 'file-pegawai' && <FilePegawai />}
      {!section && <DataPribadi />}
    </div>
  );
};

// Komponen untuk setiap bagian
const DataPribadi = () => <div>Form Data Pribadi</div>;
const FilePegawai = () => <div>Form File Pegawai</div>;

export default EditProfile;
