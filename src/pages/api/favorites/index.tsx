import { prisma } from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  nextPage: number | null;
  results: Array<any>;
};

type PostData = {
  success: boolean;
};

type InputError = {
  message: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data | PostData | InputError>
) {
  const {
    query: { page, limit },
    body: { entityId, deleting },
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

        const favorite = await prisma.favorite.findMany({
          take,
          skip,
          include: {
            entity: {
              include: {
                EntityTag: {
                  include: {
                    tag: true,
                  },
                },
                Media: true,
                Collection: {
                  include: {
                    CollectionMedia: {
                      where: {
                        order: 0,
                      },
                      include: {
                        media: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        // Reorganize favorites to pull data out of entity
        const results = favorite.map((item) => {
          return item.entity.Collection
            ? {
                ...item.entity.Collection,
                entity: {
                  id: item.entity.id,
                  EntityTag: item.entity.EntityTag,
                  Favorite: {
                    createdAt: item.createdAt,
                  },
                },
              }
            : {
                ...item.entity.Media,
                entity: {
                  id: item.entity.id,
                  EntityTag: item.entity.EntityTag,
                  Favorite: {
                    createdAt: item.createdAt,
                  },
                },
              };
        });

        res.status(200).json({
          results,
          nextPage: results.length === take ? numPage + 1 : null,
        });
        break;
      } catch (err) {
        res.status(500).end();
      }
    }
    case "POST": {
      if (!entityId)
        return res
          .status(400)
          .json({ message: "Must provide id of media or collection" });

      if (deleting) {
        const results = await prisma.favorite.delete({
          where: {
            entityId: entityId.toString(),
          },
        });

        return res.status(200).json({ success: true });
      } else {
        const results = await prisma.favorite.create({
          data: {
            entityId: entityId.toString(),
          },
        });

        return res.status(200).json({ success: true });
      }
    }
    default: {
      return res.status(404).end();
    }
  }
}
