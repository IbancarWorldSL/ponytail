---
name: ibancar-ticket
description: >
  Auditoría de ticket de Ibancar: busca el ticket de Jira (TI-XXXX) asociado a
  la rama o PR actual, lee su fuente (descripción, criterios de aceptación,
  comentarios, enlaces) y contrasta punto por punto si el código hace lo que el
  ticket pide. Si no hay ticket asociado lo dice claramente y para. Solo
  informa, no cambia código. Úsala para /ibancar-ticket, "auditar ticket",
  "¿esta PR hace lo que pide el ticket?".
---

Audita la rama o PR actual contra su ticket de Jira, como quien tiene que
aprobarla sabiendo qué pidió negocio. Responde en español. Es un informe que
el usuario ha pedido: dalo completo. No cambies código.

## 1. Encuentra el ticket

Busca claves de Jira (`[A-Z][A-Z0-9]+-\d+`, normalmente `TI-XXXX`) en este orden:

1. El nombre de la rama: `git rev-parse --abbrev-ref HEAD`.
2. La PR abierta de la rama, si existe: `gh api "repos/{owner}/{repo}/pulls?head={owner}:{rama}&state=open"`.
   Mira título y cuerpo.
3. Los mensajes de commit de la rama: `git log --format=%s%n%b origin/develop..HEAD`.
   Si `origin/develop` no está, usa `origin/release-(WIP)`.

Si no encuentras ninguna clave, empieza el informe con esta línea exacta y para:

> **⚠ SIN TICKET ASOCIADO.** Ni la rama `<rama>`, ni la PR, ni los commits
> nombran un ticket de Jira. Sin ticket no se puede verificar que el cambio
> haga lo que se pidió. Renombra la rama (`feat/TI-XXXX-...`) o pon la clave
> en el título de la PR.

Si encuentras varias claves distintas, dilo y audita cada una.

## 2. Lee la fuente del ticket

Con las herramientas de Atlassian (`getJiraIssue`, y `getConfluenceContent`
para páginas enlazadas) lee:

- resumen, tipo, estado, descripción y criterios de aceptación;
- comentarios: suelen cambiar o aclarar el alcance;
- incidencias enlazadas, subtareas y páginas de Confluence enlazadas.

Si el ticket no existe o no tienes acceso, dilo claramente con la clave y
para. No inventes requisitos. Si el ticket está vacío o es ambiguo, dilo: eso
también es un hallazgo.

## 3. Lee el cambio

- El diff contra la base: `git diff origin/develop...HEAD` (PR draft contra
  develop), o los ficheros de la PR con `gh api repos/{owner}/{repo}/pulls/{n}/files`.
- El código que rodea cada cambio: llamadores, tests y, en el CRM, las
  diferencias entre productos (3, 13, 14, 40, 50, 60) y entre España y México.
  Distingue CRM y API-Ibancar: no siempre se comportan igual.

## 4. Contrasta

Convierte el ticket en una lista de requisitos concretos. Para cada uno:

- **Cumple**: con evidencia `fichero:línea`.
- **Parcial**: qué falta.
- **No cumple**: qué hace el código en su lugar.
- **No verificable**: por qué (depende de datos, de otro repo o de configuración).

Después busca lo que sobra: cambios del diff que ningún requisito pide. No
siempre está mal, pero hay que nombrarlos.

Comprueba también:
- ¿Hay test que falle si el requisito se rompe?
- ¿Algún requisito afecta a dinero (cuotas, morosidad, TAE, cancelación) o a
  datos de clientes? Márcalo para revisión humana.

## 5. Formato

```
Ticket: TI-XXXX — <resumen> (<estado>) <url>
Rama: <rama> · Base: <base> · PR: <url o "sin PR">

Requisitos
1. <requisito> — Cumple | Parcial | No cumple | No verificable
   <evidencia fichero:línea o qué falta>

Fuera de alcance
- <cambio sin requisito>, <fichero>

Veredicto: Cumple el ticket. | Falta: 2, 4. | Sin ticket: no auditable.
No comprobado: <una línea, si algo importante quedó sin mirar>
```
