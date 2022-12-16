import { prisma } from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Media, Collection, CollectionMedia } from "@prisma/client";

type ResponseData = {
  nextPage: number | null;
  results: Array<
    Collection & {
      CollectionMedia: (CollectionMedia & { media: Media })[];
    }
  >;
};

type InputError = {
  message?: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | InputError>
) {
  const {
    query: { page, limit, type, tags, q },
    method,
  } = req;

  if (method !== "GET") return res.status(401);

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
      where: {
        title: {
          contains: q?.toString(),
        },
        type: type ? type.toString() : undefined,
      },
      skip,
      take,
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

    res.json({
      results: JSON.parse(JSON.stringify(results)),
      nextPage: results.length === take ? numPage + 1 : null,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Server error occurred, please try again." });
  }
}
