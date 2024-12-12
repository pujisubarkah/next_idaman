// app/list_unit/page.js
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import Lebih from '../../../components/lebih'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <Lebih />
      </div>
    </RootLayout>
  );
}