import { Collection } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../utils/db";

type Data = {
  collection: Collection;
};

type InputError = {
  title?: string;
};
export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data | InputError>
) {
  const {
    method,
    body: { title },
    query: { id },
  } = req;
  if (method !== "POST" || !id) return res.status(404).end();

  try {
    const updatedCollection = await prisma.collection.update({
      where: {
        id: id.toString(),
      },
      data: {
        title: title.toString(),
      },
    });

    return res.status(200).json({ collection: updatedCollection });
  } catch (err: any) {
    if (err.code && err.code === "P2002")
      return res.status(400).json({ title: "Title is already in use" });
    return res.status(500).end();
  }
}
