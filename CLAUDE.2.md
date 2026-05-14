# Instrucciones del Proyecto (SGSST - IPEVAR Matrix Builder)

Este proyecto es una SPA puramente frontend en React 18, TypeScript y Tailwind CSS para la gestión ágil de Matrices de Riesgo Laboral (IPEVAR) multi-cliente. El foco crítico es la usabilidad, persistencia local y rendimiento del motor matricial.

## Comandos Principales

- **Desarrollo:** `npm run dev`
- **Construcción:** `npm run build`
- **Linting:** `npm run lint`
- **Tests:** `npm test` (si aplica)

## Estilo de Código y Arquitectura (Frontend)

- **React & TypeScript:** Usar exclusivamente componentes funcionales y hooks. Tipado estricto obligatorio (`noImplicitAny`), **cero uso de `any`**.
- **Estilos e Interfaz:** Tailwind CSS combinado con Shadcn/ui. Diseño altamente responsivo, priorizando la accesibilidad (a11y) y el soporte para tablas horizontales extensas.
- **Nomenclatura:** `camelCase` para variables, utilidades y funciones. `PascalCase` para Componentes e Interfaces. Nombres descriptivos y en inglés para el código base.
- **Estado Global:** **Zustand** con persistencia nativa (`localStorage`) para simular bases de datos por cliente/negocio.
- **Formularios y Validación:** **React Hook Form** + **Zod**.
  - _Optimización de Tokens:_ Mantener esquemas de Zod limpios. Utilizar los mensajes de error por defecto de Zod en lugar de strings personalizados en cada campo. Aprovechar validaciones nativas HTML5.
- **Estructura Modular:** Organización orientada a dominios (Feature-based):
  - `/src/core` (types, stores global, utils)
  - `/src/modules/matrices` (IPEVAR builder, tablas dinámicas, cálculos)
  - `/src/components/ui` (Shadcn base)

## Normativa Git

- Usar **Conventional Commits** de forma estricta:
  - `feat:` (nuevas características)
  - `fix:` (solución de errores)
  - `docs:` (cambios en documentación)
  - `refactor:` (refactorización sin alterar comportamiento)
  - `style:` (formateo, punto y coma, etc.)

## RULES & Estrategias de Desarrollo Guiado por IA (Claude Code)

1. **Regla de Oro ("Una tarea a la vez"):** Descomponer cualquier requerimiento grande en pasos atómicos. No intentar generar o refactorizar múltiples módulos en un solo prompt.
2. **Verificación Continua:** Tras generar componentes clave, ejecutar `npm run build` o revisar la terminal de desarrollo para capturar errores de TypeScript de forma temprana.
3. **Gestión de Contexto (Ahorro de Tokens):**
   - Si el contexto se satura o la conversación se vuelve extensa, usar el comando `/compact` o reiniciar la sesión para mantener las respuestas ágiles y económicas.
   - Evitar sobre-explicaciones en el código generado; priorizar código auto-documentado mediante buenos nombres de variables.
4. **Aprobación Consciente:** Revisar siempre los diffs generados antes de presionar `Enter` para aceptar cambios automáticos en los archivos críticos.

Fase 1: Configuración Inicial y Arquitectura Base

Lee las directrices de CLAUDE.md. Inicializa la estructura base del proyecto para nuestra app de Matrices de Riesgo (IPEVAR).

1. Configura la arquitectura de carpetas modular (`/src/core`, `/src/modules/matrices`, `/src/components/ui`).
2. Implementa un layout corporativo (`MainLayout.tsx`) que contenga un Sidebar compacto para seleccionar el "Cliente/Negocio Activo" y un Header superior limpio.
3. Asegúrate de que las rutas relativas o alias (`@/`) estén funcionando correctamente.
4. Realiza un commit con el mensaje "feat: setup inicial de arquitectura base y layout".

Fase 2: Modelado del Estado de la Matriz (Zustand Persistente)

Basado en CLAUDE.md, implementa el motor de estado para las matrices:

1. Crea el archivo de tipos `/src/core/types/matrix.ts` con las interfaces para `Client`, `RiskMatrix`, y `MatrixRow`. Recuerda incluir en `MatrixRow` campos para actividad, peligro, controles (ingeniería, administrativos, EPP), probabilidad, consecuencia, nivel de riesgo y aceptabilidad.
2. Implementa el store `/src/core/stores/useMatrixStore.ts` utilizando Zustand.
3. Integra el middleware `persist` para almacenar todo el árbol de datos en `localStorage`.
4. Exporta métodos limpios: `selectClient`, `createMatrix`, y `updateMatrixRows` (optimizado para mutar las filas de la matriz activa).
5. Valida que compile sin errores de TypeScript y haz un commit: "feat: implementa store global de matrices con Zustand persistente".

Fase 3: IPEVAR Builder y Tabla Dinámica de Riesgos

Crea el núcleo de la aplicación en `/src/modules/matrices`.

1. Implementa el formulario principal usando React Hook Form y Zod. Sigue la regla de optimización de tokens: esquema estricto pero sin strings de mensajes de error personalizados.
2. Diseña el componente de Tabla Dinámica donde cada fila es gestionada eficientemente.
3. Implementa el cálculo reactivo: Al cambiar los selectores de `Probabilidad` o `Consecuencia`, calcula automáticamente el `Nivel de Riesgo` (NP \* NC) y actualiza visualmente un Badge de Aceptabilidad (Rojo >= 200, Amarillo intermedio, Verde <= 40).
4. Integra un botón de acción rápida por fila para "Duplicar Actividad" (clona la fila actual con un nuevo ID).
5. Haz el commit: "feat: motor de creación y evaluación de matrices IPEVAR".

Fase 4: Herramientas de Auditoría (Exportar e Importar JSON/CSV)

Añade la capa de interoperabilidad para el auditor en la vista de la matriz:

1. Crea un componente `MatrixToolbar.tsx` en la cabecera de la matriz activa.
2. Agrega la funcionalidad de "Exportar": descarga el estado actual de la matriz activa como un archivo `.json` formateado.
3. Agrega la funcionalidad de "Importar": un lector de archivos que reciba un `.json` compatible y restaure las filas de la matriz en el store de Zustand.
4. Asegúrate de que la interfaz maneje correctamente el scroll horizontal para pantallas pequeñas/medianas sin romper el layout.
5. Valida el build con `npm run build` y haz el commit final: "feat: módulo de importación y exportación de matrices de riesgo".
