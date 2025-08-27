// src/components/Footer.tsx
"use client";

import { Card, CardBody } from "@heroui/react";
import Link from "next/link";

export default function Footer() {
  return (
    <Card className="rounded-none dark:bg-gray-900 shadow-2xl ">
      <CardBody className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 py-6 text-sm">
        {/* Brand */}
        <div className="font-semibold link-colored">Second Brain</div>

        {/* Navigation */}
        <div className="flex gap-6 opacity-80">
          <Link href="/features" className="link-colored">
            Features
          </Link>
          <Link href="/pricing" className="link-colored">
            Pricing
          </Link>
          <Link href="/about" className="link-colored">
            About
          </Link>
          <Link href="/contact" className="link-colored">
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <div className="opacity-60 text-xs">
          © {new Date().getFullYear()} Second Brain
        </div>
      </CardBody>
    </Card>
  );
}