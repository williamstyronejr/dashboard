import { prisma } from "../../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Collection, Entity, EntityTag, Tag } from "@prisma/client";

type Data = {
  collection:
    | null
    | (Collection & {
        entity: Entity & {
          EntityTag: (EntityTag & {
            tag: Tag;
          })[];
        };
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
        entity: {
          include: {
            EntityTag: {
              include: {
                tag: true,
              },
            },
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
