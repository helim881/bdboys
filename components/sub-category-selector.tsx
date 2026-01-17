"use client";

import { useEffect, useState } from "react";

export default function SubCategorySelector({
  categoryId,
}: {
  categoryId: string;
}) {
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubs = async () => {
      if (!categoryId) {
        setSubCategories([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/categories/${categoryId}/subcategories`);
        const data = await res.json();
        setSubCategories(data);
      } catch (err) {
        console.error("Error loading subcategories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubs();
  }, [categoryId]); // Re-run whenever categoryId changes

  return (
    <select
      disabled={isLoading || subCategories.length === 0}
      className="w-full p-2 border border-gray-300"
    >
      <option value="">
        {isLoading ? "লোড হচ্ছে..." : "সাবক্যাটেগরি সিলেক্ট করুন"}
      </option>
      {subCategories.map((sub: any) => (
        <option key={sub.id} value={sub.id}>
          {sub.name}
        </option>
      ))}
    </select>
  );
}
