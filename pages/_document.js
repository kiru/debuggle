import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script defer data-domain="debugle.net" src="https://plausible.io/js/plausible.js"></script>
      </Head>
      <body>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  )
}