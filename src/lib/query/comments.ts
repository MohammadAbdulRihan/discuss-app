import { prisma } from '..'
import type { Comment } from '@prisma/client'
import { cache } from 'react'

export type CommentWithAuthor = Comment & {
    user: {
        name: string | null,
        image: string | null
    }
}
export const getCommentByPostId = cache((postId: string): Promise<CommentWithAuthor[]> => {
    const comments = prisma.comment.findMany({
        where: { postId },
        include: {
            user: {
                select: {
                    name: true,
                    image: true
                }
            }
        }
    })
    return comments;
})