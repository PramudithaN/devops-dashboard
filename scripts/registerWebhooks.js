// scripts/registerWebhooks.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GITHUB_USERNAME = "your-username"; // change this
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // set in .env
const WEBHOOK_URL = "https://your-dashboard-domain.com/api/webhook";
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "your-secret";

async function getRepos() {
  const response = await fetch(
    `https://api.github.com/user/repos?per_page=100`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  return response.json();
}

async function createWebhook(repoName) {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/hooks`;

  const body = {
    name: "web",
    active: true,
    events: ["workflow_run"],
    config: {
      url: WEBHOOK_URL,
      content_type: "json",
      secret: WEBHOOK_SECRET,
      insecure_ssl: "0",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    console.log(`✅ Webhook created for ${repoName}`);
  } else {
    const error = await response.json();
    console.error(`❌ Failed for ${repoName}:`, error.message);
  }
}

(async () => {
  const repos = await getRepos();
  for (const repo of repos) {
    await createWebhook(repo.name);
  }
})();
