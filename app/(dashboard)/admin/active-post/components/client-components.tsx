"use client";

import { useState } from "react";

import Breadcrumb from "@/components/breadcumb";
import { Post, PostWithRelations } from "@/interface/type";
import ActivePostCard from "./active-post-card";
import MovedForm from "./move-form";

interface PostClientProps {
  posts: PostWithRelations[];
  meta: {
    page: number;
    lastPage: number;
    total?: number;
  };
}

export default function PostClientComponents({ posts, meta }: PostClientProps) {
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  return (
    <div className="mx-auto max-w-5xl space-y-6    ">
      {/* Main Interface */}
      <Breadcrumb />
      <div className="relative min-h-[500px]">
        {!activePost && !isCreating ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-4">
              {posts?.length > 0 ? (
                posts?.map((post: Post) => (
                  <ActivePostCard
                    post={post}
                    setActivePost={setActivePost}
                    setIsCreating={setIsCreating}
                  />
                ))
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-muted text-muted-foreground">
                  No posts found.
                </div>
              )}
            </div>

            {/* Pagination Logic... (remains same) */}
          </div>
        ) : (
          <div className="  animate-in slide-in-from-right-4 duration-300">
            <div className="rounded-xl border bg-card p-8 shadow-lg">
              {/* Pass the specific activePost to the form */}
              <MovedForm
                post={activePost}
                onComplete={() => setActivePost(null)}
                setIsCreating={setIsCreating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
