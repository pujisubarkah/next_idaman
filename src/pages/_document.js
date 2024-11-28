// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />  {/* Main content of the page */}
          <NextScript />  {/* Scripts for Next.js */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
