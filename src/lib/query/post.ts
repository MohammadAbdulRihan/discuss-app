import type { Post } from '@prisma/client';
import type { Topic } from '@prisma/client';
import { prisma } from '..';


// fetching from database througth slug

export type PostWithData = Post & {
    topic: { slug: string }
    _count: { comments: number }
    user: { name: string | null }
}

export const fetchPostByTopicSlug = async (slug: string): Promise<PostWithData[]> => {
    const post = await prisma.post.findMany({
        where: {
            topic: { slug }
        },
        include: {
            topic: { select: { slug: true } },
            _count: { select: { comments: true } },
            user: { select: { name: true } }
        }
    })
    return post
}

export const fetchTopPosts = async (): Promise<PostWithData[]> => {
    const post = await prisma.post.findMany({
        orderBy: {
            comments: { _count: 'desc' }
        },
        include: {
            topic: { select: { slug: true } },
            _count: { select: { comments: true } },
            user: { select: { name: true } }
        },
        take: 10
    })
    return post
}

export const fetchPostBySearch = async (term: string): Promise<PostWithData[]> => {
    const data = await prisma.post.findMany({
        include: {
            topic: { select: { slug: true } },
            _count: { select: { comments: true } },
            user: { select: { name: true } }
        },
        where: {
            OR: [
                { title: { contains: term, } },
                { content: { contains: term, } },
                { topic: { slug: { contains: term, } } },
                { topic: { description: { contains: term, } } }
            ]
        }
    })
    return data;
}

// Fetch all topics with post count
export type TopicWithData = Topic & {
    _count: { posts: number }
}
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

