---
name: ibancar-ticket
description: >
  Auditoría de ticket de Ibancar: lee todo lo hablado en el ticket de Jira
  (TI-XXXX) asociado a la rama o PR (objetivos, propuestas, decisiones en
  comentarios, enlaces) y valida si el desarrollo cumple lo acordado. Señala
  al dev cada inconsistencia y, para lo que el desarrollo hace de más, le pide
  que lo justifique y, si hace falta, que deje evidencia en el ticket. Si no
  hay ticket asociado lo dice claramente y para. No cambia código ni escribe
  en Jira por su cuenta. Úsala para /ibancar-ticket, "auditar", "¿cumple lo
  del ticket?".
---

Audita el desarrollo de la rama actual contra todo lo hablado en su ticket de
Jira, como quien tiene que aprobarlo sabiendo qué se acordó con negocio.
Responde en español y dirígete al dev directamente. No cambies código.

## 1. Encuentra el ticket

Busca claves de Jira (`[A-Z][A-Z0-9]+-\d+`, normalmente `TI-XXXX`) en este orden:

1. El nombre de la rama: `git rev-parse --abbrev-ref HEAD`.
2. La PR abierta de la rama: `gh api "repos/{owner}/{repo}/pulls?head={owner}:{rama}&state=open"`
   (título y cuerpo).
3. Los commits de la rama: `git log --format=%s%n%b origin/develop..HEAD`
   (si `origin/develop` no está, `origin/release-(WIP)`).

Si no encuentras ninguna, empieza con esta línea exacta y para:

> **⚠ SIN TICKET ASOCIADO.** Ni la rama `<rama>`, ni la PR, ni los commits
> nombran un ticket de Jira. Sin ticket no se puede validar que el desarrollo
> cumpla lo acordado. Renombra la rama (`feat/TI-XXXX-...`) o pon la clave en
> el título de la PR.

Varias claves: dilo y audita cada una.

## 2. Lee todo lo hablado en el ticket

Con las herramientas de Atlassian (`getJiraIssue`, `listJiraIssueComments`,
`getConfluenceContent` para páginas enlazadas) lee entero:

- resumen, tipo, estado, descripción y criterios de aceptación;
- **todos** los comentarios, en orden: ahí se cambian objetivos, se aceptan o
  descartan propuestas y se toman decisiones;
- subtareas, incidencias enlazadas y páginas de Confluence enlazadas.

Saca de ahí tres listas, cada punto con su origen (descripción, comentario de
quién y cuándo, enlace):

- **Objetivos**: qué tiene que conseguir el desarrollo.
- **Propuestas y decisiones**: cómo se acordó hacerlo, incluidas las
  descartadas. Si un comentario posterior cambia algo anterior, manda el
  posterior: dilo.
- **Restricciones**: lo que no se debe tocar o romper.

Si el ticket no existe o no tienes acceso, dilo con la clave y para. Si es
vago o se contradice, dilo: también es un hallazgo. No inventes requisitos.

## 3. Lee el desarrollo

- Todo el diff de la PR: `git diff origin/develop...HEAD`, o
  `gh api repos/{owner}/{repo}/pulls/{n}/files`.
- El código alrededor de cada cambio: llamadores y tests. En el CRM, las
  diferencias entre productos (3, 13, 14, 40, 50, 60) y España/México, y CRM
  frente a API-Ibancar.

## 4. Valida

Para cada objetivo y cada decisión acordada:

- **Cumple**: evidencia `fichero:línea`.
- **Parcial**: qué falta.
- **Inconsistente**: el código hace otra cosa, o sigue una propuesta que se
  descartó. Explica la diferencia en una frase.
- **No verificable**: por qué (datos, configuración, otro repo).

Después, **lo que hay de más**: cambios del diff que ni los objetivos ni las
decisiones piden. Para cada uno, nombra el cambio con `fichero:línea`.

## 5. Informe para el dev

```
Ticket: TI-XXXX — <resumen> (<estado>) <url>
Rama: <rama> · Base: <base> · PR: <url o "sin PR">

Lo acordado
1. <objetivo o decisión> (origen: <descripción | comentario de X, fecha>) — Cumple | Parcial | Inconsistente | No verificable
   <evidencia o diferencia>

Inconsistencias a corregir
- <punto>: <qué hace el código> frente a <qué se acordó>. Corrígelo o actualiza el ticket si el acuerdo cambió.

Fuera de lo acordado: justifícalo
- <cambio>, <fichero:línea>. ¿Por qué entra en esta PR?
  Si es necesario, deja evidencia en el ticket: un comentario en TI-XXXX que
  explique el motivo y quién lo aprobó.

Veredicto: Cumple lo acordado. | Corregir: 2, 4. | Justificar: 3 cambios de más. | Sin ticket: no auditable.
No comprobado: <una línea, si algo importante quedó sin mirar>
```

Si el dev te pide que escribas la justificación en Jira, redacta el comentario
y enséñaselo antes. Publícalo con `addOrEditJiraIssueComment` solo cuando lo
confirme.
