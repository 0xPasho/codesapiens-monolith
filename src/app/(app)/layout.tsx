import { HeaderContent } from "~/app/(app)/_components/header-content";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <HeaderContent />
      <main className="mx-auto w-full">{children}</main>
    </>
  );
}
