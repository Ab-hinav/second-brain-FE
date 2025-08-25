'use client'

import { Input, Button } from "@heroui/react";
import { useActionState } from "react";
import * as actions from '@/actions';
import Link from "next/link";


export default function AuthFormSignIn(){

    const [result, formAction, isPending] = useActionState(
       actions.AuthenticateUser,
        { errors: {} }
      );
    

    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-semibold mb-1">Sign in</h1>
        <p className="opacity-70 mb-6">Use your email and password.</p>

        <form action={formAction} noValidate className="space-y-4">
          <Input
            type="email"
            label="Email"
            name="email"
            isRequired
            placeholder="you@example.com"
            isInvalid={!!result?.errors?.email}
            errorMessage={result?.errors?.email?.[0]}
          />
          <Input
            type="password"
            label="Password"
            name="password"
            isRequired
            placeholder="••••••••"
            isInvalid={!!result?.errors?.password}
            errorMessage={result?.errors?.password?.[0]}
          />
          <Button
            type="submit"
            color="primary"
            size="lg"
            isLoading={isPending}
            className="w-full"
          >
            Sign in
          </Button>
        </form>
        <p className="text-xs opacity-60 mt-3">
          New User? Try{" "}
          <Link href={"/auth?isSignup=true"} className="underline">
            SignUp
          </Link>
        </p>
      </div>
    );

}