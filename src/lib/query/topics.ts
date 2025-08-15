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
 * Includes post count for displaying topic popularity
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
 * Fetch all topics with post counts, ordered by popularity
 * Used for displaying trending topics on the homepage
 * 
 * @returns Promise<TopicWithData[]> - Array of topics with post counts
 */
export const fetchAllTopics = async (): Promise<TopicWithData[]> => {
    const topics = await prisma.topic.findMany({
        include: {
            _count: { select: { posts: true } }
        },
        orderBy: {
            posts: { _count: 'desc' }
        }
    });
    return topics;
}

/**
 * Fetch a single topic by its slug
 * Used for topic detail pages and ownership verification
 * 
 * @param slug - The unique slug identifier for the topic
 * @returns Promise<TopicWithData | null> - The topic if found, null otherwise
 */
export const fetchTopicBySlug = async (slug: string): Promise<TopicWithData | null> => {
    const topic = await prisma.topic.findUnique({
        where: { slug },
        include: {
            _count: { 
                select: { posts: true }
            }
        }
    });
    return topic;
}

/**
 * Search topics by term (slug or description)
 * Used for topic search functionality
 * 
 * @param term - Search term to match against topic slug or description
 * @returns Promise<TopicWithData[]> - Array of matching topics with post counts
 */
export const fetchTopicsBySearch = async (term: string): Promise<TopicWithData[]> => {
    const topics = await prisma.topic.findMany({
        include: {
            _count: { select: { posts: true } }
        },
        where: {
            OR: [
                { slug: { contains: term } },
                { description: { contains: term } }
            ]
        },
        orderBy: {
            posts: { _count: 'desc' }
        }
    });
    return topics;
}

/**
 * Fetch top topics with most posts
 * Used for displaying popular topics in sidebars
 * 
 * @param limit - Maximum number of topics to return (default: 10)
 * @returns Promise<TopicWithData[]> - Array of top topics with post counts
 */
export const fetchTopTopics = async (limit: number = 10): Promise<TopicWithData[]> => {
    const topics = await prisma.topic.findMany({
        include: {
            _count: { select: { posts: true } }
        },
        orderBy: {
            posts: { _count: 'desc' }
        },
        take: limit
    });
    return topics;
}

/**
 * Get topics created by a specific user
 * Used for user profile pages and content management
 * 
 * @param userId - The ID of the user whose topics to fetch
 * @returns Promise<TopicWithData[]> - Array of user's topics with post counts
 */
export const fetchTopicsByUser = async (userId: string): Promise<TopicWithData[]> => {
    const topics = await prisma.topic.findMany({
        where: { userId },
        include: {
            _count: { select: { posts: true } }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return topics;
}

/**
 * Check if a topic slug already exists
 * Used for preventing duplicate topic creation
 * 
 * @param slug - The slug to check for existence
 * @returns Promise<boolean> - True if slug exists, false otherwise
 */
export const checkTopicSlugExists = async (slug: string): Promise<boolean> => {
    const topic = await prisma.topic.findUnique({
        where: { slug },
        select: { id: true }
    });
    return !!topic;
}

/**
 * Get basic topic statistics
 * Used for admin dashboards and analytics
 * 
 * @returns Promise with total topics count and most popular topic
 */
export const getTopicStats = async () => {
    try {
        const totalTopics = await prisma.topic.count();
        
        const mostPopularTopic = await prisma.topic.findFirst({
            include: {
                _count: { select: { posts: true } }
            },
            orderBy: {
                posts: { _count: 'desc' }
            }
        });

        return {
            totalTopics,
            mostPopularTopic
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch topic stats: ${error.message}`);
        }
        throw new Error("Failed to fetch topic stats");
    }
}
