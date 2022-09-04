import { Media } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/db";

type Data = {
  mostRecentFiles: Array<Media>;
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

    res.status(200).json({ mostRecentFiles });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
