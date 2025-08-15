"use server"
import { prisma } from "@/lib";
import { Post } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const createPostSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
})
type createPostState = {
  errors: {
    title?: string[],
    content?: string[],
    formError?: string[]
  }
}
const createPost = async (slug:string , prevState:createPostState, formData: FormData): Promise<createPostState> => {
  console.log("Create post action called")
  console.log(formData.get("title"))
  console.log(formData.get("content"))

  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content")
  })

  const session  = await auth();
      if( !session || !session?.user || !session?.user.id){
          return {
              errors:{
                  formError: ["You must be logged in to create a topic"]
              }
          }
      }
  
  if (!result.success) {
    return {
      // This will return any validation errors found during form submission
      // These errors will be displayed to the user in the form
      errors: result.error.flatten().fieldErrors
    }
  }

  // Check if topic exists
  const topic = await prisma.topic.findFirst({
    where : { slug }
  })

  if( !topic){
    return {
      errors:{
        formError: ["Topic not found"]
      }
    }
  }

  let post : Post
  try {
    post = await  prisma.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          formError: [error.message]
        }
      }
    }
    else {
      return {
        errors: {
          formError: ["Unknown error"]
        }
      }
    }
  }


  revalidatePath(`/topics/${slug}`)
  redirect(`/topics/${slug}/posts/${post.id}`);
}
export default createPost


