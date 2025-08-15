"use server"
import { z } from 'zod'; 
import { auth } from "@/auth";
import { Topic } from '@prisma/client';
import { prisma } from "@/lib";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreateTopicSchema = z.object({
    name: z.string().min(2).max(100).regex(/^[a-z0-9]+$/, {message:"must be in lowercase with no spaces"}),
    description: z.string().min(5).max(500)
})

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
    console.log("Server action called:", name, description)
    
    if( !result.success){
        return {
            errors:result.error.flatten().fieldErrors
        }
    }

    const session = await auth();
    if( !session || !session.user || !session.user.id){
        return {
            errors:{
                formError : ['You must be Signed in to create a topic']
            }
        }
    }

    let topic: Topic | null = null;
    try{
        topic = await prisma.topic.findFirst({
            where: { slug: result.data.name }
        });

        if (topic) {
            return {
                errors: {
                    formError: ['A topic with this name already exists']
                }
            }
        }

        topic = await prisma.topic.create({
            data : {
                slug: result.data.name,
                description: result.data.description,
                userId: session.user.id
            }
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                errors: {
                    formError: [error.message]
                }
            }
        }
        return {
            errors: {
                formError: ['Something went wrong']
            }
        }
    }

    revalidatePath("/")
    redirect(`/topics/${topic.slug}`)
}