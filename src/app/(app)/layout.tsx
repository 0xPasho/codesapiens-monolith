import { HeaderContent } from "~/app/(app)/_components/header-content";
import { headers } from "next/headers";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthLayoutProps) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname");
  let orgSlug = "";
  if (pathname?.startsWith("/org/")) {
    orgSlug = pathname.split("/")?.[2] || "";
  }
  return (
    <>
      <HeaderContent orgSlug={orgSlug} />
      <main className="mx-auto w-full">{children}</main>
    </>
  );
}
