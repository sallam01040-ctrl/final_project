import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduScore Analytics | Student Performance Diagnostics Platform",
  description:
    "Production linear regression analytics platform for forecasting student examination outcomes, identifying scholastic risk factors, and testing improvement scenarios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
