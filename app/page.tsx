import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import PostPortal from "@/components/landing-page/home-page";

export default function Page() {
  return (
    <main className="min-h-screen container bg-white text-gray-900">
      <Header />
      <PostPortal />
      <Footer />
    </main>
  );
}
