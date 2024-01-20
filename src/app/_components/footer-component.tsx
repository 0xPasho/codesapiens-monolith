import { siteConfig } from "~/config/site";
import { env } from "~/env.mjs";

const FooterComponent = () => {
  return (
    <footer className="m-4 mt-24 rounded-2xl  bg-black/100 shadow">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href={env.NEXT_PUBLIC_APP_URL}
            className="mb-4 flex items-center space-x-3 rtl:space-x-reverse sm:mb-0"
          >
            <img src="/logo.png" className="h-8" />

            <span className="font-bold text-white">{siteConfig.name}</span>
          </a>
          <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0">
            <li>
              <a
                href="https://olyvia.io"
                className="me-4 hover:underline md:me-6"
              >
                About creators
              </a>
            </li>
            <li>
              <a
                href={"https://olyvia.io/privacy"}
                className="me-4 hover:underline md:me-6"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href={"https://olyvia.io/terms"}
                className="me-4 hover:underline md:me-6"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href={"https://twitter.com/codesapiens.ai"}
                className="hover:underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2024{" "}
          <a href={env.NEXT_PUBLIC_APP_URL} className="hover:underline">
            {siteConfig.name}™
          </a>
          . All Rights Reserved.{"  "}. Soporte en{" "}
          <a className="hover:underline" href="emailto:support@codesapiens.ai">
            support@codesapiens.ai
          </a>
        </span>
      </div>
    </footer>
  );
};

export default FooterComponent;
