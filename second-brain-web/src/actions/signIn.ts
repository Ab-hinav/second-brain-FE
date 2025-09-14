'use server'
/** Thin server actions that delegate to NextAuth signIn. */

import * as auth from '@/auth';

/** Sign in with an OAuth provider and redirect to dashboard. */
export async function signIn(type: 'github' | 'google') {
    return auth.signIn(type,{redirectTo:'/dashboard',redirect:true})
}

/** Sign in via credentials provider and redirect to dashboard. */
export async function signInViaCreds(email: string, password: string){
    return  await auth.signIn('credentials', {
        email,
        password,
        redirect:true,
        redirectTo:'/dashboard'
    })
    
}
