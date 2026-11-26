// Ibancar's own rules for the band: the Jira ticket a branch names, and the git flow it must follow.

export const JIRA_URL = 'https://ibancar.atlassian.net'

// Feature work starts from release-(WIP) and goes to develop as a draft PR; nobody commits on these.
export const PROTECTED = ['develop', 'master', 'main', 'release-(WIP)']

// The first Jira key in a branch name, upper-cased: feat/ti-4658-acuerdos -> TI-4658.
export function ticketFrom(branch: string): string | undefined {
  return /(?:^|[^A-Za-z0-9])([A-Za-z][A-Za-z0-9]+-\d+)(?![0-9])/.exec(branch)?.[1]?.toUpperCase()
}

export const ticketUrl = (key: string, base = JIRA_URL) => `${base.replace(/\/+$/, '')}/browse/${key}`

// Work on a protected branch, short enough for the band's ticket slot. No branch (detached HEAD, not a repo): nothing to say.
export function flowWarning(branch: string): string | undefined {
  return PROTECTED.includes(branch) ? `en ${branch}` : undefined
}
