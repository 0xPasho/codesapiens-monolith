import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

type Payload = {
  userId: string;
};

function generateRandomString(length = 10) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function insertDefaultOrganization(user: {
  id: string;
  name?: string | null;
}) {
  // If user already has a name, use that as the base slug
  // Otherwise, generate a random string
  let baseSlug = "";
  if (!user.name) {
    baseSlug = generateRandomString();
  } else {
    baseSlug = user.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, "")
      .replace(/\s+/g, "_");
  }

  let suffix = 0;
  let slug = baseSlug;

  while (true) {
    const orgFound = await db.organization.findFirst({
      where: {
        slug,
      },
    });

    if (!orgFound) break; // Exit the loop if slug is unique

    suffix += 1;
    slug = `${baseSlug}_${suffix}`;
  }

  const newOrg = await db.organization.create({
    data: {
      name: user.name ?? "", // If user has no name, use empty string, Important as in some fields it's going to be filled as "You"
      slug,
      isPersonal: true,
    },
  });

  await db.organizationMember.create({
    data: {
      role: "owner",
      organizationId: newOrg.id,
      userId: user.id,
      status: "active",
    },
  });

  await db.user.update({
    data: {
      organizationId: newOrg.id,
    },
    where: {
      id: user.id,
    },
  });

  return { organizationId: newOrg.id };
}

export async function POST(req: NextRequest, res: NextResponse) {
  const data: Payload = await req.json();
  const userId = data?.userId;

  if (!userId) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      defaultOrganization: true,
    },
  });

  if (!user) {
    return new Response(null, {
      status: 404,
      statusText: "User not found",
    });
  }

  if (!user?.organizationId) {
    try {
      const { organizationId } = await insertDefaultOrganization(user);

      return NextResponse.json({
        organizationId,
      });
    } catch (error) {
      return new Response(null, {
        status: 500,
        statusText: "Internal Server Error",
      });
    }
  }

  return NextResponse.json({
    organizationId: user.organizationId,
  });
}
