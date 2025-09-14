'use client'

import { Input, Button } from "@heroui/react";
import { startTransition, useActionState } from "react";
import * as actions from '@/actions';
import Link from "next/link";


/** Sign-up form that calls the SignUpUser server action. */
export default function AuthFormSignUp(){

    const [result, formAction, isPending] = useActionState(
       actions.SignUpUser,
        { errors: {} }
      );
    

      return (
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-semibold mb-1">Sign Up</h1>
          <p className="opacity-70 mb-6">
            Use your email and password. To create an Account
          </p>

          <form action={formAction} noValidate className="space-y-4">
            <Input
              type="text"
              name="name"
              label="Name"
              isRequired
              placeholder="your name"
              isInvalid={!!result?.errors?.name}
            errorMessage={result?.errors?.name?.[0]}
            />
            <Input
              type="email"
              name="email"
              label="Email"
              isRequired
              placeholder="you@example.com"
              isInvalid={!!result?.errors?.email}
              errorMessage={result?.errors?.email?.[0]}
            />
            <Input
              type="password"
              name="password"
              label="Create Password"
              isRequired
              placeholder="••••••••"
              isInvalid={!!result?.errors?.password}
              errorMessage={result?.errors?.password?.[0]}
            />
            <Input
              type="password"
              name="confirmPassword"
              label="Retype Password"
              isRequired
              placeholder="••••••••"
              isInvalid={!!result?.errors?.confirmPassword}
              errorMessage={result?.errors?.confirmPassword?.[0]}
            />
            <Button
              type="submit"
                color="secondary"
              size="lg"
              isLoading={isPending}
              className="w-full"
            >
              Sign up
            </Button>
          </form>

          {result?.errors._form && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-1">
                        <p className="text-sm text-red-800">{result.errors._form?.join(', ')}</p>
                    </div>
                )}
          <p className="text-xs opacity-60 mt-3">
            By creating an account. You agree to our terms and conditions.Back
            to{" "}
            <Link href={"/auth?isSignup=false"} className="underline">
              signIn
            </Link>
          </p>
        </div>
      );

}
