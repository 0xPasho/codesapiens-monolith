export type LandingPageRepositoryInfo = {
  title: string;
  description: string;
  image: string;
  github_url: string;
  stars: string;
  repositoryId: string;
};

const tryReposData: LandingPageRepositoryInfo[] = [
  // {
  //   title: "jquense/yup",
  //   description: "Dead simple Object schema validation",
  //   image: "https://avatars.githubusercontent.com/u/339286?s=48&v=4",
  //   github_url: "https://github.com/jquense/yup",
  //   stars: "21700",
  //   repositoryId: "clrgjh18n0018fmng4i96xhnr",
  // },
  {
    title: "airbnb/javascript",
    description: "Style guide for JavaScript coding standards.",
    image: "https://avatars.githubusercontent.com/u/698437?s=48&v=4",
    github_url: "https://github.com/airbnb/javascript",
    stars: "110000",
    repositoryId: "clrgd1f500006fmngs01q7267",
  },
  {
    title: "fastai/nbdev",
    description: "Create delightful software with Jupyter Notebooks",
    image: "https://avatars.githubusercontent.com/u/20547620?s=48&v=4",
    github_url: "https://github.com/fastai/nbdev",
    stars: "4700",
    repositoryId: "clrencveb0009yhcmgw5fi61o",
  },
  {
    title: "D3/D3.js",
    description: "JavaScript library for interactive data visualizations.",
    image: "https://avatars.githubusercontent.com/u/1562726?s=48&v=4",
    github_url: "https://github.com/d3/d3",
    stars: "107000",
    repositoryId: "clrgd00w40002fmngm0fce5g2",
  },
];

export { tryReposData };
