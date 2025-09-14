'use server'
/** Server action for creating a new brain (smart folder). */
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {  success, z } from "zod";



/** Result shape for the create-brain modal. */
interface CreateBrainFormState{
    errors: {
        name?: string[];
        _form?: string[]
    };
}


/** Input schema for brain creation. */
const CreateBrainSchema = z.object({
    name: z.string().min(3,"Name must be at least 3 characters long"),
    description: z.string().optional(),
    
})

/**
 * Creates a brain for the current user and revalidates the `brain-nav` tag
 * so the sidebar updates immediately.
 */
export async function CreateBrainForUser(formState:CreateBrainFormState , formData:FormData){

    const session =await auth();

    const token = (session as any)?.accessToken;

    if(formData == null){
        return  {errors:{},
        success:false}
    }

    const parsedResp = CreateBrainSchema.safeParse({
        name : formData.get('name'),
        description: formData.get('description')
    })


    if(!parsedResp.success){
        return {
            errors: parsedResp.error.flatten().fieldErrors
        }
    }
    const brainName = parsedResp.data.name
    const desc = parsedResp.data.description;

    try {

        const apiResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brain`, {
            method: "POST",
            headers: { "content-type": "application/json" 
                , "Authorization": `Bearer ${token}`
            },
            cache: "no-store",
            body: JSON.stringify({
              name: brainName,
              description: desc
            }),
          })

        if(!apiResp.ok){

            if (apiResp.status == 409) {
              return {
                success: false,
                errors: {
                  _form: ["Brain already exists"],
                },
              };
            }

            return {
                success:false,
                errors: {
                    _form:['Something went wrong']
                }
            }
        }

    }catch(error){

        return {
            success:false,
            errors: {
                _form:['Something went wrong']
            }
        }


    }

    revalidateTag('brain-nav')

    return {
        errors:{},
        success:true
    }

}
