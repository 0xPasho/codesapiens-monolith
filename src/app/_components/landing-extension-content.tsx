import { Button } from "@/components/ui/button";

const LandingExtension = () => {
  return (
    <section
      id="extension"
      className="container space-y-6 bg-slate-50 py-32 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-4xl">
          Coming Soon: The "Extension for Explorers"
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Enhance your GitHub journey with our AI-powered extension. Ask,
          explore, and understand code effortlessly. Stay tuned for a
          groundbreaking coding experience!
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#try"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            👆 Give it a try!
          </a>
        </div>
      </div>
    </section>
  );
};

export default LandingExtension;
