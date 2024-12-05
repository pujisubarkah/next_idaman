// app/list_unit/page.js
import RootLayout from '../../home/layout'; // Mengimpor layout dari home/layout.js
import All from '../../../components/all'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <All />
      </div>
    </RootLayout>
  );
}