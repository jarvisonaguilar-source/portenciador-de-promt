# Flujo de Procesos: Prompt Maestro SENA

Este documento describe la arquitectura lógica y los flujos de interacción de la aplicación utilizando diagramas de procesos.

---

## 1. Flujo General de Usuario
Este diagrama describe el camino que sigue un usuario desde que ingresa un prompt hasta que obtiene el resultado optimizado.

```mermaid
graph TD
    A[Inicio] --> B[Usuario ingresa Prompt Original]
    B --> C[Selecciona Técnica: Zero/Few/CoT]
    C --> D[Selecciona Tipo de Tarea]
    D --> E{¿Prompt vacío?}
    E -- Sí --> B
    E -- No --> F[Clic en 'Mejorar Prompt']
    F --> G[Estado: Cargando / Optimizando]
    G --> H[Procesamiento en Paralelo con Gemini AI]
    H --> I[Visualización de Resultados]
    I --> J[Usuario Copia Prompt Optimizado]
    J --> K[Fin]
```

---

## 2. Lógica de Procesamiento AI (Backend-simulado)
La aplicación utiliza el modelo **Gemini 3 Flash** para realizar dos tareas críticas de forma simultánea.

```mermaid
sequenceDiagram
    participant UI as Interfaz (React)
    participant GS as GeminiService
    participant AI as Modelo Gemini 3 Flash

    UI->>GS: Clic en Refinar (Prompt + Técnica + Tarea)
    Note over GS: Inicia llamadas en paralelo
    
    par Análisis de Estructura
        GS->>AI: analyzePrompt()
        AI-->>GS: JSON (Precisión, Fortalezas, Faltantes)
    and Refinamiento Estructural
        GS->>AI: refinePrompt()
        AI-->>GS: JSON (Prompt Mejorado, Explicación, ROI)
    end

    GS-->>UI: Retorna PromptAnalysis + RefinedPrompt
    UI->>UI: Actualiza Estado (setState)
    Note right of UI: Renderiza Métricas y Prompt Final
```

---

## 3. Gestión de Tema (Modo Oscuro)
La aplicación mantiene la preferencia del usuario utilizando persistencia local.

```mermaid
graph LR
    A[Monitor de Eventos: Clic Sol/Luna] --> B{¿Es Dark Mode?}
    B -- Sí --> C[Eliminar clase 'dark' de HTML]
    B -- No --> D[Agregar clase 'dark' a HTML]
    C --> E[Actualizar LocalStorage: 'light']
    D --> F[Actualizar LocalStorage: 'dark']
    E --> G[Efecto de Desenfoque de Transición]
    F --> G
```

---

## 4. Estructura de Datos (Prompt Refinado)
Cada prompt generado debe cumplir con la arquitectura institucional definida:

| Componente | Descripción |
| :--- | :--- |
| **Rol** | Define la identidad experta que debe asumir la IA. |
| **Tarea** | La instrucción clara y directa de lo que se debe hacer. |
| **Contexto** | Información de fondo, restricciones y detalles específicos. |
| **Formato** | Cómo debe entregarse la información (JSON, Tabla, Lista, etc.). |

---
*Manual técnico de procesos - Prompt Maestro SENA 2026*
