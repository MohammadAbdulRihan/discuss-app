'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { createComment } from '@/actions/create-comment'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'

type CommentCreateFormProps = {
    postId: string;
    parentId?: string;
    startOpen?: boolean;
}

const CommentCreateForm: React.FC<CommentCreateFormProps> = ({ postId, parentId, startOpen }) => {
    const [open, setOpen] = useState(startOpen);
    const [formState, formaction, isPending] = useActionState(createComment.bind(null, { postId, parentId }), { error: {} })
    return (
        <div className='flex flex-col gap-1 '>
            <div><Button variant={'link'} onClick={() => setOpen(!open)}>Reply</Button></div>
            {open &&
                <div>
                    <form action={formaction} >
                        <textarea name='content' placeholder='with comments..' className='border p-2 rounded-md w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500' />
                        {formState.error.content && <div className='text-red-500'>{formState.error.content}</div>}
                        {formState.error.formError && <div className='text-red-500'>{formState.error.formError}</div>}
                        <Button disabled={isPending} variant={'link'} type='submit'>{
                            isPending ? <> <Loader2 /> Please wait...</> : "Save"
                        }</Button>
                    </form>
                </div>
            }
        </div>
    )
}

export default CommentCreateForm
