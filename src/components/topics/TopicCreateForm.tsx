"use client"
import { createTopic } from "@/actions/createTopic"
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

export function TopicCreateForm() {
  const [ formState, formAction ] = useActionState(createTopic , {errors:{}});
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New Topic</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create a new topic</DialogTitle>
            <DialogDescription>
              Write topic name and some text to describe the topic.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Topic Name</Label>
              <Input id="name" name="name" />
            </div>
            {formState.errors.name && (
              <div className="text-red-500">{formState.errors.name.join(", ")}</div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="description">Topic description</Label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your topic..."
              />
            </div>
            {formState.errors.description && (
              <div className="text-red-500">{formState.errors.description.join(", ")}</div>
            )}
            {formState.errors.formError && (
              <div className="text-red-500">{formState.errors.formError.join(", ")}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Create Topic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TopicCreateForm