// Ibancar's own rules for the band: the Jira ticket a branch names and the git flow it must follow.

export const JIRA_URL = 'https://ibancar.atlassian.net'

// Feature work starts from release-(WIP) and goes to develop as a draft PR; nobody commits on these.
export const PROTECTED = ['develop', 'master', 'main', 'release-(WIP)']

// The first Jira key in a branch name, upper-cased: feat/ti-4658-acuerdos -> TI-4658.
export function ticketFrom(branch: string): string | undefined {
  return /(?:^|[^A-Za-z0-9])([A-Za-z][A-Za-z0-9]+-\d+)(?![0-9])/.exec(branch)?.[1]?.toUpperCase()
}

export const ticketUrl = (key: string, base = JIRA_URL) => `${base.replace(/\/+$/, '')}/browse/${key}`

// What the band warns about for a branch: a protected branch, or work without a ticket.
// No branch (detached HEAD, not a repo): nothing to say.
export function flowWarning(branch: string): string | undefined {
  if (branch === '' || branch === 'HEAD') return undefined
  if (PROTECTED.includes(branch)) return `estás en ${branch}: crea una rama desde release-(WIP)`
  if (ticketFrom(branch) === undefined) return 'rama sin ticket TI-XXXX'
  return undefined
}
