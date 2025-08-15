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
 * Server action to delete a topic and all associated posts and comments
 * Only the topic creator can delete their own topics
 * 
 * @param topicId - The ID of the topic to delete
 * @throws Error if user is not authenticated or not the topic owner
 */
export const deleteTopic = async (topicId: string) => {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session || !session.user) {
        throw new Error("You must be signed in to delete a topic");
    }

    // Find the topic and verify ownership
    const topic = await prisma.topic.findUnique({
        where: { id: topicId },
        include: { posts: true }
    });

    if (!topic) {
        throw new Error("Topic not found");
    }

    // Verify that the current user is the topic owner
    if (topic.userId !== session.user.id) {
        throw new Error("You can only delete your own topics");
    }

    try {
        // Delete all comments associated with posts in this topic
        await prisma.comment.deleteMany({
            where: {
                post: {
                    topicId: topicId
                }
            }
        });

        // Delete all posts in this topic
        await prisma.post.deleteMany({
            where: { topicId: topicId }
        });

        // Delete the topic itself
        await prisma.topic.delete({
            where: { id: topicId }
        });

        // Revalidate the home page to refresh the topics list
        revalidatePath("/");
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete topic: ${error.message}`);
        }
        throw new Error("Failed to delete topic");
    }
    
    // Redirect to home page after successful deletion
    revalidatePath("/");
    redirect("/");
}
