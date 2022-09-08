import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/db";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    method,
    body: { entityId },
  } = req;

  if (method !== "DELETE") return res.status(404).end();

  try {
    await new Promise<void>((res) =>
      setTimeout(() => {
        res();
      }, 5000)
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).end();
  }
}
