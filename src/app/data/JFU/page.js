import RootLayout from '../../home/layout'; // Mengimpor layout dari home/layout.js
import JFU from '../../../components/jfu'; // Mengimpor komponen JFU

export default function JFUpages() {
  return (
    <RootLayout>
      <div>
        <JFU />
      </div>
    </RootLayout>
  );
}