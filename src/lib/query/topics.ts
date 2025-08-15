/**
 * TOPIC QUERIES
 * 
 * This file contains all database queries related to topics.
 * These functions handle fetching topics with various filters and sorting options.
 * 
 * Key Features:
 * - Fetch all topics with post counts
 * - Search topics by name/description
 * - Get trending/popular topics
 * - Include user ownership information for delete permissions
 * 
 * @requires prisma - Database client
 */

import { prisma } from '..';

/**
 * Type definition for Topic with additional data
 * Includes post count for display purposes
 * The userId is already included in the base Topic type from Prisma
 */
export type TopicWithData = {
    id: string;
    slug: string;
    description: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: { posts: number };
}

/**
 * Fetches all topics from the database
 * Orders topics by popularity (number of posts, descending)
 * 
 * @returns Promise<TopicWithData[]> - Array of topics with post counts
 * @example
 * const topics = await fetchAllTopics();
 * console.log(`${topics[0].slug} has ${topics[0]._count.posts} posts`);
 */
export const fetchAllTopics = async (): Promise<TopicWithData[]> => {
    const topics = await prisma.topic.findMany({
        include: {
            _count: { 
                select: { posts: true }  // Count posts in each topic
            }
        },
        orderBy: {
            posts: { _count: 'desc' }    // Order by most posts first
        }
    });
    return topics as TopicWithData[];
}

/**
 * Searches topics by name (slug) or description
 * Case-insensitive search with partial matching
 * 
 * @param term - Search term to look for in topic slug or description
 * @returns Promise<TopicWithData[]> - Array of matching topics
 * @example
 * const jsTopics = await fetchTopicsBySearch("javascript");
 */
export const fetchTopicsBySearch = async (term: string): Promise<TopicWithData[]> => {
    const topics = await prisma.topic.findMany({
        include: {
            _count: { 
                select: { posts: true }
            }
        },
        where: {
            OR: [
                // Search in topic name (slug) - case insensitive
                { slug: { contains: term } },
                // Search in topic description - case insensitive
                { description: { contains: term } }
            ]
        },
        orderBy: {
            posts: { _count: 'desc' }    // Order by popularity
        }
    });
    return topics as TopicWithData[];
}

/**
 * Fetches the most popular topics (by post count)
 * Useful for trending topics, sidebar components, etc.
 * 
 * @param limit - Maximum number of topics to return (default: 10)
 * @returns Promise<TopicWithData[]> - Array of top topics
 * @example
 * const topFive = await fetchTopTopics(5);
 */
export const fetchTopTopics = async (limit: number = 10): Promise<TopicWithData[]> => {
    const topics = await prisma.topic.findMany({
        include: {
            _count: { 
                select: { posts: true }
            }
        },
        orderBy: {
            posts: { _count: 'desc' }    // Order by most posts
        },
        take: limit                      // Limit number of results
    });
    return topics;
}

/**
 * Fetches a single topic by its slug
 * Includes user information for ownership verification
 * 
 * @param slug - The topic slug to search for
 * @returns Promise<TopicWithData | null> - Topic data or null if not found
 * @example
 * const topic = await fetchTopicBySlug("javascript");
 * if (topic && topic.userId === currentUserId) {
 *   // User can delete this topic
 * }
 */

export const fetchTopicBySlug = async (slug: string): Promise<TopicWithData | null> => {
    const topic = await prisma.topic.findUnique({
        where: { slug },
        include: {
            _count: { 
                select: { posts: true }
            },
            user: {
                select: { id: true }
            }
        }
    });
    // Map user.id to userId for TopicWithData type
    if (!topic) return null;
    return {
        ...topic,
        userId: (topic as any).user?.id
    } as TopicWithData;
}
