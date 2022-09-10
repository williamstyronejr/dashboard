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
  if (!entityId)
    return res.status(400).json({ entityId: "Must provide entity id" });

  try {
    const media = await prisma.media.findUnique({
      where: {
        entityId,
      },
    });

    const collection = await prisma.media.findUnique({
      where: {
        entityId,
      },
    });

    if (!collection && !media) {
      return res.status(400).json({ entityId: "Entity does not exist" });
    }

    await new Promise<void>((res) =>
      setTimeout(() => {
        res();
      }, 5000)
    );

    await prisma.activity.create({
      data: {
        actionType: "delete",
        actionItem: media ? media.title : collection?.title || "",
        actionId: media ? media.id : collection?.id || "",
        actionItemType: media ? "media" : "collection",
      },
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
}
