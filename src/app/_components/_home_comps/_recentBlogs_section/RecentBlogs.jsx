import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "../../../lib/supabaseServer";

// Fetch directly from Supabase server-side
async function getBlogPosts() {
  try {
    const { data, error } = await supabaseServer.from("blogposts").select("id,title,author,content,asset,date").order("id", { ascending: false });

    if (error) {
      console.log("Error loading blog posts:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}

export default async function RecentBlogs() {
  const blogposts = await getBlogPosts();

  return (
    <>
      <main className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 sm:gap-y-10 sm:gap-x-6 max-w-7xl mx-auto px-4 py-8 md:p-10 lg:px-20">
        {blogposts.map((post) => (
          <section key={post.id} className="flex flex-col">
            <Link href={`/blog/${post.id}`}>
              <img src={post.asset.url} alt={post.title} width={1600} height={1400} />
            </Link>
            <h2 className="line-clamp-1">{post.title}</h2>
            {/*byline*/}
            <article className="flex gap-3 mb-3 [&>*]:line-clamp-1">
              <h4>BY:</h4>
              <h4>{post.author}</h4>
              <h4>/</h4>
              <h4>0</h4>
              <h4>Comments</h4>
              <h4>/</h4>
              <h4>{new Date(post.date).toLocaleString("en-UK", { day: "2-digit", month: "short", year: "numeric" })}</h4>
            </article>
            {/*text content*/}
            <p className="line-clamp-3 leading-5">{post.content}</p>
          </section>
        ))}
      </main>
    </>
  );
}
