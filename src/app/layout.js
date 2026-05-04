import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QBL - Question Based Learning",
  description: "Real-time classroom interaction platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div className="video-bg" aria-hidden="true">
          <video
            className="video-bg__media"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/backroundVideo.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="app-content">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}
