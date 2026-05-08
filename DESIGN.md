# PetroDash — Design System
> Versión 1.0 | Abril 2026

## Filosofía de Diseño

PetroDash sirve a **ingenieros y analistas técnicos** del sector petrolero argentino. El sistema de diseño equilibra tres influencias:

- **Identidad industrial** — cromática y tono propios del sector, no un dashboard genérico
- **Claridad de Flourish** — jerarquía visual limpia, datos protagonistas
- **Densidad funcional de Grafana** — los ingenieros necesitan información densa sin fricción

**Principio rector:** *Cada píxel debe justificar su existencia. Si no comunica datos o contexto, sobra.*

---

## 1. Tokens de Color

### Paleta Primaria

```css
/* Brand */
--color-brand-dark:     #1e3a1e;   /* Navbar, headers fuertes */
--color-brand-primary:  #2d4a2d;   /* Elementos primarios, CTAs */
--color-brand-mid:      #3d6b3d;   /* Hover states, active */
--color-brand-light:    #5a8f5a;   /* Accents secundarios */

/* Background */
--color-bg-base:        #f0ece4;   /* Fondo general — beige crema */
--color-bg-surface:     #faf8f4;   /* Cards, paneles — crema más claro */
--color-bg-sunken:      #e8e3d8;   /* Inputs, áreas deprimidas */
--color-bg-overlay:     #1e3a1ef2; /* Panel lateral del mapa, tooltips */

/* Texto */
--color-text-primary:   #1a1a18;   /* Títulos, datos principales */
--color-text-secondary: #4a4a44;   /* Labels, descripciones */
--color-text-muted:     #7a7a70;   /* Metadata, timestamps */
--color-text-inverse:   #f0ece4;   /* Texto sobre fondos oscuros */

/* Bordes */
--color-border-subtle:  #d8d2c4;   /* Separadores internos */
--color-border-medium:  #b8b0a0;   /* Bordes de cards, inputs */
```

### Paleta de Datos (Charts)

```css
/* Serie de producción */
--color-petroleum:      #3d6b3d;   /* Petróleo — verde marca */
--color-gas:            #c47d0e;   /* Gas — ámbar */
--color-water:          #3a7fa8;   /* Agua — azul acero */

/* Inyección */
--color-inj-water:      #5ba3cc;   /* Inyección agua — azul claro */
--color-inj-co2:        #8b5ea8;   /* Inyección CO2 — violeta */
--color-inj-gas:        #e8a030;   /* Inyección gas — ámbar claro */

/* Estados de pozos */
--color-status-active:  #3d9e3d;   /* Activo */
--color-status-stopped: #e8a030;   /* Parado */
--color-status-inactive:#c0392b;   /* Inactivo */
--color-status-unknown: #9a9a90;   /* No informado */

/* Anomalías */
--color-anomaly:        #c0392b;   /* Puntos de anomalía en charts */

/* Escala categórica (rankings, comparaciones multi-empresa) */
--color-cat-1:  #2d4a2d;
--color-cat-2:  #c47d0e;
--color-cat-3:  #3a7fa8;
--color-cat-4:  #8b5ea8;
--color-cat-5:  #c0392b;
--color-cat-6:  #5a8f5a;
--color-cat-7:  #e8a030;
--color-cat-8:  #5ba3cc;
--color-cat-9:  #7a7a70;
--color-cat-10: #1e3a1e;
```

### Semánticos

```css
--color-success:  #3d9e3d;
--color-warning:  #e8a030;
--color-error:    #c0392b;
--color-info:     #3a7fa8;
```

---

## 2. Tipografía

### Familias

```css
--font-display: 'IBM Plex Sans', sans-serif;  /* Títulos de página */
--font-body:    'IBM Plex Sans', sans-serif;  /* Todo el resto */
--font-mono:    'IBM Plex Mono', monospace;   /* Valores numéricos, IDs de pozos */
```

> **Por qué IBM Plex Sans:** Diseñada por IBM para interfaces técnicas y de datos. Tiene variante mono perfecta para números de producción. Comunica precisión industrial sin ser fría como Roboto.

