import PostList from "@/components/posts/post-list";
import TopicCreateForm from "@/components/topics/TopicCreateForm";
import { fetchTopPosts } from "@/lib/query/post";
import  TrendingTopics from "@/components/topics/TrendingTopics";

// Force dynamic rendering - prevents static generation
export const dynamic = 'force-dynamic'
// Revalidate every 0 seconds (always fresh)
export const revalidate = 0

export default async function Home() {
  return (
    <main className="px-6 py-8 bg-gray-50 min-h-screen">
      
      {/* Hero / Welcome Section */}
      <section className="mb-8 bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to SpeakSpace 
          </h1>
          <p className="text-gray-600 mt-2">
            Where voices unite and ideas thrive. Create topics, share thoughts, and engage in meaningful conversations.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <TopicCreateForm />
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Posts Section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
             Top Discussions
          </h2>
          <PostList fetchData={() => fetchTopPosts()} />
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow p-4 h-fit">
          <TrendingTopics />
        </aside>
      </div>

    </main>
  );
}
