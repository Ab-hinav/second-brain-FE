'use server'
import { z} from 'zod';
import { signInViaCreds } from './signIn';
import { AuthError, CredentialsSignin } from 'next-auth';

interface AuthUserFormState{
    errors: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        _form?: string[]
    };
}


const signInSchema = z.object({
    email: z.email('Invalid Email address'),
    password: z.string().min(3,"Password must be at least 3 characters long"),
})

const signUpSchema = z.object({
    name : z.string().min(3,'Name should have atleast 3 characters'),
    email: z.email('Invalid Email address'),
    password: z.string().min(3, "Password must be at least 3 characters long"),
    confirmPassword: z.string().min(3, "Password must be at least 3 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})


function isNextRedirect(err: unknown): boolean {
    return !!(
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof (err as any).digest === 'string' &&
      (err as any).digest.startsWith('NEXT_REDIRECT')
    );
  }

export async function AuthenticateUser( formState: AuthUserFormState,
    formData: FormData):Promise<AuthUserFormState>{

        const parsedResp = signInSchema.safeParse({
            email : formData.get('email'),
            password: formData.get('password')
        })

        if(!parsedResp.success){
            return {
                errors: parsedResp.error.flatten().fieldErrors
            }
        }


        try {
            await signInViaCreds(parsedResp.data.email, parsedResp.data.password)
        }catch(err){


            if (isNextRedirect(err)) throw err;

            if (err instanceof CredentialsSignin) {
                return { errors: { _form: ["Invalid email or password"] } };
              }
              // Other Auth.js errors (network, misconfig, etc.)
              if (err instanceof AuthError) {
                return { errors: { _form: ["Something went wrong. Please try again."] } };
              }



            if(err instanceof Error){
                return {
                    errors:{
                        _form:[err.message]
                    }
                }
            }
            throw err;
        }
        return {
            errors:{}
        }

}


export async function SignUpUser( formState: AuthUserFormState,
    formData: FormData):Promise<AuthUserFormState>{
        console.log('run me')
        const parsedResp = signUpSchema.safeParse({
            name: formData.get('name'),
            email : formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        })

        if(!parsedResp.success){
            return {
                errors: parsedResp.error.flatten().fieldErrors
            }
        }

        try{
            
            const signUpres = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/signup`,
              {
                method: "POST",
                headers: { "content-type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({
                  name: parsedResp.data.name,
                  email: parsedResp.data.email,
                  password: parsedResp.data.password,
                }),
              }
            );


            switch(signUpres.status){
                case 409:
                    return {
                        errors:{
                            _form:["User already exists"]
                        }
                    }

                case 500:
                    return {
                        errors:{
                            _form:["Something went wrong"]
                        }
                    }
                case 201:
                    await signInViaCreds(parsedResp.data.email, parsedResp.data.password)
                    break;

                case 400:
                    return {
                        errors:{
                            _form:["Bad Input"]
                        }
                    }
            }



        }catch(err){

            if (isNextRedirect(err)) throw err;

            if(err instanceof Error){
                return {
                    errors:{
                        _form:[err.message]
                    }
                }
            }
        }

        return {
            errors:{}
        }

}