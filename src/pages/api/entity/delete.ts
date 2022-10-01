import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/db";

type Data = {
  success: boolean;
};

type InputError = {
  entityId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | InputError>
) {
  const {
    method,
    body: { entityId },
  } = req;

  if (method !== "DELETE") return res.status(404).end();
  if (!entityId || entityId === "")
    return res.status(400).json({ entityId: "Must provide entity id" });

  try {
    const ids = entityId.split(",");

    const medias = await prisma.media.findMany({
      where: {
        entityId: { in: ids },
      },
    });

    const collections = await prisma.collection.findMany({
      where: {
        entityId: { in: ids },
      },
    });

    if (collections.length === 0 && medias.length === 0) {
      return res.status(400).json({ entityId: "Entity does not exist" });
    }

    await new Promise<void>((res) =>
      setTimeout(() => {
        res();
      }, 5000)
    );

    let activityProms: Array<Promise<any>> = [];

    collections.forEach((collection) => {
      activityProms.push(
        prisma.activity.create({
          data: {
            actionType: "delete",
            actionItem: collection.title,
            actionId: collection.id,
            actionItemType: "collection",
          },
        })
      );
    });

    medias.forEach((media) => {
      activityProms.push(
        prisma.activity.create({
          data: {
            actionType: "delete",
            actionItem: media.title,
            actionId: media.id,
            actionItemType: "media",
          },
        })
      );
    });

    await Promise.all(activityProms);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
}
