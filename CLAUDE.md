Fase 1: Inicialización y Estructura Base

<context>
Eres un Ingeniero de Software Experto en React, TypeScript y Tailwind CSS. Vamos a construir una aplicación SPA (Single Page Application) puramente frontend orientada a auditores y gestores de SST para la creación y administración de Matrices de Riesgo (IPEVAR) y seguimiento de indicadores del SGSST multi-cliente.
</context>

<instructions>
1. Inicializa la estructura del proyecto usando Vite con la plantilla React + TypeScript.
2. Configura Tailwind CSS y la arquitectura base para integrar Shadcn/ui (configura alias `@/` en `tsconfig.json` y `vite.config.ts`).
3. Crea una estructura de carpetas modular basada en dominios:
   - `/src/core` (types, stores, utils)
   - `/src/modules/clients` (gestión de clientes/negocios y sedes)
   - `/src/modules/matrices` (creación y visualización IPEVAR)
   - `/src/modules/indicators` (indicadores proactivos y reactivos)
   - `/src/components/ui` (componentes reutilizables)
4. Implementa un layout principal con un Sidebar de navegación superior/lateral limpio y profesional.
5. Asegúrate de que el código sea modular, tipado estrictamente sin usar `any`, y que el diseño siga pautas modernas de dashboards corporativos (tonos neutros, accesibilidad).
</instructions>

Ejecuta los comandos de instalación necesarios y genera la estructura inicial.

Fase 2: Modelado de Dominio y Estado Global (Zustand)

<context>
El sistema maneja una jerarquía estricta y cálculos matriciales de riesgo laboral basados en metodologías estándar de valoración (Probabilidad x Consecuencia).
</context>

<instructions>
1. Define las interfaces en TypeScript dentro de `/src/core/types/sgsst.ts`:
   - `Client`: id, name, sector, createdAt.
   - `Location`: id, clientId, name, department, area.
   - `RiskMatrix`: id, locationId, version, date, coveredRoles (array), rows (array).
   - `MatrixRow`: id, activity, hazardType, hazardDescription, effects, controls (objeto con keys: elimination, substitution, engineering, administrative, ppe), evaluation (probability, consequence, riskLevel, acceptability, isPriority).
   - `IndicatorTracking`: seguimiento mensual (Ene-Dic) de indicadores reactivos y proactivos con meta vs. real.
2. Implementa un store global utilizando `Zustand` en `/src/core/stores/useSgsstStore.ts`.
3. Integra el middleware `persist` de Zustand para guardar toda la información en `localStorage` de forma que los datos persistan al recargar la página.
4. Implementa acciones para: crear/editar/eliminar clientes, sedes, matrices, agregar filas a una matriz y registrar mediciones mensuales.
</instructions>

Fase 3: Constructor Dinámico de Matrices (IPEVAR Builder)

<context>
El núcleo de la aplicación es la creación y edición de las filas de la matriz de riesgos por área, permitiendo al usuario ingresar actividades, jerarquía de controles y calcular automáticamente el nivel de riesgo.
</context>

<instructions>
1. Implementa el módulo de creación de Matrices combinando `React Hook Form` y `Zod` para la validación del esquema.
2. Crea un componente de Tabla Dinámica donde cada fila permita la edición de:
   - Actividad y Peligro.
   - Jerarquía de controles (Inputs agrupados para Ingeniería, Administrativos y EPP).
3. Implementa lógica de cálculo automático en la interfaz: 
   - Al seleccionar un valor de Probabilidad y un valor de Consecuencia, calcula en tiempo real el `Nivel de Riesgo` y aplica un color de estado (Badge) según la severidad (ej. Rojo para Crítico/No Aceptable, Amarillo para Medio, Verde para Bajo/Aceptable).
4. Permite duplicar filas existentes para agilizar la carga de datos por parte del auditor.
5. Diseña la interfaz optimizada para pantallas anchas (scroll horizontal controlado o modales de detalle por fila si la información es muy densa).
</instructions>

Fase 4: Módulo de Medición y Dashboard de Indicadores

<context>
Los auditores necesitan visualizar el comportamiento mensual (Enero a Diciembre) de los controles operacionales (Proactivos) y la accidentalidad (Reactivos) en comparación con las metas anuales.
</context>

<instructions>
1. Crea una vista de Dashboard en `/src/modules/indicators` que reciba el contexto de un cliente y sede seleccionados.
2. Implementa tablas de ingreso rápido para registrar los valores `Real` vs `Meta` mes a mes para métricas como:
   - Reactivos: Lesiones, Primeros Auxilios, Daños a la propiedad.
   - Proactivos: % Observaciones de Tarea, Inspecciones de Seguridad, Estado de Equipos.
3. Integra la librería `Recharts` para mostrar:
   - Un gráfico de barras/líneas comparando la Meta vs. el Resultado Real acumulado (YTD).
   - Tarjetas de resumen (KPI Cards) en la parte superior con el estado general de la sede (Días sin accidentes, % general de cumplimiento de controles).
4. Agrega la funcionalidad de exportar la vista actual o la matriz a un formato JSON descargable para respaldar la auditoría.
</instructions>
