// app/list_unit/page.js
import RootLayout from '../home/layout'; // Mengimpor layout dari home/layout.js
import Operator from '../../components/operator'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <Operator />
      </div>
    </RootLayout>
  );
}