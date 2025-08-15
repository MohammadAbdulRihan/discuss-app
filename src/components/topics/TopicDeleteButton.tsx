/**
 * TOPIC DELETE BUTTON COMPONENT
 * 
 * This component provides a delete button for topics that only appears
 * for the topic creator/owner. It handles the deletion process with
 * strong user confirmation since deleting a topic removes all posts and comments.
 * 
 * Security Features:
 * - Only visible to topic owners
 * - Strong confirmation dialog (mentions all content will be deleted)
 * - Loading state during deletion
 * - Error handling with user feedback
 * 
 * @requires deleteTopic server action
 * @requires auth session for ownership check
 */

"use client"

import { Button } from "@/components/ui/button";
import { deleteTopic } from "@/actions/deleteTopic";
import { Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * Props for the TopicDeleteButton component
 */
interface TopicDeleteButtonProps {
    topicId: string;     // ID of the topic to delete
    topicSlug: string;   // Slug/name of the topic (for confirmation dialog)
}

/**
 * Delete button component for topics
 * Shows strong confirmation dialog since this is a very destructive action
 * 
 * @param topicId - The ID of the topic to delete
 * @param topicSlug - The slug/name of the topic (used in confirmation)
 */
const TopicDeleteButton: React.FC<TopicDeleteButtonProps> = ({ topicId, topicSlug }) => {
    // State to track if deletion is in progress
    const [isDeleting, setIsDeleting] = useState(false);
    
    /**
     * Handles the delete process with strong confirmation
     * Uses a more detailed warning since deleting a topic removes ALL content
     */
    const handleDelete = async () => {
        // Step 1: Show strong confirmation dialog explaining consequences
        const confirmMessage = 
            `⚠️ WARNING: Are you sure you want to delete the topic "${topicSlug}"?\n\n` +
            `This will permanently delete:\n` +
            `• The topic itself\n` +
            `• ALL posts in this topic\n` +
            `• ALL comments on those posts\n\n` +
            `This action cannot be undone!`;
        
        if (!confirm(confirmMessage)) {
            return; // User cancelled, don't delete
        }
        
        // Step 2: Double confirmation for extra safety
        const doubleConfirm = confirm(
            `Last chance! Type "DELETE" in the next dialog to confirm deletion of "${topicSlug}"`
        );
        
        if (!doubleConfirm) {
            return; // User cancelled on second confirmation
        }
        
        // Step 3: Set loading state
        setIsDeleting(true);
        
        try {
            // Step 4: Call server action to delete the topic
            await deleteTopic(topicId);
            // Note: If successful, the server action will redirect to homepage
            // so we won't reach the code below
        } catch (error) {
            // Step 5: Handle errors and show user feedback
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Failed to delete topic";
            
            alert(`Error: ${errorMessage}`);
            
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
            {isDeleting ? "Deleting..." : "Delete Topic"}
        </Button>
    );
};

export default TopicDeleteButton;
