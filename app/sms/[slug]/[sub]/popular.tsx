"use client";

import Breadcrumb from "@/components/breadcumb";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SmsCard from "../../components/sms-card";

export default function SmsPopularClient() {
  const [items, setItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // শুরুতে লোডিং true থাকবে

  const itemsPerPage = 10;

  // ১. প্রথমবার পেজ লোড হলে ডাটা ফেচ করার ফাংশন
  const fetchSms = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/popular?page=${page}&limit=${itemsPerPage}`,
      );
      const result = await res.json();

      if (result.success) {
        setItems(result.data);
        // API থেকে পাঠানো meta ডাটা অনুযায়ী totalPages আপডেট
        setTotalPages(result.meta?.totalPages || 1);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ২. Component Mount হলে একবার কল হবে
  useEffect(() => {
    fetchSms(currentPage);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading) return;
    setCurrentPage(newPage);
    fetchSms(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Breadcrumb />
      <div className=" border ">
        {/* Header */}
        <div className=" border-b">
          <h1 className="text-2xl font-bold text-gray-800 p-4">
            জনপ্রিয় SMS সংগ্রহ
          </h1>
        </div>

        {/* SMS List Area */}
        <div className="relative   p-4">
          {loading ? (
            // ৩. প্রথমবার এবং পেজ চেঞ্জের সময় লোডিং স্টেট
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-500 animate-pulse font-medium">
                তথ্য খোঁজা হচ্ছে...
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-500">
              {items.length > 0 ? (
                items.map((sms, index) => (
                  <SmsCard
                    key={sms.id}
                    sms={sms}
                    index={(currentPage - 1) * itemsPerPage + index}
                  />
                ))
              ) : (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-100">
                  আপাতত কোনো জনপ্রিয় SMS পাওয়া যায়নি।
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && items.length > 0 && (
          <div className="my-10 flex items-center justify-center gap-4 border-t border-gray-100 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full px-5"
            >
              <ChevronLeft size={18} className="mr-1" />
              Prev
            </Button>

            <div className="flex items-center gap-3 text-sm font-bold">
              <span className="w-9 h-9 flex items-center justify-center bg-orange-600 text-white rounded-full shadow-lg shadow-orange-100">
                {currentPage}
              </span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">{totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full px-5"
            >
              Next
              <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
