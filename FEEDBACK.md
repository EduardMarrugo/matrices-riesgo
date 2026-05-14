# FEEDBACK · SGSST · IPEVAR Matrix Builder

Estado actual del app y hasta dónde llegamos en esta sesión.
Fecha: 2026-05-14.

---

## Stack

- **Vite 5** + **React 18** + **TypeScript estricto** (sin `any`, `noUnusedLocals`, `noImplicitAny`).
- **Tailwind CSS 3** (sin Shadcn instalado todavía, carpeta `src/components/ui/` reservada).
- **Zustand 5** con `persist` middleware para estado global en `localStorage`.
- **React Hook Form** + **Zod** para todos los formularios.
- **Recharts** para gráficos del dashboard de indicadores.
- Alias `@/` → `src/` configurado en `tsconfig.app.json` y `vite.config.ts`.

## Estructura

```
src/
├── core/
│   ├── stores/          useMatrixStore, useIndicatorStore, useUiStore
│   ├── types/           matrix.ts, indicator.ts
│   └── utils/           id, date, risk (escalas + cálculo NP×NC),
│                        indicatorCatalog, demoMatrix
├── components/
│   ├── layout/          MainLayout, Sidebar (nav funcional), Header
│   └── ui/              (vacío, reservado para Shadcn)
└── modules/
    ├── matrices/
    │   ├── components/  MatrixBuilder (orquestador), MatrixList,
    │   │                CreateClientForm, CreateMatrixForm,
    │   │                MatrixEditor (tabs), MatrixHeatmap,
    │   │                MatrixRowDialog, MatrixToolbar,
    │   │                AcceptabilityBadge
    │   ├── schemas/     matrixForm.schema.ts (Zod)
    │   └── utils/       io.ts (export/import JSON)
    └── indicators/
        ├── components/  IndicatorsDashboard, KpiCards,
        │                IndicatorTable, IndicatorChart,
        │                IndicatorsToolbar
        └── utils/       summary.ts, io.ts
```

## Capacidades implementadas

### Multi-cliente persistente
- Crear, listar y cambiar entre clientes (Sidebar selector + botón "+ Nuevo cliente").
- Cancelar la creación si fue por error y volver al cliente anterior.
- Datos se guardan automáticamente en `localStorage` por dominio (matrices, indicadores).

### Matrices IPEVAR
- **Catálogo de matrices por cliente** con tarjetas (`MatrixList`).
- **Crear matriz vacía** o cargar **matriz de ejemplo** (4 actividades cubriendo
  los 3 niveles de aceptabilidad).
- **Seed automático**: cualquier cliente nuevo recibe la matriz demo al crearse.
- **Editor con dos vistas alternables (tabs)**:
  - **Tabla resumen**: cada fila muestra Actividad/Peligro jerarquizados,
    píldoras de controles (Ing/Adm/EPP) con dot filled/empty, labels de
    Probabilidad/Consecuencia, badge de Nivel · Aceptabilidad y acciones
    (Editar / Duplicar / Eliminar).
  - **Mapa de calor**: grid Probabilidad × Consecuencia coloreado por
    aceptabilidad (verde ≤40, amarillo intermedio, rojo ≥200). Cada celda
    muestra NR + conteo de actividades + tooltip con nombres. Lista
    agrupada por aceptabilidad debajo.
- **Dialog modal de actividad** (`MatrixRowDialog`) con secciones:
  - Identificación (Actividad + Peligro)
  - Jerarquía de controles (textareas Ing / Adm / EPP)
  - Valoración del riesgo con preview en vivo del badge
  - Cierra con ESC, backdrop o botón Cancelar; bloquea scroll del body.
- **Cálculo reactivo NP × NC** en todas las vistas (tabla, mapa, dialog) vía
  `useWatch` de RHF.
- **Exportar / Importar JSON** con validación Zod en import (recalcula
  riskLevel/acceptability al importar).

### Indicadores SGSST
- Dashboard por cliente con catálogo predefinido de 6 indicadores (3 reactivos,
  3 proactivos) auto-sembrados al primer acceso.
- **KPI cards**: cumplimiento controles proactivos (% promedio Real/Meta) y
  eventos reactivos YTD.
- **Tabla mensual editable** Ene–Dic con totales (auto-guarda al editar celda).
- **Gráfico ComposedChart** (Recharts): barras Meta/Real + línea Real acumulado.
- **Exportar JSON** del set completo de indicadores del cliente.

### Layout y navegación
- `MainLayout` con Sidebar fija + Header + área scrollable.
- Sidebar: selector de cliente activo, botón "+ Nuevo cliente", nav
  Matrices ↔ Indicadores.
- Header refleja la vista activa.

## Decisiones técnicas que vale la pena conocer

- **IDs basados en `Date.now() + random suffix`** en `core/utils/id.ts`
  (no se usa `crypto.randomUUID()` ni el paquete `uuid`).
