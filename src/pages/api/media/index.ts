import { prisma } from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET" || !id) return res.status(401);

  try {
    const media = await prisma.media.findUnique({
      where: { id: id.toString() },
      include: {
        Photo: true,
      },
    });

    res.json({ media });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Server error occurred, please try again." });
  }
}
