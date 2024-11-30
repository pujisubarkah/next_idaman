import RootLayout from '../../home/layout'; // Mengimpor layout dari home/layout.js
import JFU from '../../../components/jfu'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <JFU />
      </div>
    </RootLayout>
  );
}