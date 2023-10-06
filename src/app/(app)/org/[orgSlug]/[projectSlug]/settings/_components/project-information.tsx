"use client";
import { Project } from "@prisma/client";
import ProjectSlugModifier from "./project-slug-modifier";
import ProjectDescriptionModifier from "./project-description-modifier";

const ProjectInformation = ({
  orgSlug,
  projectSlug,
  projectInfo,
}: {
  orgSlug: string;
  projectSlug: string;
  projectInfo: Project;
}) => {
  return (
    <>
      <ProjectSlugModifier
        orgSlug={orgSlug}
        projectSlug={projectSlug}
        projectInfo={projectInfo}
      />
      <ProjectDescriptionModifier
        projectSlug={projectSlug}
        orgSlug={orgSlug}
        projectInfo={projectInfo}
      />
    </>
  );
};
export default ProjectInformation;
