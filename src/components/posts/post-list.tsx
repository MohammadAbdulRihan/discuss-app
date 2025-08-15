/**
 * POST LIST COMPONENT
 * 
 * This component displays a list of posts in a clean, modern card layout.
 * It provides navigation to individual posts where delete functionality is available.
 * 
 * Features:
 * - Displays posts with topic badges, titles, content previews
 * - Clickable cards that navigate to individual post pages
 * - Responsive design with hover effects
 * - Author information and comment counts
 * 
 * Note: Delete buttons are not shown here - they appear on individual post pages
 */

import React from 'react'
import Link from 'next/link'
import { PostWithData } from '@/lib/query/post'
import { Badge } from '@/components/ui/badge'

export type PostListProps = {
    fetchData: () => Promise<PostWithData[]>
}

/**
 * Main PostList component
 * Fetches posts and renders them as clickable cards
 */
const PostList: React.FC<PostListProps> = async ({ fetchData }) => {
    // Fetch posts data using the provided function
    const posts = await fetchData();
    
    return (
        <div className="space-y-3">
            {posts.map((post) => {
                return (
                    <div 
                        key={post.id} 
                        className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-blue-50/30"
                    >
                        {/* Header: Topic badge */}
                        <div className="flex items-center justify-between mb-2">
                            {/* Topic identification badge */}
                            <Badge variant="secondary" className="text-xs font-medium text-blue-600">
                                #{post.topic.slug}
                            </Badge>
                        </div>
                        
                        {/* Main post content - clickable to navigate to post page */}
                        <Link 
                            href={`/topics/${post.topic.slug}/posts/${post.id}`} 
                            className="block"
                        >
                            {/* Post title */}
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-2 line-clamp-2">
                                {post.title}
                            </h3>
                            
                            {/* Content preview (first 100 characters) */}
                            {post.content && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {post.content.length > 100 
                                        ? `${post.content.substring(0, 100)}...` 
                                        : post.content
                                    }
                                </p>
                            )}
                            
                            {/* Footer: Author and comment count */}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>by {post.user.name}</span>
                                <span>
                                    {post._count.comments} {post._count.comments === 1 ? 'reply' : 'replies'}
                                </span>
                            </div>
                        </Link>
                    </div>
                )
            })}
            
            {/* Empty state when no posts are available */}
            {posts.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No posts yet</p>
                    <p className="text-gray-400 text-sm mt-2">Be the first to create a post!</p>
                </div>
            )}
        </div>
    )
}

export default PostList