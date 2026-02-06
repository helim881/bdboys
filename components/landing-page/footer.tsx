"use client";

import { useSession } from "next-auth/react";
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
      const res = await fetch("/api/categories?type=POST");
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
      <div className=" ">
        {/* <h3 className="font-bold text-lg mb-4">ক্যাটেগরিসমূহ</h3> */}
        <ul className="  grid grid-cols-2 gap-4 px-4">
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
