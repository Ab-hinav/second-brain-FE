import { auth } from "@/auth";
import {Button, Card, CardBody} from "@heroui/react";
import Link from "next/link";

export default async function LandingPage() {

  const session = await auth();
  const isLoggedIn = !!session?.user;

  const toRender = isLoggedIn ? <div>
    <Button as={Link} href="/dashboard" color="primary" size="lg">Go to Dashboard</Button>
  </div> : <div>
    <Button as={Link} href="/auth" color="primary" size="lg">Sign in</Button>
  </div>;

  return (
    <div className="space-y-8  ">
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Capture. Organize. Recall.</h1>
        <p className="opacity-80 max-w-2xl mx-auto">
          Save links and notes to brains (folders), share read-only, and manage everything from a clean dashboard.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
         {toRender}
        </div>
      </section>

      <Card className="m-10 w-fit mx-auto" >
        <CardBody className="flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <h3 className="font-semibold">Links</h3>
            <p className="opacity-70">X/Twitter, YouTube, articles…</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Notes</h3>
            <p className="opacity-70">Quick text with tags.</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Share</h3>
            <p className="opacity-70">Read-only brain sharing.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}