### Escala Tipográfica

| Token | Size | Weight | Line-height | Uso |
|-------|------|--------|-------------|-----|
| `--text-page-title` | 22px | 600 | 1.2 | Título principal de cada vista |
| `--text-section-title` | 16px | 600 | 1.3 | Títulos de sección dentro de vista |
| `--text-card-label` | 11px | 600 | 1 | Labels de cards, uppercase + tracking |
| `--text-body` | 13px | 400 | 1.5 | Texto corriente, descripciones |
| `--text-data` | 13px | 500 | 1 | Valores en tablas y listas |
| `--text-data-lg` | 20px | 600 | 1 | KPIs, métricas destacadas |
| `--text-mono` | 12px | 400 | 1.4 | IDs de pozos, coordenadas, fechas |
| `--text-label` | 11px | 500 | 1 | Ejes de charts, leyendas |

```css
/* Aplicación de card labels */
.card-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
```

---

## 3. Espaciado

Sistema de base **8px**. Todas las medidas son múltiplos de 4px (mínimo) u 8px (preferido).

```css
--space-1:  4px;   /* Separación mínima, gaps internos de chips */
--space-2:  8px;   /* Padding interno de badges, gap entre icon y label */
--space-3:  12px;  /* Padding interno de inputs compactos */
--space-4:  16px;  /* Padding de cards, gap entre elementos de formulario */
--space-5:  20px;  /* Margen entre secciones menores */
--space-6:  24px;  /* Padding interno de cards principales */
--space-8:  32px;  /* Separación entre secciones */
--space-10: 40px;  /* Margen superior de títulos de página */
--space-12: 48px;  /* Separación entre bloques mayores */
```

---

## 4. Bordes y Sombras

```css
/* Border radius */
--radius-sm:  4px;   /* Badges, chips, tags */
--radius-md:  6px;   /* Inputs, botones */
--radius-lg:  8px;   /* Cards principales */
--radius-xl:  12px;  /* Panels, modales */

/* Sombras — sutiles, no Material-style */
--shadow-sm:  0 1px 3px rgba(30, 58, 30, 0.08);
--shadow-md:  0 2px 8px rgba(30, 58, 30, 0.10);
--shadow-lg:  0 4px 16px rgba(30, 58, 30, 0.12);
```

---

## 5. Componentes Clave

### 5.1 Cards

```
┌─────────────────────────────────────┐
│ LABEL DE SECCIÓN              [acción]│  ← 11px uppercase, muted
├─────────────────────────────────────┤  ← border-bottom subtle
│                                     │
│   contenido                         │
│                                     │
└─────────────────────────────────────┘
```

- Background: `--color-bg-surface`
- Border: `1px solid var(--color-border-subtle)`
- Border-radius: `--radius-lg`
- Padding: `--space-6`
- Sombra: `--shadow-sm`

### 5.2 Filtros — Antes vs Después

**Antes (problema):** 4 dropdowns grandes en grid 4 columnas, altura total ~80px visible.

**Después:** Barra de filtros compacta en una sola fila.

```
[ Cuenca ▾ ] [ 2023 ▾ ] [ Ene ▾ ] → [ 2026 ▾ ] [ Abr ▾ ]  [× Limpiar]
```

- Altura de cada control: 32px (vs 40px actual)
- Font-size de selects: 12px
- Background: `--color-bg-sunken`
- Separador `→` entre inicio y fin del rango

### 5.3 Panel de Detalle de Pozo (Mapa)

**Antes:** Lista plana de 10 atributos sin agrupación.

**Después:** Agrupado en 3 secciones con label de categoría:

```
┌─ POZO 2787 ────────────────────────┐
│                                    │
│  UBICACIÓN                         │
│  Cuenca      NEUQUINA              │
│  Provincia   La Pampa              │
│  Área        MEDANITO              │
│                                    │
│  CLASIFICACIÓN                     │
│  Empresa     Petroquímica CR S.A.  │
│  Yacimiento  MEDANITO              │
│  Formación   quintuco              │
│  Tipo recurso CONVENCIONAL         │
│                                    │
│  OPERACIÓN                         │
│  Tipo pozo   Petrolífero           │
│  Estado      Extracción Efectiva   │
│  Profundidad 1.300 m               │
└────────────────────────────────────┘
```

