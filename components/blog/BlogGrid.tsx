"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/data/blog";

const ALL = "Tümü";

export function BlogGrid({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState(ALL);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === ALL) {
      return posts;
    }

    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <>
      <div className="mb-7 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {[ALL, ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-extrabold transition-colors ${
              selectedCategory === category
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-border bg-white text-ink hover:border-primary-500 hover:text-primary-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mb-5 rounded-2xl border border-border bg-white p-5">
        <p className="text-sm font-bold text-ink-muted">Blog sonucu</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink">{filteredPosts.length} yazı listeleniyor</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all">
            <div className="relative h-48 w-full border-b border-border bg-surface">
              <Image src={post.image} alt={post.title} fill className="object-contain p-6" unoptimized />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <p className="text-xs font-bold text-ink-muted">{post.category} · {post.readTime}</p>
                <h2 className="mt-2 text-lg font-extrabold leading-6 text-ink transition-colors group-hover:text-primary-600">{post.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">{post.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
