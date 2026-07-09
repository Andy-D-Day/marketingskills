import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Capital A | The investment house for the agency economy",
  description:
    "Capital A advises, invests in and convenes the agency economy. M&A advisory through Agencies.co, principal investment through Agency A. London.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-white/10 mt-32 py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4 text-sm text-white/30">
            <span>
              Capital A Group Ltd, 13 Hanover Sq, London W1S 1HN.{" "}
              <span className="text-white/20">Company number 13533869.</span>
            </span>
            <span>© {new Date().getFullYear()} Capital A</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
