import React, { Suspense } from 'react'
import PostShow from '@/components/posts/post-show'
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommentCreateForm from '@/components/comments/comment-create-form';
import CommentList from '@/components/comments/comment-list';
import { auth } from '@/auth';
import PostDeleteButton from '@/components/posts/PostDeleteButton';
import { prisma } from '@/lib';

type PostShowPageProps = {
  params: Promise<{ slug: string; postid: string }>
}
const PostShowPage: React.FC<PostShowPageProps> = async ({ params }) => {
  const { slug, postid } = (await params);
  
  // Fetch post data for ownership check
  const post = await prisma.post.findUnique({
    where: { id: postid },
    select: { id: true, userId: true, title: true }
  });
  
  // Get current user session to check ownership
  const session = await auth();
  const isPostOwner = session?.user?.id === post?.userId;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link href={`/topics/${slug}`}>
          <Button variant={'link'} className='cursor-pointer'>
            <ArrowLeft /> Back to {slug}
          </Button>
        </Link>
        
        {/* Post delete button - only visible to post owner */}
        {isPostOwner && post && (
          <PostDeleteButton 
            postId={post.id}
            postTitle={post.title}
          />
        )}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <PostShow postId={postid} />
      </Suspense>
      <CommentCreateForm postId={postid} startOpen />
      <CommentList postId={postid} />
    </div>
  )
}

export default PostShowPage
