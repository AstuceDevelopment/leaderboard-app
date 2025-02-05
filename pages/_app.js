// 📌 pages/_app.js
import "../styles/globals.css"; // Import global styles
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Leaderboard</title>
        <meta name="description" content="Live event leaderboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
