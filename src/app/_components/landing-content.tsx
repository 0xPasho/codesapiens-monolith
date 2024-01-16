import { UnauthenticatedHeaderContent } from "../(marketing)/_components/unauthenticated-header-content";
import PricingInnerContent from "../(marketing)/pricing/PricingInnerContent";
import HeroContent from "./hero-content";
import TryItComponent from "./try-it-component";
import FooterComponent from "./footer-component";
import PlatformFeatures from "./platform-features";
import LandingExtension from "./landing-extension-content";

export default async function IndexPage() {
  return (
    <>
      <UnauthenticatedHeaderContent />
      <HeroContent />
      <TryItComponent />
      <PlatformFeatures />
      <LandingExtension />
      <section
        className="space-y-6 pb-8 pt-4 md:pb-12 md:pt-12 lg:py-14"
        id="pricing"
      >
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold">Get started with our plans</h1>
          <p>
            Discover the perfect plan tailored for your needs. Unlock powerful
            features and more to elevate your business efficiency.
          </p>
          <PricingInnerContent />
        </div>
      </section>
      <FooterComponent />
    </>
  );
}
