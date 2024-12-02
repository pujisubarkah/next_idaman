import RootLayout from '../../home/layout'; // Mengimpor layout dari home/layout.js
import JFTComponent from '../../../components/jft'; // Mengimpor komponen ListUnit

export default function JFTPage() {
  return (
    <RootLayout>
      <div>
        <JFTComponent />
      </div>
    </RootLayout>
  );
}