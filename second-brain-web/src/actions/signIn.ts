'use server'

import * as auth from '@/auth';

export async function signIn(type:'github'|'google'){
    return auth.signIn(type,{redirectTo:'/dashboard',redirect:true})
}

export async function signInViaCreds(email:string, password:string){
    return auth.signIn('credentials', {
        email,
        password
    ,redirect:true, redirectTo:'/dashboard'})
}