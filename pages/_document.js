import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script defer data-domain="debugle.net" src="https://plausible.io/js/plausible.js"></script>
        <script async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4146890929235011"
                crossOrigin="anonymous"></script>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </Head>
      <body>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  )
}