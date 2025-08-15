"use client"
import createPost from "@/actions/createPost"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"

type PostCreateFormProps = {
  slug: string
}

export const PostCreateForm = ({ slug }: PostCreateFormProps) => {
  const [ formState, formAction ] = useActionState(createPost.bind(null, slug) , {errors:{}});
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create a new Post</DialogTitle>
            <DialogDescription>
              Write post title and some text to describe the post.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Title</Label>
              <Input id="name" name="title" />
            </div>
            {
              formState.errors.title && (
                <div className="text-red-500">{formState.errors.title.join(", ")}</div>
              )
            }
            <div className="grid gap-3">
              <Label htmlFor="description">Post description</Label>
              <textarea
                id="description"
                name="content"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your post..."
              />
            </div>
            {formState.errors.content && (
              <div className="text-red-500">{formState.errors.content.join(", ")}</div>
            )}
            {formState.errors.formError && (
              <div className="text-red-500">{formState.errors.formError.join(", ")}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PostCreateForm