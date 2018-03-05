import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';

export default class AppDocument extends Document {
  public render() {
    return (
      <html>
        <Head>
          <title>A Cloud Guru</title>
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
