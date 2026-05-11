import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "TataMart | Futuristic B2B Marketplace",
  description: "The premium next-gen ecosystem for Indian manufacturing and retail procurement.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${jakarta.className} ${spaceGrotesk.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        <AuthProvider>
          {children}
          <ToastContainer theme="dark" position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
