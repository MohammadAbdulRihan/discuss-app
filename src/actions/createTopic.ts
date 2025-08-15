"use server"
import { z } from 'zod'; 
import {auth} from "@/auth";
import { Topic } from '@prisma/client';
import { prisma } from "@/lib";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreateTopicSchema = z.object({
    name: z.string().min(2).max(100).regex(/^[a-z0-9]+$/, {message:"must be in lowercase with no spaces"}),
    description: z.string().min(5).max(500)
})

// what is this
// This is the state of the form for creating a new topic
// It holds any validation errors that occur during form submission
// This is used to manage the form's error state and display error messages to the user
type CreateFormTopicState = {
    errors : {
        name?:string[],
        description?:string[],
        formError?:string[]
    }
}
export const createTopic = async (prevState:CreateFormTopicState , formData: FormData) : Promise<CreateFormTopicState> => {
    const name = formData.get('name') 
    const description = formData.get('description') 

    const result = CreateTopicSchema.safeParse(
       { name : formData.get('name'),
        description:formData.get('description')}

    )
    // This will show in your server terminal
    console.log("Server action called:", name, description)
    
    if( !result.success){
        return {
            // This will return any validation errors found during form submission
            // These errors will be displayed to the user in the form
            errors:result.error.flatten().fieldErrors
        }
    }

    const session  = await auth();
    if( !session || !session?.user){
        return {
            errors:{
                formError: ["You must be logged in to create a topic"]
            }
        }
    }
    // Check if topic with this slug already exists
    // const existingTopic = await prisma.topic.findUnique({
    //     where: { slug: result.data.name }
    // });

    // if (existingTopic) {
    //     return {
    //         errors: {
    //             name: ["A topic with this name already exists"]
    //         }
    //     }
    // }

    // topic type Topic for Prisma
    // This will be the new topic created in the database
    let topic : Topic
    try{
        topic = await prisma.topic.create({
        data:{
            slug: result.data.name,
            description: result.data.description,
            userId: session.user.id,  // Add the creator's user ID
        } as any
    });
    }catch(error){
        if( error instanceof Error){
            return {
                errors:{
                formError: [error.message]
            }
            }
        }else{
            return{
                errors:{
                formError: ["Unknown error occurred"]
            }
            }
        }
    }

    // Revalidate the home page
    // This will ensure that the latest topics are displayed
    // by re-fetching the data from the server
    // and updating the cache
    revalidatePath("/")
    redirect(`/topics/${topic.slug}`)
}