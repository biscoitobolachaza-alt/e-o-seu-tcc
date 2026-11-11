
import "./global.css";

export const metadata = {
  title: "Meu Pet Virtual",
  description: "Um jogo interativo de estimação virtual.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
