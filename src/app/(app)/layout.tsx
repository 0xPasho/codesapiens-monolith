import { HeaderContent } from "~/app/(app)/_components/header-content";
import { headers } from "next/headers";
import { getServerAuthSession } from "~/server/auth";
import FooterComponent from "../_components/footer-component";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthenticatedLayout({
  children,
}: AuthLayoutProps) {
  const headersList = headers();
  const session = await getServerAuthSession();
  const pathname = headersList.get("x-pathname");
  let orgSlug = "";
  if (pathname?.startsWith("/org/")) {
    orgSlug = pathname.split("/")?.[2] || "";
  }

  return (
    <>
      <HeaderContent orgSlug={orgSlug} session={session} />
      <main className="mx-auto w-full" style={{ minHeight: "70vh" }}>
        {children}
      </main>
    </>
  );
}
