// Ibancar's own rules for the band: the Jira ticket a branch names, the git flow it must follow, and the PR breakdown.

export const JIRA_URL = 'https://ibancar.atlassian.net'

// Feature work starts from release-(WIP) and goes to develop as a draft PR; nobody commits on these.
export const PROTECTED = ['develop', 'master', 'main', 'release-(WIP)']

// Where a PR's changes are measured from, first found wins: PRs go to develop.
export const BASES = ['origin/develop', 'origin/release-(WIP)', 'origin/main', 'origin/master']

// The first Jira key in a branch name, upper-cased: feat/ti-4658-acuerdos -> TI-4658.
export function ticketFrom(branch: string): string | undefined {
  return /(?:^|[^A-Za-z0-9])([A-Za-z][A-Za-z0-9]+-\d+)(?![0-9])/.exec(branch)?.[1]?.toUpperCase()
}

export const ticketUrl = (key: string, base = JIRA_URL) => `${base.replace(/\/+$/, '')}/browse/${key}`

// Work on a protected branch. No branch (detached HEAD, not a repo): nothing to say.
export function flowWarning(branch: string): string | undefined {
  return PROTECTED.includes(branch) ? `estás en ${branch}: crea una rama desde release-(WIP)` : undefined
}

// shortcut: the diff is cut at this many characters, so a huge PR is summed up from its start and its file list; split the call per file if that falls short.
export const DIFF_LIMIT = 60_000

export const BREAKDOWN_SYSTEM =
  'Eres quien explica a operaciones, riesgos y negocio de Ibancar (préstamos con garantía de vehículo, España y México) ' +
  'qué cambia una PR del CRM. Escribe en español, en lenguaje llano, sin nombres de ficheros, clases ni código. ' +
  'No inventes: si el diff no deja claro el efecto, dilo.'

// The prompt that turns a PR's commits, file list and diff into an operational summary.
export function breakdownPrompt(p: { branch: string; ticket?: string; base: string; log: string; stat: string; diff: string }): string {
  const cut = p.diff.length > DIFF_LIMIT
  return [
    `Rama: ${p.branch}. Ticket: ${p.ticket ?? 'ninguno'}. Cambios respecto a ${p.base}.`,
    '',
    'Escribe un desglose operativo de esta PR, en Markdown, con estos apartados:',
    `## ${p.ticket ?? 'Sin ticket'}: <qué se hace, en una frase>`,
    '**Qué cambia para el usuario o la operativa**: 2-5 viñetas, en lo que nota quien usa el CRM o el cliente.',
    '**A quién afecta**: productos (3, 13, 14, 40, 50, 60), país (España/México), departamentos o procesos.',
    '**Qué vigilar al desplegar**: riesgos o comprobaciones, o "Nada especial".',
    'Máximo 200 palabras. Sin tecnicismos.',
    '',
    '<commits>',
    p.log.trim(),
    '</commits>',
    '<ficheros>',
    p.stat.trim(),
    '</ficheros>',
    `<diff${cut ? ' recortado="sí"' : ''}>`,
    cut ? p.diff.slice(0, DIFF_LIMIT) : p.diff,
    '</diff>',
  ].join('\n')
}
