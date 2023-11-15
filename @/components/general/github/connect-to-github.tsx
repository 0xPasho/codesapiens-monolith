"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { env } from "~/env.mjs";

const GithubConnectButton = ({
  children,
  onPopoverClose,
  onlyChildren,
}: {
  onlyChildren?: boolean;
  children: React.ReactNode;
  onPopoverClose?: () => void;
}) => {
  const [isGithubAppLoading, setIsGithubAppLoading] = useState(false);
  const checkPoupRef = useRef<NodeJS.Timeout>();

  const handlePopupClosed = () => {
    setIsGithubAppLoading(false);
    onPopoverClose?.();
    window.location.reload();
  };

  const handlePopupClosedChecks = (popup: any) => {
    if (popup.closed) {
      handlePopupClosed();
    } else {
      checkPoupRef.current = setTimeout(
        () => handlePopupClosedChecks(popup),
        1000,
      );
    }
  };

  const openGithubAppInstall = () => {
    setIsGithubAppLoading(true);
    const url = `https://github.com/apps/${env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`;
    const name = "Install GitHub App";
    const specs = "width=800,height=800";
    const _popup = window.open(url, name, specs);
    checkPoupRef.current = setTimeout(
      () => handlePopupClosedChecks(_popup),
      1000,
    );
  };

  if (onlyChildren) {
    return <div onClick={openGithubAppInstall}>{children}</div>;
  }
  return (
    <Button
      variant="link"
      isLoading={isGithubAppLoading}
      onClick={openGithubAppInstall}
      className="text-md"
    >
      {children}
    </Button>
  );
};

export { GithubConnectButton };
