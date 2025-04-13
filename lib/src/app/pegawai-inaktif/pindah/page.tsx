// app/list_unit/page.js
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import Pindah from '../../../components/pindah'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <Pindah />
      </div>
    </RootLayout>
  );
}