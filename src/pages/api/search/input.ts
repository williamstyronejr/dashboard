import { prisma } from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Media, Collection, CollectionMedia, Tag } from "@prisma/client";

type ResponseData = {
  collections: Array<
    Collection & {
      CollectionMedia: (CollectionMedia & { media: Media })[];
    }
  >;
  tags: Array<Tag>;
  medias: Media[];
};

type InputError = {
  message?: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | InputError>
) {
  const {
    query: { type, q },
    method,
  } = req;

  if (method !== "GET") return res.status(401);

  try {
    const collections = await prisma.collection.findMany({
      where: {
        title: {
          contains: q?.toString(),
        },
        type: type ? type.toString() : undefined,
      },
      take: 3,
      include: {
        entity: {
          include: {
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

    const medias = await prisma.media.findMany({
      where: {
        title: {
          contains: q?.toString(),
        },
      },
      take: 3,
    });

    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: q?.toString(),
        },
      },
      take: 8,
    });

    res.json({
      collections: JSON.parse(JSON.stringify(collections)),
      tags: JSON.parse(JSON.stringify(tags)),
      medias: JSON.parse(JSON.stringify(medias)),
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Server error occurred, please try again." });
  }
}
