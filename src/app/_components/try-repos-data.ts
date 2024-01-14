export type LandingPageRepositoryInfo = {
  title: string;
  description: string;
  image: string;
  github_url: string;
  stars: string;
  projectSlug: string;
};

const tryReposData: LandingPageRepositoryInfo[] = [
  {
    title: "Twitter Algorithm Repository",
    description: "Insights into the algorithms used by Twitter.",
    image: "placeholder_image_link",
    github_url: "https://github.com/twitter/algorithms",
    stars: "10000",
    projectSlug: "",
  },
  {
    title: "Google's TensorFlow Models",
    description: "A variety of models implemented in TensorFlow.",
    image: "placeholder_image_link",
    github_url: "https://github.com/tensorflow/models",
    stars: "15000",
  },
  {
    title: "Microsoft's Visual Studio Code",
    description: "Open-source code editor with a large user base.",
    image: "placeholder_image_link",
    github_url: "https://github.com/microsoft/vscode",
    stars: "120000",
  },
  {
    title: "Facebook's React Native",
    description: "Framework for building native apps using React.",
    image: "placeholder_image_link",
    github_url: "https://github.com/facebook/react-native",
    stars: "95000",
  },
  {
    title: "OpenAI's GPT Repositories",
    description: "Resources related to Generative Pre-trained Transformers.",
    image: "placeholder_image_link",
    github_url: "https://github.com/openai/gpt",
    stars: "5000",
  },
  {
    title: "Apple's Swift Programming Language",
    description: "Popular for iOS development.",
    image: "placeholder_image_link",
    github_url: "https://github.com/apple/swift",
    stars: "57000",
  },
  {
    title: "Elasticsearch",
    description: "Search engine based on the Lucene library.",
    image: "placeholder_image_link",
    github_url: "https://github.com/elastic/elasticsearch",
    stars: "55000",
  },
  {
    title: "Kubernetes",
    description:
      "System for automating deployment, scaling, and management of containerized applications.",
    image: "placeholder_image_link",
    github_url: "https://github.com/kubernetes/kubernetes",
    stars: "77000",
  },
  {
    title: "D3.js",
    description: "JavaScript library for interactive data visualizations.",
    image: "placeholder_image_link",
    github_url: "https://github.com/d3/d3",
    stars: "97000",
  },
  {
    title: "Apache Kafka",
    description: "Distributed streaming platform.",
    image: "placeholder_image_link",
    github_url: "https://github.com/apache/kafka",
    stars: "20000",
  },
  {
    title: "Ansible by Red Hat",
    description:
      "Tool for software provisioning, configuration management, and application deployment.",
    image: "placeholder_image_link",
    github_url: "https://github.com/ansible/ansible",
    stars: "50000",
  },
  {
    title: "The Go Programming Language",
    description: "Efficient and simple programming language created by Google.",
    image: "placeholder_image_link",
    github_url: "https://github.com/golang/go",
    stars: "90000",
  },
  {
    title: "Flutter",
    description: "UI toolkit for natively compiled applications.",
    image: "placeholder_image_link",
    github_url: "https://github.com/flutter/flutter",
    stars: "130000",
  },
  {
    title: "FreeCodeCamp",
    description: "Code from the learning platform for web development.",
    image: "placeholder_image_link",
    github_url: "https://github.com/freeCodeCamp/freeCodeCamp",
    stars: "320000",
  },
  {
    title: "Airbnb's JavaScript Style Guide",
    description: "Style guide for JavaScript coding standards.",
    image: "placeholder_image_link",
    github_url: "https://github.com/airbnb/javascript",
    stars: "110000",
  },
  {
    title: "Vue.js",
    description: "Progressive JavaScript framework for building UIs.",
    image: "placeholder_image_link",
    github_url: "https://github.com/vuejs/vue",
    stars: "190000",
  },
];

export default tryReposData;
