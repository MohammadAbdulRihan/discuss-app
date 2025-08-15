/**
 * POST DELETE BUTTON COMPONENT
 * 
 * This component provides a delete button for posts that only appears
 * for the post creator/owner. It handles the deletion process with
 * user confirmation and loading states.
 * 
 * Security Features:
 * - Only visible to post owners
 * - Confirmation dialog before deletion
 * - Loading state during deletion
 * - Error handling with user feedback
 * 
 * @requires deletePost server action
 * @requires auth session for ownership check
 */

"use client"

import { Button } from "@/components/ui/button";
import { deletePost } from "@/actions/deletePost";
import { Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * Props for the PostDeleteButton component
 */
interface PostDeleteButtonProps {
    postId: string;      // ID of the post to delete
    postTitle: string;   // Title of the post (for confirmation dialog)
}

/**
 * Delete button component for posts
 * Shows confirmation dialog and handles deletion process
 * 
 * @param postId - The ID of the post to delete
 * @param postTitle - The title of the post (used in confirmation)
 */
const PostDeleteButton: React.FC<PostDeleteButtonProps> = ({ postId, postTitle }) => {
    // State to track if deletion is in progress
    const [isDeleting, setIsDeleting] = useState(false);
    
    /**
     * Handles the delete process with confirmation
     * Prevents accidental deletions by requiring user confirmation
     */
    const handleDelete = async () => {
        // Step 1: Show confirmation dialog with post title
        const confirmMessage = `Are you sure you want to delete "${postTitle}"? This will also delete all comments on this post.`;
        
        if (!confirm(confirmMessage)) {
            return; // User cancelled, don't delete
        }
        
        // Step 2: Set loading state
        setIsDeleting(true);
        
        try {
            // Step 3: Call server action to delete the post
            await deletePost(postId);
            // Note: If successful, the server action will redirect
            // so we won't reach the code below
        } catch (error) {
            // Step 4: Handle errors and show user feedback
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Failed to delete post";
            
            alert(errorMessage);
            
            // Reset loading state so user can try again
            setIsDeleting(false);
        }
    };

    return (
        <Button
            variant="destructive"      // Red color to indicate destructive action
            size="sm"                  // Small size for compact display
            onClick={handleDelete}     // Handle click event
            disabled={isDeleting}      // Disable during deletion to prevent double-clicks
            className="flex items-center gap-2"
        >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
        </Button>
    );
};

export default PostDeleteButton;
