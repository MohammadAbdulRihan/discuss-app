"use server"
import { auth } from '@/auth';
import { prisma } from '@/lib';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const commentSchema = z.object({
    content: z.string().min(2).max(400)
})

type CreateCommentState = {
    error: {
        content?: string[]
        formError?: string[]
    }
}
export const createComment = async ({ postId, parentId }: { postId: string, parentId?: string }, prevState: CreateCommentState, formData: FormData): Promise<CreateCommentState> => {
    console.log("createComment called with formData:", formData.get('content'));

    const result = commentSchema.safeParse({ content: formData.get('content') })

    if (!result.success) {
        console.log("Validation failed:", result.error);
        return {
            error: result.error.flatten().fieldErrors
        }
    }

    const session = await auth();
    if (!session || !session?.user || !session?.user?.id) {
        return {
            error: {
                formError: ["You must be logged in to comment."]
            }
        }
    }

    try {
        await prisma.comment.create({
            data: {
                content: result.data.content,
                postId: postId,
                userId: session.user.id,
                parentId: parentId
            }

        }
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("Error occurred:", error.message);
            error = { formError: [error.message] }
        } else {
            error = { formError: ["Something went wrong."] }
        }
    }


    const topic = await prisma.topic.findFirst({
        where: { posts: { some: { id: postId } } }
    })
    revalidatePath(`/topics/${topic?.slug}/posts/${postId}`)
    return {
        error: {}
    }
}


