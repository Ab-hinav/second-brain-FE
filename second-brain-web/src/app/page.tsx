import { auth } from "@/auth";
import {Button, Card, CardBody, CardFooter, CardHeader} from "@heroui/react";
import Link from "next/link";

export default async function LandingPage() {

  const session = await auth();
  const isLoggedIn = !!session?.user;

  const primaryCta = isLoggedIn ? (
    <Button as={Link} href="/dashboard" color="secondary" size="lg">
      Go to Dashboard
    </Button>
  ) : (
    <Button as={Link} href="/auth" color="secondary" size="lg">
      Sign in
    </Button>
  );

  return (
    <div className="space-y-16 py-12">
      {/* HERO SECTION */}
      <Card className="max-w-5xl mx-auto shadow-xl border-none bg-gradient-to-br from-background to-content1/40">
        <CardHeader className="flex flex-col items-center text-center gap-4 py-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Capture. Organize. Recall.
          </h1>
          <p className="opacity-80 max-w-2xl">
            Save links and notes into <span className="font-semibold">Brains</span> (smart folders),
            collaborate with <span className="font-semibold">read-only sharing</span>, and navigate everything
            from a clean, blazing-fast dashboard.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {primaryCta}
            <Button as={Link} href="/demo" variant="flat" size="lg">
              View Demo
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm">
            <span className="rounded-full border px-3 py-1 opacity-80">Private by default</span>
            <span className="rounded-full border px-3 py-1 opacity-80">One-click capture</span>
            <span className="rounded-full border px-3 py-1 opacity-80">Tags & full-text search</span>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col md:flex-row items-center justify-center gap-6 py-6">
          <div className="text-center">
            <div className="text-3xl font-bold">2×</div>
            <div className="opacity-70 text-sm">Faster save-to-note flow</div>
          </div>
          <div className="hidden md:block h-8 w-px bg-default-200" />
          <div className="text-center">
            <div className="text-3xl font-bold">0</div>
            <div className="opacity-70 text-sm">Setup required</div>
          </div>
          <div className="hidden md:block h-8 w-px bg-default-200" />
          <div className="text-center">
            <div className="text-3xl font-bold">Free</div>
            <div className="opacity-70 text-sm">to start</div>
          </div>
        </CardFooter>
      </Card>

      {/* FEATURES — SEPARATE CARDS */}
      <div className="grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center justify-center">
            <div className="text-3xl">🔗</div>
            <h3 className="mt-2 text-lg font-semibold">Links</h3>
          </CardHeader>
          <CardBody className="space-y-2 text-center">
            <p className="opacity-80">
              Save X/Twitter, YouTube, and article links with title, preview, and tags.
            </p>
            <ul className="text-sm opacity-80 space-y-1">
              <li>• One-click browser capture</li>
              <li>• Auto-fetch metadata</li>
              <li>• Tag & search instantly</li>
            </ul>
          </CardBody>
          <CardFooter className="justify-center">
            <Button as={Link} href="/features#links" variant="flat" size="sm">
              Learn more
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="text-center justify-center">
            <div className="text-3xl">🗒️</div>
            <h3 className="mt-2 text-lg font-semibold">Notes</h3>
          </CardHeader>
          <CardBody className="space-y-2 text-center">
            <p className="opacity-80">Quick notes with rich text and keyboard-first workflow.</p>
            <ul className="text-sm opacity-80 space-y-1">
              <li>• Tags & backlinks</li>
              <li>• Slash commands</li>
              <li>• Full-text search</li>
            </ul>
          </CardBody>
          <CardFooter className="justify-center">
            <Button as={Link} href="/features#notes" variant="flat" size="sm">
              Learn more
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="text-center justify-center">
            <div className="text-3xl">📤</div>
            <h3 className="mt-2 text-lg font-semibold">Share</h3>
          </CardHeader>
          <CardBody className="space-y-2 text-center">
            <p className="opacity-80">
              Share any brain via read-only links with fine-grained controls.
            </p>
            <ul className="text-sm opacity-80 space-y-1">
              <li>• Per-brain sharing</li>
              <li>• Expiring links</li>
              <li>• Public previews</li>
            </ul>
          </CardBody>
          <CardFooter className="justify-center">
            <Button as={Link} href="/features#share" variant="flat" size="sm">
              Learn more
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}