### 5.4 Charts — Configuración Base

**Principios:**
- Gridlines: `--color-border-subtle` con opacity 0.5, sin eje X ni Y visible como línea sólida
- Colores de series: siempre del token de datos definido arriba, nunca defaults de librería
- Tooltips: fondo `--color-bg-overlay`, texto `--color-text-inverse`, border-radius `--radius-md`
- Labels de ejes: `--text-label`, color `--color-text-muted`
- Sin títulos de ejes redundantes cuando el contexto es obvio

**Bar chart comparativo (Pozo vs Mediana):**
- Eliminar label del eje X ("Pozo", "Mediana") — moverlo a la leyenda o al tooltip
- Agregar valor numérico encima de cada barra
- Gap entre barras: 30% del ancho de barra

**Donut/Pie charts (Rankings):**
- Máximo 6 slices visibles individualmente
- Resto → "Otros" en `--color-cat-9`
- Label interno: porcentaje. Label externo: nombre empresa (solo top 3)

### 5.5 Botones

```css
/* Primario */
.btn-primary {
  background: var(--color-brand-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  font-size: 13px;
  font-weight: 500;
}

/* Secundario */
.btn-secondary {
  background: transparent;
  color: var(--color-brand-primary);
  border: 1px solid var(--color-brand-primary);
}

/* Toggle (m³ / BBL) */
.btn-toggle-active {
  background: var(--color-brand-primary);
  color: var(--color-text-inverse);
}
.btn-toggle-inactive {
  background: var(--color-bg-sunken);
  color: var(--color-text-secondary);
}
```

---

## 6. Navegación Lateral

- Ancho colapsado: 48px
- Ancho expandido: 220px
- Background: `--color-brand-dark`
- Íconos activos: `--color-brand-light` con fondo `rgba(255,255,255,0.08)`
- Transición: 200ms ease

---

## 7. Estados y Feedback

```css
/* Loading */
/* Usar skeleton screens del color --color-bg-sunken, no spinners centrados */

/* Empty state */
/* Texto centered, 13px, color --color-text-muted */
/* Sin ilustraciones — texto descriptivo de qué seleccionar */

/* Error */
/* Banner superior en card, fondo rgba(192,57,43,0.08), border-left 3px --color-error */
```

---

## 8. Reglas de Uso — Lo que NO hacer

1. **No usar sombras elevation-style (Material)** — las sombras son sutiles o no están
2. **No mezclar colores fuera de la paleta** en charts — si se necesita más de 10 series, usar `Otros`
3. **No poner títulos redundantes en ejes** cuando el chart title ya lo describe
4. **No usar border-radius > 12px** — la app es técnica, no es una app de wellness
5. **No usar gradients** en fondos de cards o barras de charts
6. **No centrar texto** en tablas de datos — siempre left-aligned salvo números (right-aligned)
7. **No usar más de 2 niveles de gris** para texto — primary y muted, punto

---

## 9. Checklist de Implementación

- [ ] Cargar IBM Plex Sans e IBM Plex Mono desde Google Fonts
- [ ] Definir todos los CSS variables en `:root`
- [ ] Reemplazar colores hardcodeados en charts por variables
- [ ] Reducir altura de selects/dropdowns a 32px
- [ ] Aplicar agrupación en panel de detalle del mapa
- [ ] Configurar donut charts con límite de 6 slices
- [ ] Revisar todos los `font-size` — nada debería estar por encima de 22px salvo casos excepcionales
- [ ] Verificar que todos los labels de categoría sean uppercase con letter-spacing

---

*Documento generado como base para implementación con Claude Code.*
*Actualizar este archivo ante cualquier decisión de diseño que se tome en el proceso.*
