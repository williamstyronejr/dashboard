import { Activity, Media, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/db";

type Data = {
  mostRecentFiles: Array<Media>;
  mediaCount: Array<any>;
  latestActivity: Array<Activity>;
  groupStats: Record<string, { size: number; count: number }>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  if (method !== "GET") return res.status(404).end();

  try {
    const mostRecentFiles = await prisma.media.findMany({
      take: 10,
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });

    const mediaCount = await prisma.media.groupBy({
      by: ["type"],
      _count: {
        type: true,
      },
    });

    const latestActivity = await prisma.activity.findMany({
      take: 10,
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });

    const stats = await prisma.media.groupBy({
      by: ["type"],
      _count: true,
      _sum: {
        size: true,
      },
    });

    const groupStats: Record<string, { size: number; count: number }> = {
      video: {
        size: 0,
        count: 0,
      },
      image: {
        size: 0,
        count: 0,
      },
      audio: {
        size: 0,
        count: 0,
      },
    };

    stats.forEach((typeStats) => {
      groupStats[typeStats.type] = {
        size: typeStats._sum.size || 0,
        count: typeStats._count,
      };
    });

    res
      .status(200)
      .json({ mostRecentFiles, mediaCount, latestActivity, groupStats });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
