import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { Repo } from "../../lib/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db();
  const reposCollection = db.collection<Repo>("repos");

  if (req.method === "GET") {
    try {
      const repos = await reposCollection.find({}).toArray();
      res.status(200).json(repos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch repos" });
    }
  } else if (req.method === "POST") {
    const { name, url } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: "Missing name or url" });
    }
    try {
      const newRepo: Repo = {
        name,
        url,
        lastBuildStatus: "unknown",
        lastBuildTime: new Date(),
      };
      const result = await reposCollection.insertOne(newRepo);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to add repo" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
