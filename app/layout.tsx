import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Itinerary Planner | AI Leverage Automation",
  description: "A planning platform for multi-day tours, events, and group itineraries. Built by AI Leverage Automation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
