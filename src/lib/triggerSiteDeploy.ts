/**
 * Fires a GitHub Actions `workflow_dispatch` to rebuild + redeploy the static
 * frontend (web/) whenever CMS content changes. Runs inside the CMS container,
 * which is already awake while the admin is being used, so it costs nothing
 * extra. Configure via GH_DEPLOY_TOKEN and GH_REPO env vars.
 */
export async function triggerSiteDeploy(): Promise<void> {
  const token = process.env.GH_DEPLOY_TOKEN
  const repo = process.env.GH_REPO

  if (!token || !repo) {
    console.warn('[deploy-trigger] GH_DEPLOY_TOKEN / GH_REPO not set, skipping site rebuild trigger.')
    return
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/web-deploy.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ ref: 'main' }),
      },
    )

    if (!res.ok) {
      console.error(`[deploy-trigger] GitHub dispatch failed (${res.status}):`, await res.text())
    }
  } catch (err) {
    console.error('[deploy-trigger] Failed to trigger site rebuild:', err)
  }
}