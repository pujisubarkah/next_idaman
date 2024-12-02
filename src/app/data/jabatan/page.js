import RootLayout from '../../home/layout'; // Mengimpor layout dari home/layout.js
import JFT from '../../../components/jft'; // Mengimpor komponen ListUnit

export default function ListUnitPage() {
  return (
    <RootLayout>
      <div>
        <JFT />
      </div>
    </RootLayout>
  );
}