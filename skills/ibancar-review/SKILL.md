---
name: ibancar-review
description: >
  Review de la PR entera de Ibancar con el contexto del backend real del CRM:
  carga la skill conciliacion-dev y revisa todo el diff de la rama contra
  develop (bugs, riesgos, carga, tests, lo que sobra), contrastando con las
  reglas de negocio, diferencias entre productos y España/México, CRM frente a
  API-Ibancar y deuda técnica conocida. Solo informa, no cambia código. Úsala
  para /ibancar-review o "revisa la PR".
---

Revisa la PR entera de la rama actual como quien recibe la alerta cuando se
rompe en producción. Responde en español. No cambies código.

## 1. Carga el contexto del CRM

Antes de mirar el diff, invoca la skill `anthropic-skills:conciliacion-dev`
con la herramienta Skill. Es la referencia del comportamiento real del
backend: cálculos (cuotas, morosidad, demora, cancelación, TAE, acuerdos,
deuda), crons y observers, esquema España/México, deuda técnica conocida.

Si esa skill no está disponible, dilo en la primera línea del informe
("Sin conciliacion-dev: review sin contexto de negocio del CRM") y sigue.

## 2. Delimita la PR

- Rama: `git rev-parse --abbrev-ref HEAD`.
- Base: la PR va contra `develop`. Usa `origin/develop`; si no existe en el
  clon, `git fetch --depth=200 origin develop`. Si aún falla, usa
  `origin/release-(WIP)` y dilo.
- Si hay PR abierta (`gh api "repos/{owner}/{repo}/pulls?head={owner}:{rama}&state=open"`),
  revisa también su descripción y comentarios.
- Alcance: **todo** `git diff origin/develop...HEAD`, no solo lo último sin
  commitear.

## 3. Revisa

Aplica el método y el formato de la skill `ponytail:ponytail-review`
(invócala con la herramienta Skill, con el alcance "la PR entera contra
origin/develop"). Además, con lo que dice conciliacion-dev:

- ¿El cambio respeta la regla de negocio tal como la implementa el CRM, o
  solo como la describe el frontend? Distingue validación de frontend y
  enforcement de backend.
- ¿La regla cambia entre productos (3, 13, 14, 40, 41, 50, 60) o entre España
  y México? ¿El cambio cubre todos los que debe?
- ¿Toca algo que API-Ibancar o las apps cliente calculan por su lado? Si sí,
  ¿quedan desalineados?
- ¿Cae sobre deuda técnica o un bug conocido? Cítalo.
- Dinero (cuotas, intereses, TAE, cancelaciones): redondeos, fechas, zonas
  horarias. Márcalo para revisión humana aunque parezca bien.

Cada hallazgo de negocio cita la fuente: `fichero:línea` del código y el
apartado de conciliacion-dev en que se apoya. Si algo no consta en la
documentación, di "no consta en la documentación"; no lo supongas.

## 4. Termina

El formato de ponytail-review (Must fix / Should fix / Nice to have, veredicto)
y una línea `No comprobado:` con lo que quedó fuera (por ejemplo, tests no
ejecutados o repos que no están en la sesión).
