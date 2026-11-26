// Ibancar's own rules for the band: the Jira ticket a branch names, and the git flow it must follow.

export const JIRA_URL = 'https://ibancar.atlassian.net'

// Feature work starts from release-(WIP) and goes to develop as a draft PR; nobody commits on these.
export const PROTECTED = ['develop', 'master', 'main', 'release-(WIP)']

// The site's Jira project keys: only these name a ticket, so claude/gracious-goodall-5 is not GOODALL-5.
export const JIRA_KEYS = ['TI', 'IT', 'SI', 'BS', 'MI', 'MARK', 'MP9', 'SCRUMBAN']

// The first key of a known project in a branch name, upper-cased: feat/ti-4658-acuerdos -> TI-4658.
export function ticketFrom(branch: string, keys: readonly string[] = JIRA_KEYS): string | undefined {
  const re = /(?:^|[^A-Za-z0-9])([A-Za-z][A-Za-z0-9]+)-(\d+)(?![0-9])/g
  for (const m of branch.matchAll(re)) {
    const key = (m[1] ?? '').toUpperCase()
    if (keys.includes(key)) return `${key}-${m[2]}`
  }
  return undefined
}

export const ticketUrl = (key: string, base = JIRA_URL) => `${base.replace(/\/+$/, '')}/browse/${key}`

// Work on a protected branch, short enough for the band's ticket slot. No branch (detached HEAD, not a repo): nothing to say.
export function flowWarning(branch: string): string | undefined {
  return PROTECTED.includes(branch) ? `en ${branch}` : undefined
}
