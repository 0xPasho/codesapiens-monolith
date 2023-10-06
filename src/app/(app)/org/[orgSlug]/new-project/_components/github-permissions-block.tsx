"use client";

import { GithubConnectButton } from "@/components/general/github/connect-to-github";

const GithubPermissionsBlock = () => {
  return (
    <>
      <div className="flex-row">
        <span className="text-md text-gray-500">Missing Git Repository?</span>
        <GithubConnectButton>
          👉 Adjust Github App Permisions
        </GithubConnectButton>
      </div>
    </>
  );
};

export default GithubPermissionsBlock;
