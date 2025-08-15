import { getCommentByPostId } from '@/lib/query/comments'
import React from 'react'
import { Avatar, AvatarImage , AvatarFallback} from '../ui/avatar'
import CommentCreateForm from './comment-create-form'

type CommentShowProps = {
    postId: string
    commentId: string | null
}
const CommentShow: React.FC<CommentShowProps> = async ({ postId, commentId }) => {

    const comments = await getCommentByPostId(postId);

    const comment = comments.find((c) => c.id === commentId);

    if (!comment) return null;

    const children = comments.filter((c) => c.parentId === commentId);

    return (
        <div className='m-4 p-2 border rounded-md bg-gray-50'>
            <div className='flex gap-3'>
                <Avatar className='h-10 w-10'>
                    <AvatarImage src={comment?.user?.image || ""}></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                    <div className='flex-1 space-y-1'>
                        <p className='text-grey-500 text-sm  font-light'>{comment?.user?.name}</p>
                        {/* <span>{comment?.createdAt}</span> */}
                        <p>{comment?.content}</p>
                        <CommentCreateForm postId={comment.postId} parentId={comment.id} />
                    </div>
            </div>
            <div>
                {
                    children.map((child) => {
                        return <CommentShow key={child.id} postId={postId} commentId={child.id} />
                    })
                }
            </div>
        </div>
    )
}

export default CommentShow
