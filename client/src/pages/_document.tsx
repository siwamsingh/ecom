import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        
        <Head>
        
        <link rel="icon" href="/favicon.webp" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          {/* <link rel="preload" href="/images/banner.jpg" as="image" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
