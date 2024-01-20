import { VideoIcon } from "@radix-ui/react-icons";

const HeroContent = () => {
  return (
    <div className="bg-transparent">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[white] to-primary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
        <div className="sm:py-34 lg:py-42 mx-auto max-w-2xl py-32">
          <a
            href="#demo"
            className="mb-2 flex cursor-pointer justify-center sm:mb-8"
          >
            <div className="relative flex flex-row rounded-full px-3 py-1 text-sm leading-6  ring-1 ring-white ">
              <span
                aria-hidden="true"
                className="align-center flex items-center justify-center"
              >
                <VideoIcon className="mr-2" />
              </span>
              <span>Watch our Demo</span>
            </div>
          </a>
          <div className="text-center">
            <div className="my-4 text-center">
              <h1 className="text-5xl font-bold tracking-tight">
                We understand your code.
              </h1>
              <h1 className="my-2 text-5xl font-bold tracking-tight">
                We document it.
              </h1>
              <h1 className="text-5xl font-bold tracking-tight">
                <span className="text-blue-500">You</span> ask questions.
              </h1>
            </div>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Manual documentation is a buzzkill. We cover it so you can chase
              the big ideas.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#try"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                👇 Try it now!
              </a>
              <a
                href="#extension"
                className=" flex items-center justify-center text-sm font-semibold leading-6"
              >
                <div className="relative flex-col rounded-sm px-2 py-2 text-xs ring-1 ring-white ">
                  <p>CodeSapiens Extension.</p>
                  <a href="#extension" className="font-semibold text-primary">
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    More info <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[gray] to-primary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
