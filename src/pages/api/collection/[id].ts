import { prisma } from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Collection, CollectionMedia, Media } from "@prisma/client";

type Data = {
  collection:
    | null
    | (Collection & {
        CollectionMedia: (CollectionMedia & { media: Media })[];
      });
};

type InputError = {
  message: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data | InputError>
) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET" || !id) return res.status(404).end();

  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id: id.toString(),
      },
      include: {
        CollectionMedia: {
          orderBy: [
            {
              order: "asc",
            },
          ],
          include: {
            media: true,
          },
        },
      },
    });

    res.status(200).json({
      collection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
