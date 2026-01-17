import { categoriesData } from "@/components/landing-page/data";
import SmsCategoryView from "../components/sms-categoryview";

export default function CategoryPage({ params }: { params: { id: string } }) {
  // Find the specific category from your data
  const category = categoriesData.find((c) => c.id.toString() === params.id);

  if (!category) return <div>Category not found</div>;

  // Mocking sub-categories for the list based on your design
  const mockSubCategories = [
    { id: "1", name: `${category.name} Friendship Sms`, count: 454 },
    { id: "2", name: `${category.name} Jokes Sms`, count: 274 },
    { id: "3", name: `${category.name} Love Sms`, count: 1486 },
    { id: "4", name: `${category.name} Birthday Sms`, count: 65 },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Breadcrumb section */}
      <div className="bg-[#E9F1F7] p-2 border border-[#B8D1E5] text-xs">
        <span className="text-blue-700">Home</span> ›{" "}
        <span className="text-blue-700">Sms</span> › {category.name}
      </div>

      <SmsCategoryView
        categoryName={category.name}
        topSms={category.posts.slice(0, 2).map((p) => ({
          id: p.id,
          content: p.excerpt,
          author: p.author,
        }))}
        subCategories={mockSubCategories}
      />
    </div>
  );
}
