import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script defer data-domain="debugle.net" src="https://plausible.io/js/plausible.js"></script>
        <script async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4146890929235011"
                crossOrigin="anonymous"></script>
      </Head>
      <body>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  )
}