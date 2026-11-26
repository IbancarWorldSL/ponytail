// Ibancar's own rules for the band: the Jira ticket a branch names, and the git flow it must follow.

export const JIRA_URL = 'https://ibancar.atlassian.net'

// Feature work starts from release-(WIP) and goes to develop as a draft PR; nobody commits on these.
export const PROTECTED = ['develop', 'master', 'main', 'release-(WIP)']

// Every `KEY-number` in a branch name, upper-cased, in order: candidates only. Jira says which is a ticket,
// so claude/gracious-goodall-5 (GOODALL-5) or chore/php-8 (PHP-8) never show as one.
export function ticketCandidates(branch: string): string[] {
  const keys: string[] = []
  for (const m of branch.matchAll(/(?:^|[^A-Za-z0-9])([A-Za-z][A-Za-z0-9]+-\d+)(?![0-9])/g)) {
    const key = (m[1] ?? '').toUpperCase()
    if (!keys.includes(key)) keys.push(key)
  }
  return keys
}

// What Jira said about one key: it exists (with its title), it does not, or no answer to go by.
export type Lookup = { state: 'ok'; summary: string } | { state: 'missing' } | { state: 'unknown' }

// Reads a getJiraIssue result from the Atlassian connector: an issue, a 404, or anything else.
export function readLookup(r: { isError: boolean; content: readonly { type: string; text?: string }[] } | undefined): Lookup {
  const text = r?.content.map(c => c.text ?? '').join('') ?? ''
  if (r === undefined) return { state: 'unknown' }
  if (r.isError) return /"statusCode"\s*:\s*404|not found/i.test(text) ? { state: 'missing' } : { state: 'unknown' }
  try {
    const issue = JSON.parse(text)?.issues?.nodes?.[0]
    return issue?.key ? { state: 'ok', summary: String(issue.fields?.summary ?? '') } : { state: 'unknown' }
  } catch {
    return { state: 'unknown' }
  }
}

export const ticketUrl = (key: string, base = JIRA_URL) => `${base.replace(/\/+$/, '')}/browse/${key}`

// Work on a protected branch, short enough for the band's ticket slot. No branch (detached HEAD, not a repo): nothing to say.
export function flowWarning(branch: string): string | undefined {
  return PROTECTED.includes(branch) ? `en ${branch}` : undefined
}
