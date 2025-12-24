# 🗃️ SISTEMA DE MIGRACIONES - GYM TRACKER

## 📋 Descripción

Este directorio contiene las migraciones de la base de datos para el sistema GymTracker. Las migraciones están diseñadas para crear, modificar y mantener la estructura de la base de datos de forma controlada y versionada.

## 📁 Archivos Disponibles

```
migrations/
├── gymTrackerMigrationv1.js    # Migración original (v1)
├── migrationV2.js              # Migración mejorada (v2) ⭐
└── README.md                   # Esta documentación
```

## 🚀 Comandos Disponibles

### Ejecutar Migración V2
```bash
# Opción 1: Usando npm script (recomendado)
npm run migrate

# Opción 2: Ejecución directa
node -e "import('./migrations/migrationV2.js').then(m => m.runMigration())"
```

### Probar Migración
```bash
# Prueba completa con verificación
npm run migrate:test

# Prueba incluyendo rollback
npm run migrate:test-rollback
```

### Rollback (Revertir)
```bash
# Usando npm script
npm run migrate:rollback

# Ejecución directa
node -e "import('./migrations/migrationV2.js').then(m => m.rollbackMigration())"
```

## ⚙️ Configuración

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gymtrackerdb
```

### 2. Permisos de Base de Datos
Asegúrate de que el usuario tenga permisos para:
- CREATE/DROP tablas
- CREATE/DROP triggers
- INSERT/UPDATE/DELETE datos
- CREATE/DROP índices

## 🔍 Qué Hace cada Migración

### V1 (gymTrackerMigrationv1.js)
- ✅ Estructura básica de tablas
- ✅ Relaciones fundamentales
- ❌ Tipos de datos básicos
- ❌ Sin campos de seguridad
- ❌ Sin validaciones avanzadas

### V2 (migrationV2.js) ⭐ **RECOMENDADA**
- ✅ Estructura completa y optimizada
- ✅ Tipos de datos mejorados (DECIMAL, ENUM)
- ✅ Campos de seguridad y auditoría
- ✅ Índices optimizados
- ✅ Triggers automáticos
- ✅ Datos semilla
- ✅ Verificación de integridad
- ✅ Función de rollback

## 📊 Tablas Creadas

La migración V2 crea las siguientes tablas:

### 👥 **Gestión de Usuarios**
- `Role` - Roles del sistema
- `User_status` - Estados de usuario
- `User` - Usuarios del sistema
- `Profile` - Perfiles personales

### 🏋️ **Gestión de Gym**
- `Client` - Clientes del gimnasio
- `Professional` - Profesionales (entrenadores, nutricionistas, etc.)
- `Gym_Service` - Servicios del gimnasio
- `Client_Service` - Relación cliente-servicio

### 💰 **Gestión Financiera**
- `Payment_Method` - Métodos de pago
- `Payment` - Pagos realizados

### 📅 **Gestión de Citas**
- `Appointment_Status` - Estados de cita
- `Appointment` - Citas programadas

### 🏃 **Planes de Entrenamiento**
- `Training_Plan` - Planes de entrenamiento
- `Routine` - Rutinas específicas
- `Exercise` - Ejercicios disponibles
- `Routine_Exercise` - Relación rutina-ejercicio
- `Difficulty_Level` - Niveles de dificultad
- `Routine_Target` - Objetivos de rutina

### 🍎 **Planes Nutricionales**
- `Meal_Plan` - Planes de alimentación
- `Meal` - Comidas disponibles
- `MealPlan_Meal` - Relación plan-comida

### 🏥 **Fisioterapia**
- `PhysiotherapyPlan` - Planes de fisioterapia
- `Therapy` - Terapias específicas
- `PhysioExercise` - Ejercicios de fisioterapia
- `Therapy_PhysioExercise` - Relación terapia-ejercicio

### 📏 **Mediciones**
- `Measure` - Medidas antropométricas

### 🔐 **Sistema de Permisos**
- `Module` - Módulos del sistema
- `Permissions` - Permisos disponibles
- `Module_role` - Relación módulo-rol
- `Permissions_module_role` - Permisos por módulo y rol

## 🛡️ Características de Seguridad

### Autenticación
- Verificación de email
- Control de intentos fallidos de login
- Bloqueo temporal de cuentas
- Registro de último acceso

### Integridad de Datos
- Foreign keys con CASCADE/RESTRICT apropiados
- Constraints únicos compuestos
- Validaciones de ENUM
- Índices optimizados

### Auditoría
- Campos `created_at` y `updated_at` en todas las tablas
- Campos `is_active` para borrado lógico
- Triggers automáticos para cálculos

## 🔧 Funciones Automáticas

### Cálculo de BMI
```sql
-- Se calcula automáticamente al insertar/actualizar medidas
TRIGGER tr_calculate_bmi_before_insert
```

### Datos Semilla
Se insertan automáticamente:
- Roles básicos (admin, client, trainer, etc.)
- Estados de usuario (active, inactive, etc.)
- Métodos de pago (efectivo, tarjeta, etc.)
- Estados de cita (scheduled, confirmed, etc.)
- Módulos del sistema
- Permisos básicos

## ⚠️ Consideraciones Importantes

### 1. **Backup Obligatorio**
```bash
# SIEMPRE crear backup antes de migrar
mysqldump -u root -p gymtrackerdb > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. **Orden de Ejecución**
- Las tablas se crean en orden de dependencias
- Los DROP se ejecutan en orden inverso
- Los datos semilla se insertan al final

### 3. **Rollback**
- El rollback elimina TODAS las tablas
- No preserva datos existentes
- Usar solo en emergencias

### 4. **Verificación**
```bash
# Verificar que todo se creó correctamente
mysql -u root -p gymtrackerdb -e "SHOW TABLES;"
mysql -u root -p gymtrackerdb -e "SELECT COUNT(*) FROM Role;"
```

## 🐛 Solución de Problemas

### Error: "Table doesn't exist"
```bash
# Verificar conexión a BD
mysql -u root -p -e "SHOW DATABASES;"
```

### Error: "Access denied"
```bash
# Verificar permisos de usuario
mysql -u root -p -e "SHOW GRANTS FOR 'tu_usuario'@'localhost';"
```

### Error: "Foreign key constraint fails"
```bash
# Verificar orden de dependencias
# La migración maneja esto automáticamente
```

## 📞 Soporte

Si encuentras problemas:

1. **Verificar logs**: Los errores se muestran en consola
2. **Revisar .env**: Verificar configuración de BD
3. **Comprobar permisos**: Usuario debe tener permisos completos
4. **Backup**: Siempre tener respaldo antes de migrar

---

**📅 Última actualización**: Migración V2
**👨‍💻 Mantenido por**: Equipo de desarrollo GymTracker 