import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { Build, Repo } from "../../lib/models";
import crypto from "crypto";

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";

function verifySignature(req: NextApiRequest) {
  const signature = req.headers["x-hub-signature-256"] as string;
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET);
  hmac.update(payload);
  const digest = "sha256=" + hmac.digest("hex");
  return signature === digest;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!verifySignature(req)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const client = await clientPromise;
  const db = client.db();
  const buildsCollection = db.collection<Build>("builds");
  const reposCollection = db.collection<Repo>("repos");

  try {
    const { repository, workflow_run } = req.body;
    if (!repository || !workflow_run) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    // Find repo by name
    let repo = await reposCollection.findOne({ name: repository.name });
    if (!repo) {
      // Create repo if not exists
      const newRepo: Repo = {
        name: repository.name,
        url: repository.html_url,
        lastBuildStatus: workflow_run.conclusion,
        lastBuildTime: new Date(workflow_run.updated_at),
      };
      const insertResult = await reposCollection.insertOne(newRepo);
      // Fetch the newly inserted repo to get _id
      repo = await reposCollection.findOne({ _id: insertResult.insertedId });
    } else {
      // Update repo status/time
      await reposCollection.updateOne(
        { _id: repo._id },
        {
          $set: {
            lastBuildStatus: workflow_run.conclusion,
            lastBuildTime: new Date(workflow_run.updated_at),
          },
        }
      );
    }
    // Save build log
    if (repo) {
      const build: Build = {
        repoId: repo._id,
        status: workflow_run.conclusion === "success" ? "success" : "failed",
        commitHash: workflow_run.head_commit.id,
        duration: workflow_run.run_duration_ms,
        timestamp: new Date(workflow_run.updated_at),
      };
      await buildsCollection.insertOne(build);
    }
    res.status(200).json({ message: "Webhook processed" });
  } catch {
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
