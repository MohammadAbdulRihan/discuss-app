/**
 * SERVER ACTION: Delete Topic
 * 
 * This file contains the server action for deleting topics.
 * Only the creator (owner) of a topic can delete it.
 * 
 * Security Features:
 * - Checks user authentication
 * - Verifies topic ownership
 * - Cascades delete to remove all posts and comments in the topic
 * - Redirects user to homepage after deletion
 * 
 * @requires auth - User must be signed in
 * @requires ownership - User must own the topic
 */

"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Deletes a topic and all its associated posts and comments
 * WARNING: This is a destructive operation that removes all content in the topic
 * 
 * @param topicId - The ID of the topic to delete
 * @throws Error if user is not authenticated
 * @throws Error if topic is not found
 * @throws Error if user doesn't own the topic
 */
export const deleteTopic = async (topicId: string) => {
    // Step 1: Check if user is authenticated
    const session = await auth();
    
    if (!session || !session.user) {
        throw new Error("You must be signed in to delete a topic");
    }

    // Step 2: Find the topic and verify it exists
    const topic = await prisma.topic.findUnique({
        where: { id: topicId },
        include: { 
            posts: {
                include: {
                    _count: {
                        select: { comments: true }
                    }
                }
            },
            _count: {
                select: { posts: true }
            }
        }
    });

    if (!topic) {
        throw new Error("Topic not found");
    }

    // Step 3: Verify ownership - Only the creator can delete
    if ((topic as any).userId !== session.user.id) {
        throw new Error("You can only delete your own topics");
    }

    try {
        // Step 4: Delete all comments in all posts within this topic
        // This must be done first due to foreign key constraints
        await prisma.comment.deleteMany({
            where: {
                post: {
                    topicId: topicId
                }
            }
        });

        // Step 5: Delete all posts in this topic
        await prisma.post.deleteMany({
            where: { topicId: topicId }
        });

        // Step 6: Delete the topic itself
        await prisma.topic.delete({
            where: { id: topicId }
        });

        // Step 7: Revalidate homepage to show updated topic list
        revalidatePath("/");
        
    } catch (error) {
        // Only catch actual database errors, not redirects
        if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
            console.error("Error deleting topic:", error);
            throw new Error("Failed to delete topic. Please try again.");
        }
        // Re-throw redirect errors
        throw error;
    }
    
    // Step 8: Redirect user back to homepage (outside try-catch)
    redirect("/");
}
