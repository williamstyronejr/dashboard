import { prisma } from "../../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Media } from "@prisma/client";

type ResponseData = {
  nextPage: number | null;
  results: Array<Media & { Photo: Media | null }>;
};

type AddMediaData = {
  id: string;
  addCount: number;
};

type InputError = {
  message?: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | AddMediaData | InputError>
) {
  const {
    query: { page, limit, id },
    body: { mediaIds },
    method,
  } = req;
  if (id === undefined) return res.status(404).end();

  switch (method) {
    case "GET": {
      try {
        if (!page || !limit) {
          return res
            .status(400)
            .send({ message: "Bad inputs: page and limit are required" });
        }

        const numPage = parseInt(page.toString());
        const take = parseInt(limit.toString()) || 10;
        const skip = numPage * take;

        if (Number.isNaN(take) || Number.isNaN(skip)) {
          return res
            .status(400)
            .send({ message: "Page and limit must be numbers" });
        }

        const results = await prisma.media.findMany({
          where: {
            CollectionMedia: {
              every: {
                collectionId: id?.toString(),
              },
            },
          },
          skip,
          take,
          include: {
            Photo: true,
            entity: {
              include: {
                Favorite: true,
              },
            },
          },
        });

        res.json({
          results,
          nextPage: results.length === take ? numPage + 1 : null,
        });
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .send({ message: "Server error occurred, please try again." });
      }
      break;
    }
    case "POST": {
      const latest = await prisma.collectionMedia.findFirst({
        where: { collectionId: id?.toString() },
        orderBy: [
          {
            order: "desc",
          },
        ],
        select: {
          order: true,
        },
      });

      const lastCount = latest ? latest.order + 1 : 0;
      const results = await prisma.collectionMedia.createMany({
        data: mediaIds.split(",").map((mediaId: string, index: number) => ({
          collectionId: id?.toString(),
          mediaId: mediaId,
          order: lastCount + index,
        })),
      });

      res.status(200).json({ id: id?.toString(), addCount: results.count });
      break;
    }
    default:
      res.status(401);
  }
}
