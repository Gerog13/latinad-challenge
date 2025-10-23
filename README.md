 # React Challenge v2 - Plataforma de Gestión de Pantallas

Una plataforma integral de gestión de pantallas construida con React, TypeScript y Node.js que incluye mapas interactivos, dashboards de ventas y capacidades avanzadas de filtrado.

## 🚀 Funcionalidades Implementadas

#### 1. **Gestión de Horarios de Funcionamiento** (Funcional)
- **Configuración Dinámica de Horarios**: Establecer múltiples rangos de tiempo por día
- **Estado en Tiempo Real**: Indicación en vivo de disponibilidad de pantallas
- **Sistema de Validación**: Previene horarios superpuestos y tiempos inválidos
- **Almacenamiento JSON**: Integración eficiente con backend usando campo rules

#### 2. **Dashboard de Ventas** (Funcional)
- **Gráficos Interactivos**: Gráficos de barras con Chart.js para visualización de ventas
- **Métricas Avanzadas**: Ventas totales, promedios, valores mín/máx
- **Filtrado por Fechas**: Selección de rangos de fechas personalizados
- **Datos en Tiempo Real**: Actualizaciones en vivo desde API del backend
- **Diseño Responsive**: Optimizado para todos los tamaños de pantalla

#### 3. **Implementación de Redux** (Técnico)
- **Gestión de Estado**: Migración completa de Context API a Redux Toolkit
- **Flujo de Autenticación**: Login/logout con sesiones persistentes
- **Seguridad de Tipos**: Integración completa de TypeScript con hooks tipados
- **Middleware**: Verificación serializable y manejo de persistencia

#### 4. **Mapa Interactivo** (Funcionalidad Creativa)
- **Visualización Geográfica**: Mapa con Leaflet y ubicaciones de Buenos Aires
- **Marcadores Inteligentes**: Codificados por color según tipo de pantalla (outdoor/indoor)
- **Estado en Tiempo Real**: Indicadores de actividad en vivo en los marcadores
- **Tooltips Avanzados**: Previsualizaciones al hacer hover con información esencial
- **Filtrado Inteligente**: Filtrar por tipo, rango de precio y estado de actividad
- **Diseño Responsive**: Optimizado para móviles con interacciones táctiles

## 📊 Demo de Funcionalidades Principales

### Mapa Interactivo
- Navega a `/map` para explorar el mapa interactivo de pantallas
- Usa los filtros para encontrar tipos específicos de pantallas o rangos de precio
- Pasa el cursor sobre los marcadores para información rápida
- Haz clic en los marcadores para ver información detallada de la pantalla

### Dashboard de Ventas
- Visita `/dashboard` para análisis completo de ventas
- Filtra datos por rangos de fechas
- Ve gráficos interactivos y métricas clave
- Visualizaciones listas para exportar

### Gestión de Horarios de Funcionamiento
- Configura horarios de disponibilidad de pantallas
- Establece múltiples rangos de tiempo por día
- Actualizaciones de estado en tiempo real
- La validación previene conflictos de horarios

## 📝 Referencia del Challenge Original
Para los requisitos originales del challenge, ver: https://hackmd.io/@33424kC_SAymSM87bryuNw/S14zZWJRgg


