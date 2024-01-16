const VideoContent = () => {
  return (
    <section
      id="demo"
      className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-4xl">
          Watch Our Demo
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Get a glimpse into the future of coding with our interactive demo. See
          firsthand how Codesapiens.ai streamlines code management and
          collaboration, directly within your GitHub workflow.
        </p>
        <iframe
          style={{ maxWidth: "100%" }}
          width="1000"
          height="563"
          src="https://www.loom.com/embed/9f3490eb97304f8aacb5caed244aa353?sid=efb36ed0-2c39-49c3-a46c-c398b4a5053d"
          frameborder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
        ></iframe>
      </div>
    </section>
  );
};

export default VideoContent;
