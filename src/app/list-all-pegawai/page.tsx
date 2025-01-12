// app/list_unit/page.js
import RootLayout from '../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import ListAllPegawai from '../../components/list_all_pegawai'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <ListAllPegawai />
      </div>
    </RootLayout>
  );
}
