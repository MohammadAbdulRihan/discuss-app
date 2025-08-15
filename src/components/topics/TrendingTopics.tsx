/**
 * TRENDING TOPICS COMPONENT
 * 
 * This component displays a list of topics ordered by popularity (post count).
 * It provides navigation to individual topic pages where delete functionality is available.
 * 
 * Features:
 * - Shows topics ranked by number of posts
 * - Displays topic descriptions and post counts
 * - Responsive design with hover effects
 * - Links to individual topic pages
 * 
 * Note: Delete buttons are not shown here - they appear on individual topic pages
 * @requires fetchAllTopics - Database query function
 */

import Link from 'next/link';
import { fetchAllTopics } from '@/lib/query/topics';

/**
 * Main TrendingTopics component
 * Fetches and displays topics with popularity ranking
 */
const TrendingTopics = async () => {
    // Fetch all topics ordered by popularity (post count)
    const topics = await fetchAllTopics();
    
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Component header */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trending Topics
            </h3>
            
            {/* Topics list */}
            <div className="space-y-2">
                {topics.map((topic, index) => {
                    return (
                        <div 
                            key={topic.id} 
                            className="flex items-center justify-between p-3 rounded-md hover:bg-blue-50 transition-colors group"
                        >
                            {/* Left side: Topic info (clickable) */}
                            <Link 
                                href={`/topics/${topic.slug}`} 
                                className="flex-1 flex items-center space-x-3"
                            >
                                {/* Ranking number (popularity order) */}
                                <span className="text-sm font-bold text-gray-400 w-6">
                                    #{index + 1}
                                </span>
                                
                                {/* Topic details */}
                                <div className="min-w-0 flex-1">
                                    {/* Topic name */}
                                    <span className="font-medium text-gray-900 group-hover:text-blue-600 block">
                                        {topic.slug}
                                    </span>
                                    
                                    {/* Topic description (if available) */}
                                    {/* {topic.description && (
                                        // <p className="text-xs text-gray-500 truncate">
                                        //     {topic.description}
                                        // </p>
                                    )} */}
                                </div>
                            </Link>
                            
                            {/* Right side: Post count and delete button */}
                            <div className="flex items-center space-x-2 ml-3">
                                {/* Post count badge */}
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                    {topic._count.posts} {topic._count.posts === 1 ? 'post' : 'posts'}
                                </span>
                                
                                {/* Delete button removed - not needed in trending topics */}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Empty state when no topics exist */}
            {topics.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                    No topics yet. Be the first to create one! 
                </p>
            )}
        </div>
    );
}

export default TrendingTopics;