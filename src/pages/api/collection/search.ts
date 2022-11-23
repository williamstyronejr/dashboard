import { Collection } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/db";

type Data = {
  results: Array<Collection>;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    method,
    query: { title },
  } = req;

  if (method !== "GET") return res.status(404).end();

  try {
    const collections = await prisma.collection.findMany({
      where: {
        title: {
          contains: title?.toString(),
          mode: "insensitive",
        },
      },
    });

    return res.status(200).send({ results: collections });
  } catch (err) {
    return res.status(500).end();
  }
}
