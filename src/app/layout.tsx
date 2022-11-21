import "../../styles/globals.css";
import Providers from "./provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body data-theme="light" className="h-full">
        <Providers>
          <main className="h-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
