---
name: ibancar-desglose
description: >
  Desglose operativo de la PR de Ibancar: resume en lenguaje llano, sin
  tecnicismos, qué cambia la rama actual para operaciones, riesgos y negocio,
  lo muestra en el chat y pregunta si se adjunta como comentario en el ticket
  de Jira (TI-XXXX). Úsala para /ibancar-desglose, "desglose de la PR",
  "resume la PR para negocio".
---

Explica a operaciones, riesgos y negocio de Ibancar qué cambia la PR de la
rama actual. Responde en español.

## 1. Delimita la PR

- Rama: `git rev-parse --abbrev-ref HEAD`.
- Ticket: la primera clave `<PROYECTO>-<número>` de la rama, en mayúsculas; es ticket solo si `getJiraIssue` lo encuentra en Jira;
  si no hay, mira el título de la PR abierta
  (`gh api "repos/{owner}/{repo}/pulls?head={owner}:{rama}&state=open"`) y
  los commits.
- Base: `origin/develop`; si no está, `git fetch --depth=200 origin develop`;
  si aún falla, `origin/release-(WIP)` o la rama por defecto del repo. Di cuál
  usas.
- Lee los commits (`git log --format=%s <base>..HEAD`), la lista de ficheros
  (`git diff --stat <base>...HEAD`) y el diff entero. Si `<base>...HEAD`
  falla por clon superficial, trae más historia con un fetch acotado antes de
  seguir; no resumas un diff a medias.

## 2. Escribe el desglose

Lenguaje llano: nada de nombres de ficheros, clases, tablas ni código. Habla
de lo que nota quien usa el CRM o el cliente. No inventes: si el diff no deja
claro el efecto, dilo.

```
## <TI-XXXX o "Sin ticket">: <qué se hace, en una frase>

**Qué cambia para el usuario o la operativa**
- 2 a 5 viñetas

**A quién afecta**
Productos (3, 13, 14, 40, 41, 50, 60), país (España/México), departamentos o procesos.

**Qué vigilar al desplegar**
Riesgos o comprobaciones, o "Nada especial".
```

Máximo 200 palabras. Muéstralo en el chat tal cual.

## 3. Pregunta si se adjunta al ticket

- Con ticket: pregunta con la herramienta AskUserQuestion si se adjunta el
  desglose como comentario en el ticket TI-XXXX (opciones: adjuntar, no
  adjuntar).
  Si dice que sí, publícalo con `addOrEditJiraIssueComment` en ese ticket,
  con el texto exactamente como se mostró, y da el enlace
  `https://ibancar.atlassian.net/browse/TI-XXXX`. Si dice que no, termina.
- Sin ticket: no preguntes. Di que no hay ticket asociado al que adjuntarlo.
