import React from 'react'
import PostCreateForm from '@/components/posts/PostCreateForm'
import PostList from '@/components/posts/post-list'
import { fetchPostByTopicSlug } from '@/lib/query/post'
import { fetchTopicBySlug } from '@/lib/query/topics'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/auth'
import TopicDeleteButton from '@/components/topics/TopicDeleteButton'
import { notFound } from 'next/navigation'

type TopicShowParams = {
  params: Promise<({ slug: string })>
}

const TopicShowPage: React.FC<TopicShowParams> = async ({ params }) => {
  const slug = (await params).slug;
  
  // Fetch topic data for ownership check
  const topic = await fetchTopicBySlug(slug);
  if (!topic) {
    notFound();
  }
  
  // Get current user session to check ownership
  const session = await auth();
  const isTopicOwner = session?.user?.id === topic.userId;
  
  return (
    <div className="flex flex-col min-h-screen p-4 ">
      <div className='flex flex-row items-center justify-between m-2'>
        <Link href={`/`}>
          <Button variant={'link'} className='cursor-pointer'>
            <ArrowLeft /> Back to home 
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Topic: {slug}</h1>
        <div className="flex items-center space-x-2">
          <PostCreateForm slug={slug} />
          {/* Topic delete button - only visible to topic owner */}
          {isTopicOwner && (
            <TopicDeleteButton 
              topicId={topic.id} 
              topicSlug={topic.slug} 
            />
          )}
        </div>
      </div>
      <div>
        <PostList fetchData={() => fetchPostByTopicSlug(slug)} />
      </div>
    </div>
  )
}


// what is slug
// slug is a URL-friendly version of the topic name
// It is used to identify the topic in the URL
// Slugs are typically lowercase and contain only letters, numbers, and hyphens
export default TopicShowPage
