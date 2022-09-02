import "../../styles/globals.css";
import type { AppProps } from "next/app";
import Reader from "../components/Reader";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-row flex-nowrap h-full">
      <Reader />

      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
