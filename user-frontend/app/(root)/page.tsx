"use client";
import { Upload } from "@/components/Upload";
import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Appbar />
      <Hero />
      <Upload />
    </main>
  );
}
