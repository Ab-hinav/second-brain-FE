'use server'
/** Signs the current user out and redirects home. */
import * as auth from '@/auth';

export async function signOut(){
    return auth.signOut({redirectTo:'/', redirect:true})
}
