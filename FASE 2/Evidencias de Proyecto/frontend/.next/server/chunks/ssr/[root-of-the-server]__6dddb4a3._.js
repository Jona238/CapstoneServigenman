module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/messages/es.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"metadata\":{\"title\":\"SERVIGENMAN — Portal Interno\",\"description\":\"Portal interno de SERVIGENMAN para el personal autorizado de la compañía.\"},\"common\":{\"language\":\"Idioma\",\"spanish\":\"Español\",\"english\":\"Inglés\",\"welcome\":\"Bienvenido\",\"home\":\"Inicio\",\"inventory\":\"Inventario\",\"categories\":\"Categorías\",\"budget\":\"Presupuesto\",\"settings\":\"Ajustes\",\"logout\":\"Cerrar Sesión\",\"login\":\"Iniciar Sesión\",\"loading\":\"Cargando...\",\"error\":\"Error\",\"success\":\"Éxito\",\"cancel\":\"Cancelar\",\"save\":\"Guardar\",\"delete\":\"Eliminar\",\"edit\":\"Editar\",\"add\":\"Agregar\",\"search\":\"Buscar\",\"actions\":\"Acciones\",\"viewAll\":\"Ver Todo\",\"seeMore\":\"Ver más\",\"close\":\"Cerrar\",\"confirm\":\"Confirmar\",\"back\":\"Volver\",\"next\":\"Siguiente\",\"previous\":\"Anterior\",\"light\":\"Claro\",\"dark\":\"Oscuro\",\"theme\":\"Tema\"},\"header\":{\"title\":\"Gestión de Inventario - Recursos Internos\",\"inventoryManagement\":\"Gestión de Inventario\",\"internalResources\":\"Recursos Internos\"},\"auth\":{\"username\":\"Nombre de usuario\",\"password\":\"Contraseña\",\"email\":\"Correo electrónico\",\"forgotPassword\":\"¿Olvidaste tu contraseña?\",\"rememberMe\":\"Recordarme\",\"signIn\":\"Iniciar Sesión\",\"signUp\":\"Registrarse\",\"signOut\":\"Cerrar Sesión\"},\"inventory\":{\"title\":\"Gestión de Inventario\",\"items\":\"Artículos\",\"addItem\":\"Agregar Artículo\",\"editItem\":\"Editar Artículo\",\"deleteItem\":\"Eliminar Artículo\",\"itemName\":\"Nombre del Artículo\",\"quantity\":\"Cantidad\",\"price\":\"Precio\",\"category\":\"Categoría\",\"description\":\"Descripción\",\"stock\":\"Stock\",\"lowStock\":\"Stock Bajo\",\"outOfStock\":\"Sin Stock\",\"inStock\":\"En Stock\",\"unit\":\"Unidad\",\"units\":\"Unidades\",\"value\":\"Valor\",\"total\":\"Total\",\"listTitle\":\"Listado de Recursos\",\"listDescription\":\"Administra, filtra y exporta el inventario corporativo.\",\"addNewResource\":\"Agregar nuevo recurso\",\"resourceName\":\"Nombre del recurso\",\"filterAndSort\":\"Filtrar y ordenar\",\"idOrRange\":\"ID exacto o rango (ej: 2, 3-6, -10, 5-)\",\"filterByResource\":\"Filtrar por Recurso\",\"filterByCategory\":\"Filtrar por Categoría\",\"filterByInfo\":\"Filtrar por Información\",\"sortBy\":\"Ordenar por...\",\"clearFilters\":\"Limpiar filtros\",\"export\":\"Exportar\",\"visible\":\"Visible\",\"all\":\"Todo\",\"photo\":\"Foto\",\"info\":\"Información\",\"additionalInfo\":\"Información (comentario)\",\"add\":\"Agregar\",\"edit\":\"Editar\",\"delete\":\"Eliminar\",\"emptyStateTitle\":\"No hay datos en la tabla\",\"emptyStateDescription\":\"Agrega recursos o ajusta los filtros para visualizar resultados.\",\"previous\":\"Anterior\",\"next\":\"Siguiente\",\"page\":\"Página\"},\"budget\":{\"title\":\"Gestión de Presupuestos\",\"createBudget\":\"Crear Presupuesto\",\"viewBudget\":\"Ver Presupuesto\",\"total\":\"Total\",\"approved\":\"Aprobado\",\"pending\":\"Pendiente\",\"rejected\":\"Rechazado\",\"budgetTitle\":\"Presupuesto\",\"financialSummary\":\"Resumen financiero a partir de los recursos del inventario (precio × cantidad).\",\"valueDistribution\":\"Distribución del valor por categoría\",\"topResources\":\"Top 10 recursos por valor\",\"categorySummary\":\"Resumen por categoría\",\"categorySummaryCaption\":\"Cantidades y valor estimado consolidados según la división de categorías sincronizada con el inventario.\",\"distinctResources\":\"Recursos distintos\",\"totalValue\":\"Valor total\",\"currencyLegend\":\"Moneda activa\",\"currencyExample\":\"Ejemplo de formato: {value}\",\"currencyNoDecimals\":\"Sin decimales\",\"currencyDecimals\":\"{decimals} decimales\"},\"settings\":{\"title\":\"Configuración\",\"profile\":\"Perfil\",\"preferences\":\"Preferencias\",\"security\":\"Seguridad\",\"notifications\":\"Notificaciones\",\"appearance\":\"Apariencia\",\"language\":\"Idioma\",\"accessibility\":\"Accesibilidad\",\"account\":\"CUENTA\",\"settingsCenter\":\"Centro de ajustes\",\"settingsDescription\":\"Administra tu perfil como responsable de Servigenman y ajusta la apariencia y accesibilidad de la plataforma.\",\"fullName\":\"Nombre completo\",\"yourName\":\"Tu nombre\",\"emailAddress\":\"Correo electrónico\",\"emailPlaceholder\":\"ejemplo@correo.com\",\"changesSaved\":\"Cambios guardados correctamente\",\"alsoManage\":\"También puedes gestionar\",\"and\":\"y\",\"theme\":\"Tema\",\"fontSize\":\"Tamaño de letra\",\"small\":\"Pequeña\",\"medium\":\"Mediana\",\"large\":\"Grande\",\"currency\":\"Moneda\",\"chileanPeso\":\"Peso chileno (CLP)\",\"dollar\":\"Dólar (USD)\",\"euro\":\"Euro (EUR)\",\"reduceAnimations\":\"Reducir animaciones\",\"highContrast\":\"Alto contraste\",\"contrastLevel\":\"Nivel de contraste\",\"interfaceSize\":\"Tamaño de interfaz\",\"uiScale\":\"Escala UI\",\"preferencesSaved\":\"Preferencias guardadas (demo)\"},\"home\":{\"recentResources\":\"Recursos Recientes\",\"categoryOverview\":\"Resumen por Categoría\",\"quickStats\":\"Estadísticas Rápidas\",\"totalResources\":\"Total de Recursos\",\"totalValue\":\"Valor Total\",\"resources\":\"Recursos\",\"quickAccess\":\"Accesos rápidos\",\"goToInventory\":\"Ir al Inventario\",\"exploreCategories\":\"Explorar Categorías\",\"viewBudget\":\"Ver Presupuesto\",\"addResource\":\"Agregar Recurso\",\"shortcuts\":\"Atajos\",\"lowStock\":\"Bajas existencias\",\"lastAdded\":\"Últimos añadidos\",\"topExpense\":\"Top gasto\",\"badge\":\"Portal interno v1.1\",\"heroTitle\":\"Seguimiento integral de recursos en terreno\",\"heroDescription\":\"Centraliza el estado de tus activos críticos, recibe alertas de reposición y coordina los equipos técnicos con la visibilidad que proporciona el inventario interactivo.\",\"goToInventoryCta\":\"Ir al inventario\",\"viewFinancialSummary\":\"Ver resumen financiero\",\"managedResources\":\"Recursos gestionados\",\"managedResourcesCaption\":\"Información sincronizada desde bodegas y cuadrillas móviles.\",\"activeOrders\":\"Órdenes activas\",\"activeOrdersCaption\":\"Coordinación en línea entre técnicos y supervisores regionales.\",\"featuredResourcesTitle\":\"Recursos destacados del inventario\",\"featuredResourcesDescription\":\"Una muestra rápida de los equipos priorizados para la próxima mantención preventiva.\",\"viewFullInventory\":\"Ver inventario completo\",\"resource\":\"Recurso\",\"unitValue\":\"Valor unitario\",\"notes\":\"Notas\",\"categoryPlanningTitle\":\"Planificación de categorías\",\"categoryPlanningDescription\":\"Explora el carrusel de categorías para segmentar recursos, asignar responsables y activar filtros preconfigurados según cada área.\",\"budgetMonitoringTitle\":\"Monitoreo presupuestario\",\"budgetMonitoringDescription\":\"Visualiza el impacto financiero de los insumos mediante gráficas y KPI en la sección de presupuesto.\",\"openBudget\":\"Abrir presupuesto\",\"quarterlyExecution\":\"Ejecución trimestral\",\"quarterlyGoal\":\"Meta Q2: 62%\",\"monthlyExpense\":\"Gasto del mes\",\"monthLabel\":\"Abril 2024\",\"availableBalance\":\"Saldo disponible\",\"reservedForEmergencies\":\"Reservado para urgencias\"},\"categories\":{\"title\":\"Categorías\",\"description\":\"Haz clic en una tarjeta para ver únicamente los recursos de esa categoría dentro del inventario.\",\"hint\":\"Actualiza las categorías desde el inventario. Los cambios se sincronizan automáticamente.\",\"exploreTitle\":\"Explora los recursos por categoría\",\"exploreDescription\":\"Navega entre los carruseles superiores e inferiores para identificar tendencias, cantidades disponibles y valor acumulado por cada segmento.\",\"previous\":\"Anterior\",\"next\":\"Siguiente\",\"emptyState\":\"No hay categorías registradas todavía. Agrega recursos en el inventario para construir este resumen visual.\",\"footer\":\"Versión 1.1 - Proyecto Personal para Portafolio\"}}"));}),
"[project]/src/messages/en.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"metadata\":{\"title\":\"SERVIGENMAN — Internal Portal\",\"description\":\"Internal portal of SERVIGENMAN for authorized company personnel.\"},\"common\":{\"language\":\"Language\",\"spanish\":\"Spanish\",\"english\":\"English\",\"welcome\":\"Welcome\",\"home\":\"Home\",\"inventory\":\"Inventory\",\"categories\":\"Categories\",\"budget\":\"Budget\",\"settings\":\"Settings\",\"logout\":\"Logout\",\"login\":\"Login\",\"loading\":\"Loading...\",\"error\":\"Error\",\"success\":\"Success\",\"cancel\":\"Cancel\",\"save\":\"Save\",\"delete\":\"Delete\",\"edit\":\"Edit\",\"add\":\"Add\",\"search\":\"Search\",\"actions\":\"Actions\",\"viewAll\":\"View All\",\"seeMore\":\"See more\",\"close\":\"Close\",\"confirm\":\"Confirm\",\"back\":\"Back\",\"next\":\"Next\",\"previous\":\"Previous\",\"light\":\"Light\",\"dark\":\"Dark\",\"theme\":\"Theme\"},\"header\":{\"title\":\"Inventory Management - Internal Resources\",\"inventoryManagement\":\"Inventory Management\",\"internalResources\":\"Internal Resources\"},\"auth\":{\"username\":\"Username\",\"password\":\"Password\",\"email\":\"Email\",\"forgotPassword\":\"Forgot your password?\",\"rememberMe\":\"Remember me\",\"signIn\":\"Sign In\",\"signUp\":\"Sign Up\",\"signOut\":\"Sign Out\"},\"inventory\":{\"title\":\"Inventory Management\",\"items\":\"Items\",\"addItem\":\"Add Item\",\"editItem\":\"Edit Item\",\"deleteItem\":\"Delete Item\",\"itemName\":\"Item Name\",\"quantity\":\"Quantity\",\"price\":\"Price\",\"category\":\"Category\",\"description\":\"Description\",\"stock\":\"Stock\",\"lowStock\":\"Low Stock\",\"outOfStock\":\"Out of Stock\",\"inStock\":\"In Stock\",\"unit\":\"Unit\",\"units\":\"Units\",\"value\":\"Value\",\"total\":\"Total\",\"listTitle\":\"Resource List\",\"listDescription\":\"Manage, filter, and export the corporate inventory.\",\"addNewResource\":\"Add new resource\",\"resourceName\":\"Resource name\",\"filterAndSort\":\"Filter and sort\",\"idOrRange\":\"Exact ID or range (e.g.: 2, 3-6, -10, 5-)\",\"filterByResource\":\"Filter by Resource\",\"filterByCategory\":\"Filter by Category\",\"filterByInfo\":\"Filter by Information\",\"sortBy\":\"Sort by...\",\"clearFilters\":\"Clear filters\",\"export\":\"Export\",\"visible\":\"Visible\",\"all\":\"All\",\"photo\":\"Photo\",\"info\":\"Information\",\"additionalInfo\":\"Information (comment)\",\"add\":\"Add\",\"edit\":\"Edit\",\"delete\":\"Delete\",\"emptyStateTitle\":\"No data in table\",\"emptyStateDescription\":\"Add resources or adjust filters to view results.\",\"previous\":\"Previous\",\"next\":\"Next\",\"page\":\"Page\"},\"budget\":{\"title\":\"Budget Management\",\"createBudget\":\"Create Budget\",\"viewBudget\":\"View Budget\",\"total\":\"Total\",\"approved\":\"Approved\",\"pending\":\"Pending\",\"rejected\":\"Rejected\",\"budgetTitle\":\"Budget\",\"financialSummary\":\"Financial summary based on inventory resources (price × quantity).\",\"valueDistribution\":\"Value distribution by category\",\"topResources\":\"Top 10 resources by value\",\"categorySummary\":\"Summary by category\",\"categorySummaryCaption\":\"Consolidated quantities and estimated value according to the category division synchronized with inventory.\",\"distinctResources\":\"Distinct resources\",\"totalValue\":\"Total value\",\"currencyLegend\":\"Active currency\",\"currencyExample\":\"Format example: {value}\",\"currencyNoDecimals\":\"No decimals\",\"currencyDecimals\":\"{decimals} decimals\"},\"settings\":{\"title\":\"Settings\",\"profile\":\"Profile\",\"preferences\":\"Preferences\",\"security\":\"Security\",\"notifications\":\"Notifications\",\"appearance\":\"Appearance\",\"language\":\"Language\",\"accessibility\":\"Accessibility\",\"account\":\"ACCOUNT\",\"settingsCenter\":\"Settings Center\",\"settingsDescription\":\"Manage your profile as Servigenman manager and adjust the platform's appearance and accessibility.\",\"fullName\":\"Full name\",\"yourName\":\"Your name\",\"emailAddress\":\"Email address\",\"emailPlaceholder\":\"example@email.com\",\"changesSaved\":\"Changes saved successfully\",\"alsoManage\":\"You can also manage\",\"and\":\"and\",\"theme\":\"Theme\",\"fontSize\":\"Font size\",\"small\":\"Small\",\"medium\":\"Medium\",\"large\":\"Large\",\"currency\":\"Currency\",\"chileanPeso\":\"Chilean Peso (CLP)\",\"dollar\":\"Dollar (USD)\",\"euro\":\"Euro (EUR)\",\"reduceAnimations\":\"Reduce animations\",\"highContrast\":\"High contrast\",\"contrastLevel\":\"Contrast level\",\"interfaceSize\":\"Interface size\",\"uiScale\":\"UI Scale\",\"preferencesSaved\":\"Preferences saved (demo)\"},\"home\":{\"recentResources\":\"Recent Resources\",\"categoryOverview\":\"Category Overview\",\"quickStats\":\"Quick Stats\",\"totalResources\":\"Total Resources\",\"totalValue\":\"Total Value\",\"resources\":\"Resources\",\"quickAccess\":\"Quick Access\",\"goToInventory\":\"Go to Inventory\",\"exploreCategories\":\"Explore Categories\",\"viewBudget\":\"View Budget\",\"addResource\":\"Add Resource\",\"shortcuts\":\"Shortcuts\",\"lowStock\":\"Low Stock\",\"lastAdded\":\"Recently Added\",\"topExpense\":\"Top Expense\",\"badge\":\"Internal Portal v1.1\",\"heroTitle\":\"Comprehensive field resource tracking\",\"heroDescription\":\"Centralize the status of your critical assets, receive replenishment alerts, and coordinate technical teams with the visibility provided by the interactive inventory.\",\"goToInventoryCta\":\"Go to inventory\",\"viewFinancialSummary\":\"View financial summary\",\"managedResources\":\"Managed Resources\",\"managedResourcesCaption\":\"Information synchronized from warehouses and mobile crews.\",\"activeOrders\":\"Active Orders\",\"activeOrdersCaption\":\"Online coordination between technicians and regional supervisors.\",\"featuredResourcesTitle\":\"Featured inventory resources\",\"featuredResourcesDescription\":\"A quick sample of equipment prioritized for the next preventive maintenance.\",\"viewFullInventory\":\"View full inventory\",\"resource\":\"Resource\",\"unitValue\":\"Unit Value\",\"notes\":\"Notes\",\"categoryPlanningTitle\":\"Category Planning\",\"categoryPlanningDescription\":\"Explore the category carousel to segment resources, assign owners, and activate preconfigured filters for each area.\",\"budgetMonitoringTitle\":\"Budget Monitoring\",\"budgetMonitoringDescription\":\"Visualize the financial impact of supplies through charts and KPIs in the budget section.\",\"openBudget\":\"Open budget\",\"quarterlyExecution\":\"Quarterly execution\",\"quarterlyGoal\":\"Q2 Goal: 62%\",\"monthlyExpense\":\"Monthly expense\",\"monthLabel\":\"April 2024\",\"availableBalance\":\"Available balance\",\"reservedForEmergencies\":\"Reserved for emergencies\"},\"categories\":{\"title\":\"Categories\",\"description\":\"Click on a card to view only the resources of that category within the inventory.\",\"hint\":\"Update categories from inventory. Changes are automatically synchronized.\",\"exploreTitle\":\"Explore resources by category\",\"exploreDescription\":\"Navigate between the upper and lower carousels to identify trends, available quantities, and accumulated value for each segment.\",\"previous\":\"Previous\",\"next\":\"Next\",\"emptyState\":\"No categories registered yet. Add resources to the inventory to build this visual summary.\",\"footer\":\"Version 1.1 - Personal Portfolio Project\"}}"));}),
"[project]/src/lib/i18n.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTranslations",
    ()=>getTranslations,
    "useClientTranslations",
    ()=>useClientTranslations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$messages$2f$es$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/messages/es.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$messages$2f$en$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/messages/en.json (json)");
