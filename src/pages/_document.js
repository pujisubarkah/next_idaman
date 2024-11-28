// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Tambahkan tag <meta>, <link>, atau elemen lain di sini */}
        </Head>
        <body>
          <Main /> {/* Konten halaman Anda */}
          <NextScript /> {/* Script yang diperlukan oleh Next.js */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