- **Helpers reutilizables** centralizados en `core/utils/` (id, date, risk,
  demoMatrix, indicatorCatalog) — nunca inline.
- **Selectores de Zustand** siempre devuelven referencias estables: campos
  crudos o `find(...) ?? null`. `.filter()`/`.map()` se hacen con `useMemo`
  fuera del selector para evitar el loop infinito de `useSyncExternalStore`
  ya pisado en `MatrixList`.
- **Form-driven editor**: `MatrixEditor` mantiene un `useForm` central; tabla,
  heatmap y dialog leen valores en vivo vía `useWatch`/`useFieldArray`. El
  estado del form se preserva al cambiar de tab. Persistencia explícita con
  el botón "Guardar matriz".
- **Sin react-router** — la nav vive en `useUiStore` (`activeView`).

## Estado del despliegue (GitHub Pages)

- `vite.config.ts` configurado con `base: '/matrices-riesgo/'` solo en build
  (dev sigue corriendo en raíz).
- `.github/workflows/deploy.yml` con GitHub Actions: `npm ci` → `npm run build` →
  `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`.
- **Fix aplicado** tras el primer fallo: `actions/configure-pages@v5` con
  `enablement: true` para que auto-habilite Pages en el repo en el primer run.
- URL esperada: `https://eduardmarrugo.github.io/matrices-riesgo/`.
- **Pendiente del usuario**: Settings → Pages → Source debería terminar en
  "GitHub Actions" (con `enablement: true` la primera ejecución del workflow
  ya lo dejará configurado).

## Lo que NO se hizo (intencional, fuera de scope)

- **Entidad `Location` / sedes**: CLAUDE.md la define pero requeriría su
  propio módulo CRUD. Indicadores y matrices están atados a `Client`
  directamente.
- **Campos extendidos de `MatrixRow`** que mencionaba CLAUDE.md
  (`hazardType`, `effects`, jerarquía completa con `elimination` /
  `substitution`, `isPriority`). El modelo actual sigue el de CLAUDE.2.md
  (peligro como string, controles solo Ing/Adm/EPP).
- **Code-splitting del bundle** (warning Vite por chunk > 500KB causado por
  Recharts). Se puede mitigar con `manualChunks` o `React.lazy` para el
  módulo de indicadores.
- **Pruebas automatizadas** (Vitest, RTL) — no se configuró suite.
- **ESLint** — `npm run lint` no existe; se omitió la dependencia para
  mantener el setup minimal. Si se necesita, agregar
  `eslint-plugin-react-hooks` + flat config.
- **Shadcn/ui** — la carpeta `src/components/ui/` está creada pero vacía;
  los componentes actuales son Tailwind puro.

## Qué probar manualmente

1. Crear un cliente nuevo desde "+ Nuevo cliente" → debería entrar
   automáticamente y traer la matriz demo seedeada.
2. En "Matrices IPEVAR" → abrir la matriz demo → tab "Mapa de calor":
   debería ver 4 celdas pintadas con sus burbujas de actividad.
3. Editar una actividad desde el modal → cambiar Probabilidad/Consecuencia
   → ver el preview del badge actualizar en vivo → Guardar actividad →
   ver la fila actualizada → "Guardar matriz" para persistir.
4. Exportar JSON → editar el archivo → Importar JSON → confirmar reemplazo.
5. Cambiar a "Indicadores SGSST" → editar valores meta/real → ver KPIs y
   gráficos actualizarse → Exportar JSON.

## Bugs conocidos / pendientes menores

- En dev, al hacer cambios con HMR caliente puede aparecer "Maximum update
  depth exceeded" o referencias stale (`append is not defined`). Hard refresh
  (Ctrl+Shift+R) lo limpia. El bundle de producción no tiene esto.
- El `Header` muestra "Auditor SST · AS" hardcoded (placeholder visual).
- No hay forma de **eliminar un cliente o matriz** desde la UI (solo
  borrando `localStorage`).

## Historial de commits relevantes

```
5567eec chore: configura despliegue a GitHub Pages
14a3c8e feat: dialog de actividad y vista resumen para mejor UX
4d38b95 feat: navegacion entre clientes y matriz demo bajo demanda
79b2a8e feat: mapa de calor de matriz y matriz demo al crear cliente
85e9910 fix: evita loop infinito en MatrixList por selector inestable
55ca7c8 feat: dashboard de indicadores SGSST con Recharts
f2b4412 feat: modulo de importacion y exportacion de matrices de riesgo
49a506b feat: motor de creacion y evaluacion de matrices IPEVAR
7e638f0 refactor: extrae helpers newId y nowIso a core/utils
c839ff8 feat: implementa store global de matrices con Zustand persistente
a902b84 feat: setup inicial de arquitectura base y layout
```
