
// app/list_unit/page.js
import RootLayout from '../home/layout'; // Mengimpor layout dari home/layout.js
import ListUnit from '../../components/list_unit'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <ListUnit />
      </div>
    </RootLayout>
  );
}