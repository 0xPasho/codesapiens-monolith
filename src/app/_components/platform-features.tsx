import {
  CodeIcon,
  FileQuestionIcon,
  FileSymlinkIcon,
  SquareDashedBottomCodeIcon,
  Users2Icon,
  WholeWordIcon,
} from "lucide-react";

const PlatformFeatures = () => {
  return (
    <section
      id="features"
      className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Dive into a new era of code management with features designed for
          today's evolving tech landscape. From universal language comprehension
          to AI-driven documentation, experience a seamless integration of your
          GitHub repositories and heightened team collaboration.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg border border-primary bg-background p-2">
          <div className="flex min-h-[180px] flex-col justify-between rounded-md  p-6">
            <WholeWordIcon className="mb-4 h-5 w-5 text-primary" />

            <div className="space-y-2">
              <h3 className="font-bold text-primary">Our Code Extension</h3>
              <p className="text-sm">
                Instantly understand Github repositories by asking question
                directly with our extension
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6">
            <SquareDashedBottomCodeIcon className="mb-4 h-5 w-5" />

            <div className="space-y-2">
              <h3 className="font-bold">Dynamic Documentation</h3>
              <p className="text-sm">
                Automatic generation of up-to-date documentation leveraging AI.
                Say goodbye to outdated or missing docs.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6">
            <FileQuestionIcon className="mb-4 h-5 w-5" />

            <div className="space-y-2">
              <h3 className="font-bold">Ask Your Codebase</h3>
              <p className="text-sm text-muted-foreground">
                Query your documentation with natural language. Get quick
                answers about functions, classes, or any part of your codebase.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6">
            <Users2Icon className="mb-4 h-5 w-5" />

            <div className="space-y-2">
              <h3 className="font-bold">Built for Teams</h3>
              <p className="text-sm text-muted-foreground">
                Seamlessly collaborate with your team. Manage roles, grant
                access, and ensure everyone stays in the loop.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6">
            <FileSymlinkIcon className="mb-4 h-5 w-5" />

            <div className="space-y-2">
              <h3 className="font-bold">Automated File Creation</h3>
              <p className="text-sm text-muted-foreground">
                Generate new files with predefined templates. Streamline your
                workflow and maintain coding standards.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6">
            <CodeIcon className="mb-4 h-5 w-5" />

            <div className="space-y-2">
              <h3 className="font-bold">Any Programming Language</h3>
              <p className="text-sm text-muted-foreground">
                No language barriers here. Our platform comprehends and
                processes code from any programming language, ensuring accurate
                documentation and insights regardless of your tech stack.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