;
;
const translations = {
    es: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$messages$2f$es$2e$json__$28$json$29$__["default"],
    en: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$messages$2f$en$2e$json__$28$json$29$__["default"]
};
function getTranslations(locale = 'es') {
    return translations[locale] || translations.es;
}
function useClientTranslations(locale = 'es') {
    return getTranslations(locale);
}
}),
"[project]/src/contexts/LanguageContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function LanguageProvider({ children }) {
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('es');
    const [translations, setTranslations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTranslations"])('es'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Leer idioma de la cookie al iniciar
        const savedLocale = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('locale');
        if (savedLocale && (savedLocale === 'es' || savedLocale === 'en')) {
            setLocaleState(savedLocale);
            setTranslations((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTranslations"])(savedLocale));
        }
    }, []);
    const setLocale = (newLocale)=>{
        setLocaleState(newLocale);
        setTranslations((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTranslations"])(newLocale));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('locale', newLocale, {
            expires: 365
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            locale,
            setLocale,
            t: translations
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/LanguageContext.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
function useLanguage() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
"[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*! js-cookie v3.0.5 | MIT */ /* eslint-disable no-var */ __turbopack_context__.s([
    "default",
    ()=>api
]);
function assign(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i];
        for(var key in source){
            target[key] = source[key];
        }
    }
    return target;
}
/* eslint-enable no-var */ /* eslint-disable no-var */ var defaultConverter = {
    read: function(value) {
        if (value[0] === '"') {
            value = value.slice(1, -1);
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function(value) {
        return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
    }
};
/* eslint-enable no-var */ /* eslint-disable no-var */ function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
        if (typeof document === 'undefined') {
            return;
        }
        attributes = assign({}, defaultAttributes, attributes);
        if (typeof attributes.expires === 'number') {
            attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
        }
        if (attributes.expires) {
            attributes.expires = attributes.expires.toUTCString();
        }
        name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
        var stringifiedAttributes = '';
        for(var attributeName in attributes){
            if (!attributes[attributeName]) {
                continue;
            }
            stringifiedAttributes += '; ' + attributeName;
            if (attributes[attributeName] === true) {
                continue;
            }
            // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (";")
            //     character:
            // Consume the characters of the unparsed-attributes up to,
            // not including, the first %x3B (";") character.
            // ...
            stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
        }
        return document.cookie = name + '=' + converter.write(value, name) + stringifiedAttributes;
    }
    function get(name) {
        if (typeof document === 'undefined' || arguments.length && !name) {
            return;
        }
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var jar = {};
        for(var i = 0; i < cookies.length; i++){
            var parts = cookies[i].split('=');
            var value = parts.slice(1).join('=');
            try {
                var found = decodeURIComponent(parts[0]);
                jar[found] = converter.read(value, found);
                if (name === found) {
                    break;
                }
            } catch (e) {}
        }
        return name ? jar[name] : jar;
    }
    return Object.create({
        set,
        get,
        remove: function(name, attributes) {
            set(name, '', assign({}, attributes, {
                expires: -1
            }));
        },
        withAttributes: function(attributes) {
            return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function(converter) {
            return init(assign({}, this.converter, converter), this.attributes);
        }
    }, {
        attributes: {
            value: Object.freeze(defaultAttributes)
        },
        converter: {
            value: Object.freeze(converter)
        }
    });
}
var api = init(defaultConverter, {
    path: '/'
});
;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6dddb4a3._.js.map