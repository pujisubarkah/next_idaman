// app/list_unit/page.js
import RootLayout from '../../home/layout'; // Mengimpor layout dari home/layout.js
import Prediksi from '../../../components/prediksi'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <Prediksi />
      </div>
    </RootLayout>
  );
}