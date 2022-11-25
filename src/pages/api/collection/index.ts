import { prisma } from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Collection, CollectionMedia, Media } from "@prisma/client";

type Data = {
  nextPage: number | null;
  results: Array<
    Collection & {
      CollectionMedia: (CollectionMedia & { media: Media })[];
    }
  >;
};

type CreateData = {
  id: string;
};

type InputError = {
  message: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data | CreateData | InputError>
) {
  const {
    query: { page, limit },
    body: { title, mediaIds },
    method,
  } = req;

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

        const results = await prisma.collection.findMany({
          take,
          skip,
          include: {
            entity: {
              include: {
                Favorite: true,
                EntityTag: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
            CollectionMedia: {
              where: {
                order: 0,
              },
              include: {
                media: true,
              },
            },
          },
        });

        res.status(200).json({
          results,
          nextPage: results.length === take ? numPage + 1 : null,
        });
      } catch (err) {
        console.log(err);
        res.status(500).end();
      }
    }
    case "POST": {
      try {
        const collection = await prisma.collection.create({
          data: {
            entity: {
              create: {},
            },
            title,
            type: "other",
            CollectionMedia: {
              createMany: {
                data: mediaIds
                  .split(",")
                  .map((mediaId: string, index: number) => ({
                    order: index,
                    mediaId,
                  })),
              },
            },
          },
        });

        return res.status(200).json({ id: collection.id });
      } catch (err) {
        console.log(err);
        return res.status(500).end();
      }
    }
    default:
      return res.status(401);
  }
}
