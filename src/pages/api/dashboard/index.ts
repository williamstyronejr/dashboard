import { Media } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/db";

type Data = {
  mostRecentFiles: Array<Media>;
  mediaCount: Array<any>;
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

    res.status(200).json({ mostRecentFiles, mediaCount });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
