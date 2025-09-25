import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { Build } from "../../lib/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db();
  const buildsCollection = db.collection<Build>("builds");

  if (req.method === "GET") {
    try {
      const builds = await buildsCollection.find({}).toArray();
      res.status(200).json(builds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builds" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
