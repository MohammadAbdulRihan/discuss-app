/**
 * SERVER ACTION: Delete Post
 * 
 * This file contains the server action for deleting posts.
 * Only the creator (owner) of a post can delete it.
 * 
 * Security Features:
 * - Checks user authentication
 * - Verifies post ownership
 * - Cascades delete to remove all comments on the post
 * - Redirects user to topic page after deletion
 * 
 * @requires auth - User must be signed in
 * @requires ownership - User must own the post
 */

"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Deletes a post and all its associated comments
 * 
 * @param postId - The ID of the post to delete
 * @throws Error if user is not authenticated
 * @throws Error if post is not found
 * @throws Error if user doesn't own the post
 */
export const deletePost = async (postId: string) => {
    // Step 1: Check if user is authenticated
    const session = await auth();
    
    if (!session || !session.user) {
        throw new Error("You must be signed in to delete a post");
    }

    // Step 2: Find the post and verify it exists
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { 
            topic: true,  // Include topic info for redirect
            user: true    // Include user info for verification
        }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    // Step 3: Verify ownership - Only the creator can delete
    if (post.userId !== session.user.id) {
        throw new Error("You can only delete your own posts");
    }

    try {
        // Step 4: Delete all comments on this post first (cascade delete)
        await prisma.comment.deleteMany({
            where: { postId: postId }
        });

        // Step 5: Delete the post itself
        await prisma.post.delete({
            where: { id: postId }
        });

        // Step 6: Revalidate the topic page to show updated content
        revalidatePath(`/topics/${post.topic.slug}`);
        
    } catch (error) {
        // Only catch actual database errors, not redirects
        if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
            console.error("Error deleting post:", error);
            throw new Error("Failed to delete post. Please try again.");
        }
        // Re-throw redirect errors
        throw error;
    }
    
    // Step 7: Redirect user back to the topic page (outside try-catch)
    redirect(`/topics/${post.topic.slug}`);
}
