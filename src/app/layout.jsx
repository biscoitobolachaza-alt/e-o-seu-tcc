import "./globals.css";

// Metadados da página web
export const metadata = {
  title: "Pet Virtual - TCC",
  description: "Jogo de Pet Virtual interativo em Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="w-full h-[100dvh] overflow-hidden block" style={{ backgroundColor: "#71dc4a" }}>
        {children}
      </body>
    </html>
  );
}