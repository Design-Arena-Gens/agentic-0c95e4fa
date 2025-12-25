import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book to Movie AI - Экранизация произведений",
  description: "Создайте полную экранизацию любого литературного произведения с помощью ИИ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
