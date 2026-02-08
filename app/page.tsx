// app/page.tsx (অথবা যেখানে আপনার মেইন কন্টেন্ট আছে)
import PostCard from "@/components/landing-page/post-card";
import prisma from "@/lib/db";
import PostPortal from "./category/page";

export default async function HomePage({
  searchParams,
}: {
  searchParams: any;
}) {
  const query = searchParams?.q; // URL থেকে সার্চ কিউয়ার্ড নিবে

  // যদি সার্চ কিউয়ার্ড থাকে, তবে শুধু পোস্ট দেখাবে
  if (query) {
    const posts = await prisma.post.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
      },
    });

    return (
      <div className="search-results">
        <h2>Search Results for: {query}</h2>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    );
  }

  // যদি সার্চ না থাকে, তবে আগের সব সেকশন দেখাবে
  return (
    <>
      <main className="min-h-screen  bg-white text-gray-900">
        <PostPortal />
      </main>
    </>
  );
}
