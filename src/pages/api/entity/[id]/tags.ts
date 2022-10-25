import { prisma } from "../../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Media } from "@prisma/client";

type ResponseData = {
  results: Array<Media & { Photo: Media | null }>;
};

type InputError = {
  message?: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | InputError>
) {
  const {
    query: { id },
    body: { tags },
    method,
  } = req;

  if (method !== "POST") return res.status(401);

  try {
    const tagArr = tags.split(",").filter((val: string) => val.trim() !== "");

    const results = await prisma.media.findMany({
      where,
      skip,
      take,
      include: {
        Photo: true,
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
      },
    });

    res.json({
      results,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Server error occurred, please try again." });
  }
}
