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

        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

        <meta name="description"
              content="Find a known redacted algorithm word by word. Every day a new algorithm"/>

        <meta property="og:url" content="https://debuggle.net/"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Debuggle"/>
        <meta property="og:description"
              content="Find a known redacted algorithm word by word. Every day a new algorithm"/>
        <meta property="og:title" content="Find a known redacted algorithm word by word. Every day a new algorithm"/>
        <meta property="og:image" content="https://debuggle.net/TwitterCard.png"/>

      </Head>
      <body>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  )
}