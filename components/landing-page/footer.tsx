"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const role = session?.user?.role;
  const handleRoute = (url: string) => {
    router.push(url);
  };

  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("ক্যাটেগরি লোড করতে সমস্যা হয়েছে");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

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
    <footer className="bg-gray-900/10   mt-12">
      {adCode && (
        <div className="container    pt-8 flex justify-center">
          <div
            className="w-full  overflow-hidden flex justify-center"
            dangerouslySetInnerHTML={{ __html: adCode }}
          />
        </div>
      )}
      <div className="  py-12">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2">
              {logo ? (
                <div className="relative h-8 w-32">
                  {" "}
                  {/* Adjust width/height as needed */}
                  <Image
                    src={logo}
                    alt={siteName || "Logo"}
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              ) : (
                <span className="text-2xl font-bold tracking-tighter">
                  {siteName || "BDBOYS"}
                </span>
              )}
            </Link>
          </div>

          <div>
            {/* <h3 className="font-bold text-lg mb-4">ক্যাটেগরিসমূহ</h3> */}
            <ul className="  grid grid-cols-2 gap-4">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-gray-600 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-600">
          <p>© ২০২৪ বাংলাভাষা. সমস্ত অধিকার সংরক্ষিত।</p>
          <p className="mt-2 text-sm">
            Made with ❤️ for Bangla language lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
