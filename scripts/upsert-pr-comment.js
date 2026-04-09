#!/usr/bin/env node

const args = process.argv.slice(2);

function readArg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const prNumber = process.env.PR_NUMBER;
const header = readArg('--header');
const message = readArg('--message');

if (!repo || !token || !prNumber || !header || !message) {
  console.error(
    'Usage: GH_TOKEN=... GITHUB_REPOSITORY=owner/repo PR_NUMBER=123 node scripts/upsert-pr-comment.js --header "name" --message "body"'
  );
  process.exit(1);
}

const marker = `<!-- sticky:${header} -->`;
const body = `${marker}\n${message}`;

async function github(path, init = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`GitHub API ${response.status}: ${text}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

async function main() {
  const comments = await github(`/repos/${repo}/issues/${prNumber}/comments?per_page=100`);
  const existing = comments.find((comment) => typeof comment.body === 'string' && comment.body.includes(marker));

  if (existing) {
    await github(`/repos/${repo}/issues/comments/${existing.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body }),
    });
    console.log(`Updated PR comment ${existing.id}`);
    return;
  }

  const created = await github(`/repos/${repo}/issues/${prNumber}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });
  console.log(`Created PR comment ${created.id}`);
}

main().catch((error) => {
  if (error.status === 403 || error.status === 404) {
    console.warn(`${error.message}. Skipping PR comment update.`);
    process.exit(0);
  }
  console.error(error.message);
  process.exit(1);
});
