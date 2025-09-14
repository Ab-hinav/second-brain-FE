



import Image from "next/image";

import * as actions from '@/actions';
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import AuthFormSignUp from "../components/auth-form-signup";
import { FaGithub, FaGoogle } from "react-icons/fa";
import AuthFormSignIn from "../components/auth-form-signin";

/** Auth page: toggles between Sign In and Sign Up via `?isSignup=true`. */
export default async function AuthPage({searchParams}: {
  searchParams?: {
    isSignup?: string;
  }
}) {
    
    const isSignup = (await searchParams)?.isSignup === 'true';


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl overflow-hidden">
        <CardBody className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT: image + OAuth buttons */}
            <div className="flex flex-col">
              <div className="relative h-56 md:h-80 lg:h-[420px]">
                {/* Put a file at /public/auth.jpg (or rename below) */}
                <Image
                  src="/auth-brain.jpg"
                  alt="Welcome"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-6 border-t flex flex-col gap-3">
    
                <form action={actions.signIn.bind(null, 'google')} >
                <Button
                  className="w-full"
                  type="submit"
                >
                  Continue with Google <FaGoogle  />
                </Button>
                </form>
                <form action={actions.signIn.bind(null, 'github')} >
                <Button
                   className="w-full"
                  variant="bordered"
                  
                  type="submit"
                >
                  Continue with GitHub <FaGithub />
                </Button>
                </form>
              </div>
            </div>
            {isSignup? <AuthFormSignUp></AuthFormSignUp> : <AuthFormSignIn></AuthFormSignIn>}
            
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
