import "../../styles/globals.css";
import Providers from "./provider";
import MainHeader from "../components/ui/MainHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body data-theme="light" className="flex flex-col flex-nowrap">
        <Providers>
          <MainHeader />
          <main className="h-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
