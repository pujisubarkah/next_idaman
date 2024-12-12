// app/list_unit/page.js
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import Satker from '../../../components/satker'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <Satker />
      </div>
    </RootLayout>
  );
}