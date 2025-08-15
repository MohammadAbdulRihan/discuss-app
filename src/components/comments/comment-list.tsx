import React from 'react'
import CommentShow from './comment-show'
import { getCommentByPostId } from '@/lib/query/comments'

type CommentListProps = {
    postId: string
}
const CommentList: React.FC<CommentListProps> =  async ({ postId }) => {
    const comments = await getCommentByPostId(postId);

    const topLevelComments = comments.filter( (comment) => ( comment.parentId == null))
  return (
    <div>
      <h1>All {topLevelComments.length} comments</h1>
      {
        topLevelComments.map((comments) => {
            return <CommentShow key={comments.id} postId={postId} commentId={comments.id} />
        })
      }
    </div>
  )
}

export default CommentList

