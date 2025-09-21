# 📖 Diario Mood - Tu espacio personal

Una aplicación web móvil que mezcla escritura, emociones y creatividad para que tengas un diario moderno y seguro.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

1. **🔐 Inicio seguro**
   - Acceso con PIN de 4-6 dígitos
   - Teclado numérico integrado
   - Almacenamiento seguro local

2. **📝 Entrada del día**
   - Campo de texto libre para escribir
   - Botón de grabación de audio (placeholder)
   - Opción para subir foto (placeholder)

3. **😊 Selector de estado emocional**
   - 5 emojis para diferentes estados de ánimo
   - Interfaz táctil optimizada

4. **💭 Preguntas inspiradoras**
   - Pregunta diferente cada día del año
   - Rotación automática basada en fecha

5. **📊 Seguimiento de emociones**
   - Gráfica semanal interactiva
   - Estadísticas de estado de ánimo
   - Visualización con Chart.js

6. **🗺️ Mapa de recuerdos**
   - Interfaz preparada para geolocalización
   - Toggle para activar/desactivar ubicación

7. **⚡ Modo minimalista**
   - Entrada rápida con emoji + frase corta
   - Contador de caracteres (máx. 100)

8. **🎨 Personalización**
   - 4 temas: Predeterminado, Oscuro, Pastel, Minimalista
   - Cambio dinámico de colores
   - Interfaz adaptativa

9. **🔔 Recordatorios suaves**
   - Notificaciones web diarias
   - Hora personalizable
   - Permisos opcionales

### 📱 Funcionalidades PWA

- **Instalable**: Se puede instalar como app nativa
- **Offline**: Funciona sin conexión a internet
- **Service Worker**: Cache inteligente de recursos
- **Responsive**: Optimizado para todos los tamaños de pantalla
- **Accesos directos**: Enlaces rápidos a funciones principales

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Gráficos**: Chart.js para visualización de datos
- **Iconos**: Font Awesome 6
- **Storage**: localStorage para persistencia
- **PWA**: Service Worker + Web App Manifest
- **Notificaciones**: Web Notifications API

## 📂 Estructura del Proyecto

```
/
├── index.html          # Página principal
├── style.css          # Estilos y temas
├── script.js          # Lógica de la aplicación
├── manifest.json      # Manifiesto PWA
├── sw.js              # Service Worker
└── README.md          # Este archivo
```

## 🚀 Instalación y Uso

### Opción 1: Servidor Local

1. Navega al directorio del proyecto
2. Ejecuta un servidor HTTP local:
   ```bash
   python -m http.server 8080
   ```
3. Abre el navegador en `http://localhost:8080`

### Opción 2: Instalar como PWA

1. Abre la aplicación en un navegador compatible
2. Busca el botón "Instalar aplicación" o "Añadir a pantalla de inicio"
3. Sigue las instrucciones del navegador

## 📱 Uso de la Aplicación

### Primer Uso

1. **Configuración inicial**: Al abrir por primera vez, configura un PIN de 4-6 dígitos
2. **Acceso**: Usa el PIN para acceder a tu diario personal
3. **Primera entrada**: Responde la pregunta del día y selecciona tu estado de ánimo

### Funciones Principales

#### 📝 Crear Entrada Completa
- Ve a la pestaña "Diario"
- Responde la pregunta inspiradora del día
- Selecciona tu emoji de estado de ánimo
- Escribe libremente sobre tu día
- Guarda la entrada

#### ⚡ Entrada Rápida
- Ve a la pestaña "Rápido"
- Selecciona tu emoji del día
- Escribe una frase corta (máx. 100 caracteres)
- Guarda la entrada rápida

#### 📊 Ver Estadísticas
- Ve a la pestaña "Ánimo"
- Revisa tu gráfica semanal de emociones
- Ve estadísticas como mejor día y promedio semanal

#### ⚙️ Configuración
- Toca el ícono de configuración (⚙️)
- Cambia temas de color
- Configura recordatorios diarios
- Exporta tus datos
- Cambia tu PIN

## 🎨 Temas Disponibles

1. **Predeterminado**: Colores modernos con azul y violeta
2. **Oscuro**: Perfecto para uso nocturno
3. **Pastel**: Tonos suaves en rosa y magenta
4. **Minimalista**: Diseño limpio en escala de grises

## 🔔 Notificaciones

- La app puede enviarte recordatorios diarios para escribir
- Configura la hora preferida en Configuración
- Las notificaciones son opcionales y requieren permisos

## 💾 Almacenamiento de Datos

- **Local**: Todos los datos se guardan en tu dispositivo
- **Privacidad**: Ningún dato se envía a servidores externos
- **Backup**: Puedes exportar tus datos en formato JSON
- **Persistencia**: Los datos se mantienen entre sesiones

## 🔒 Seguridad y Privacidad

- ✅ **Completamente offline**: No se envían datos a internet
- ✅ **Encriptación local**: PIN protege el acceso
- ✅ **Control total**: Tú manejas tus propios datos
- ✅ **Sin seguimiento**: No hay analytics ni cookies de terceros

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos**: iOS, Android, Windows, macOS, Linux
- **PWA**: Compatible con instalación nativa en dispositivos móviles

## 🛠️ Desarrollo

### Características Técnicas

- **Responsive Design**: Mobile-first con CSS Grid y Flexbox
- **Accesibilidad**: Navegación por teclado y lectores de pantalla
- **Performance**: Lazy loading y optimización de recursos
- **Offline-first**: Funciona completamente sin conexión
- **Modern JavaScript**: ES6+ con clases y async/await

### Arquitectura

```javascript
DiarioMoodApp
├── Authentication (login/logout)
├── Data Management (localStorage)
├── Theme System (CSS custom properties)
├── Entry Management (CRUD operations)
├── Mood Tracking (Chart.js integration)
├── Notifications (Web API)
└── PWA Features (service worker)
```

## 📊 Datos Almacenados

La aplicación guarda los siguientes datos localmente:

```json
{
  "entries": [
    {
      "id": 1695123456789,
      "date": "2025-09-20T10:30:00.000Z",
      "text": "Texto de la entrada...",
      "mood": 4,
      "question": "¿Qué agradeces hoy?",
      "type": "full"
    }
  ],
  "settings": {
    "notifications": true,
    "notificationTime": "20:00",
    "locationEnabled": false
  },
  "theme": "default"
}
```

## 🚀 Funciones Futuras

- 📍 Geolocalización real para mapa de recuerdos
- 🎙️ Grabación de audio funcional
- 📷 Captura y almacenamiento de fotos
- ☁️ Sincronización opcional en la nube
- 📈 Más tipos de gráficos y estadísticas
- 🏷️ Sistema de etiquetas y categorías
- 🔍 Búsqueda de entradas
- 📤 Más opciones de exportación

## 🐛 Solución de Problemas

### La aplicación no guarda datos
- Verifica que el navegador permita localStorage
- Revisa que no estés en modo incógnito

### Las notificaciones no funcionan
- Acepta los permisos de notificación
- Verifica que las notificaciones estén habilitadas en el sistema

### No se pueden instalar como PWA
- Usa un navegador compatible (Chrome, Edge, Firefox)
- Asegúrate de estar usando HTTPS o localhost

### Problemas de rendimiento
- Limpia los datos del navegador si tienes muchas entradas
- Actualiza a la última versión del navegador

## 📄 Licencia

Este proyecto es de código abierto para uso personal y educativo.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras errores o tienes ideas para mejoras, siéntete libre de contribuir.

---

**¡Disfruta escribiendo en tu Diario Mood! 📖✨**