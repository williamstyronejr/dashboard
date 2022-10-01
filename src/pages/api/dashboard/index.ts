import { Activity, Media } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/db";

type Data = {
  mostRecentFiles: Array<Media>;
  mediaCount: Array<any>;
  latestActivity: Array<Activity>;
  groupStats: Record<string, { size: number; count: number }>;
  totalSpace: number;
  usedSpace: number;
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
          createdAt: "desc",
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
          createdAt: "desc",
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

    let usedSpace = 0;
    stats.forEach((typeStats) => {
      usedSpace += typeStats._sum.size || 0;
      groupStats[typeStats.type] = {
        size: typeStats._sum.size || 0,
        count: typeStats._count,
      };
    });

    res.status(200).json({
      mostRecentFiles,
      mediaCount,
      latestActivity,
      groupStats,
      totalSpace: 125829120000, // 120 GB
      usedSpace,
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
