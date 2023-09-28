import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "~/config/site";

export default function LandingContent() {
  return (
    <>
      <header className="border-slate-6 bg-slate-1/5 w-full  border-b backdrop-blur-lg">
        <nav
          aria-label="Global"
          className="flex w-full flex-row justify-between px-12 py-2"
        >
          <div className="flex flex-row items-center">
            <Link href="/" className="flex flex-row pr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-6 w-6"
              >
                <rect width="256" height="256" fill="none"></rect>
                <line
                  x1="208"
                  y1="128"
                  x2="128"
                  y2="208"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                ></line>
                <line
                  x1="192"
                  y1="40"
                  x2="40"
                  y2="192"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                ></line>
              </svg>
              <span className="hidden font-bold sm:inline-block">
                {siteConfig.name}
              </span>
            </Link>
          </div>
          <Link href="/login" className="flex flex-row pr-3">
            <Button variant="default">Sign in</Button>
          </Link>
        </nav>
      </header>
      <section className="h-screen w-full bg-black py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none">
                  Revolutionize Your Code Documentation
                </h1>
                <p className="mx-auto max-w-[600px] text-zinc-200 dark:text-zinc-100 md:text-xl">
                  We understand your code. We document your code. You chat with
                  your code.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 border-gray-900 bg-gray-800 text-white"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button className="bg-white text-black" type="submit">
                    Join Now
                  </Button>
                </form>
                <p className="text-xs text-zinc-200 dark:text-zinc-100">
                  Get ready to redefine your email experience.
                  <Link
                    className="text-white underline underline-offset-2"
                    href="#"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
