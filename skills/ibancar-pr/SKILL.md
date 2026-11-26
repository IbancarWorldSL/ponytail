---
name: ibancar-pr
description: >
  Abre la PR de la rama actual siguiendo el flujo de Ibancar: rama de feature
  sacada de release-(WIP), PR en draft contra develop, ticket de Jira
  (TI-XXXX) en el título y plantilla de PR del repo rellenada. Úsala para
  /ibancar-pr, "abre la PR", "PR draft".
---

Abre la PR de la rama actual según el flujo del equipo. Responde en español.
Para y pregunta ante cualquier duda: una PR es visible para todo el equipo.

## 1. Comprueba la rama

- Rama actual: `git rev-parse --abbrev-ref HEAD`.
- Si es `develop`, `master`, `main` o `release-(WIP)`, para: el trabajo va en
  una rama propia sacada de `release-(WIP)`.
- Ticket: la primera clave `<PROYECTO>-<número>` del nombre de la rama (en
  mayúsculas), de los proyectos `TI`, `IT`, `SI`, `BS`, `MI`, `MARK`, `MP9` o `SCRUMBAN`; cualquier otra combinación no es un ticket. Si no hay, pregunta al usuario por el ticket. Si dice que no
  hay ninguno, avisa de que la PR irá sin ticket y continúa solo si lo confirma.
- Origen: la rama debe salir de `release-(WIP)`, no de `develop`.
  Trae las dos ramas (`git fetch --depth=200 origin develop "release-(WIP)"`
  si el clon es superficial) y lista los commits de develop que
  release-(WIP) no tiene: `git log --format=%H "origin/release-(WIP)"..origin/develop`.
  Si alguno está en la rama (`git merge-base --is-ancestor <commit> HEAD`),
  avisa de que la rama no salió de `release-(WIP)` y para. No lo arregles
  sin permiso.

## 2. Prepara

- Cambios sin commitear: enséñalos y pregunta si se incluyen. No hagas commit
  sin permiso.
- Empuja la rama: `git push -u origin <rama>`.
- Si ya hay una PR abierta para la rama
  (`gh api "repos/{owner}/{repo}/pulls?head={owner}:{rama}&state=open"`), da su
  enlace y para.

## 3. Abre la PR

- Plantilla: busca `.github/pull_request_template.md` (o
  `.github/PULL_REQUEST_TEMPLATE/`, `docs/pull_request_template.md`). Rellena
  sus apartados con lo que hace el diff `origin/develop...HEAD`. Deja vacíos
  los que pidan datos que no tienes; nunca pongas credenciales ni hosts internos.
- Título: `TI-XXXX <descripción breve en español>`, como los commits del repo.
- Cuerpo: la plantilla rellena y el enlace al ticket
  (`https://ibancar.atlassian.net/browse/TI-XXXX`).
- Crea la PR en draft contra develop:
  `gh api repos/{owner}/{repo}/pulls -f title=... -f head=<rama> -f base=develop -F draft=true -f body=...`

## 4. Termina

Da el enlace de la PR y, en una línea, lo que no has comprobado (por ejemplo,
que los tests no se han ejecutado).
