import "./globals.css";

// Metadados da página web
export const metadata = {
  title: "Pet Virtual - TCC",
  description: "Jogo de Pet Virtual interativo em Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="w-full h-screen overflow-hidden flex items-center justify-center bg-[#121216]">
        {children}
      </body>
    </html>
  );
}