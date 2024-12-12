// app/list_unit/page.js
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import Meninggal from '../../../components/meninggal'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <Meninggal />
      </div>
    </RootLayout>
  );
}