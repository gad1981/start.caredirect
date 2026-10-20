import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { pages } from "@/lib/content";

const page = pages["st-parents"];

export const metadata: Metadata = {
  title: page.t,
  description: page.m,
  alternates: { canonical: "/" },
  openGraph: {
    title: page.t,
    description: page.m,
    images: ["/assets/heroes/home-hero-five-life-stages.webp"],
  },
};

export default function Home() {
  return <HomePage />;
}
