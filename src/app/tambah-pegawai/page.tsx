import RootLayout from '../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import Tambah from '../../components/tambahpegawai'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <Tambah />
      </div>
    </RootLayout>
  );
}
