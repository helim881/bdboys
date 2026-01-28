import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
