"use client";

import { ChevronUp } from "lucide-react"; // আইকন ইম্পোর্ট করুন
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SearchInput from "../search-input";

const Footer = ({
  logo,
  siteName,
}: {
  logo?: string | null;
  siteName?: string;
}) => {
  const router = useRouter();
  const [adCode, setAdCode] = useState("");
  const { data: session } = useSession();
  const [categories, setCategories] = useState<any[]>([]);

  // Back to top এর জন্য স্টেট
  const [showTopBtn, setShowTopBtn] = useState(false);

  // স্ক্রল পজিশন চেক করার ফাংশন
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // উপরে যাওয়ার ফাংশন
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=POST");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("ক্যাটেগরি লোড করতে সমস্যা হয়েছে");
    }
  };

  const fetchFooterAd = async () => {
    try {
      const res = await fetch("/api/ads/footer_ad");
      const data = await res.json();
      if (data.status === "active") {
        setAdCode(data.code);
      }
    } catch (err) {
      console.error("Footer ad fetch failed");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFooterAd();
  }, []);

  return (
    <footer className="relative">
      {/* --- Back to Top Button --- */}
      <button
        onClick={goToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 bg-[#003366] text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 active:scale-90 ${
          showTopBtn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ChevronUp size={24} />
      </button>

      {adCode && (
        <div className="container pt-8 flex justify-center">
          <div
            className="w-full overflow-hidden flex justify-center"
            dangerouslySetInnerHTML={{ __html: adCode }}
          />
        </div>
      )}

      <SearchInput />

      <div className="bg-slate-50 mt-12 pb-8">
        <ul className="grid grid-cols-2 gap-4 px-4 max-w-4xl mx-auto py-8">
          {categories.map((cat, idx) => (
            <li key={idx}>
              <Link
                href={`/category/${cat.slug}`}
                className="text-gray-600 hover:text-[#003366] font-medium transition-colors"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-200 mt-4 pt-8 text-center text-gray-500 px-4">
          <p>© ২০২৬ {siteName || "বাংলাভাষা"}। সমস্ত অধিকার সংরক্ষিত।</p>
          <p className="mt-2 text-sm italic">
            Made with ❤️ for Bangla language lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
