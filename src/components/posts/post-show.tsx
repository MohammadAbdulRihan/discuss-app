import React from 'react'
import { prisma } from '@/lib'
type PostShowProps = {
    postId : string
}
const PostShow : React.FC<PostShowProps> =  async ({postId}) => {
    const post = await prisma.post.findFirst({
        where : {
            id : postId
        }
    })
    console.log("PostShow post:", post)
  return (
    <div>
      { !post ? <div> 
        {" Post not found"}</div> : 
        <div>
            <h1 className='text-2xl font-bold mx-2 my-3'> {post.title}</h1>
            <p className='text-l text-gray-600 p-4 border rounded-2xl '>{post.content}</p>
        </div> }
    </div>
    
  )
}

export default PostShow
