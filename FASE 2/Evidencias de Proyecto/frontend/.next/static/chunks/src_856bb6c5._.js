(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/LanguageSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LanguageSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LanguageContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function LanguageSelector() {
    _s();
    const { locale, setLocale, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setLocale('es'),
                className: "px-4 py-2 rounded-md text-sm font-medium transition-all ".concat(locale === 'es' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'),
                title: "Español",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg",
                        children: "🇪🇸"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSelector.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2",
                        children: "ES"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSelector.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/LanguageSelector.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setLocale('en'),
                className: "px-4 py-2 rounded-md text-sm font-medium transition-all ".concat(locale === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'),
                title: "English",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg",
                        children: "🇺🇸"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSelector.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2",
                        children: "EN"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSelector.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/LanguageSelector.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LanguageSelector.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_s(LanguageSelector, "QuDHc5OP5OCt9T+RsBN8EaINh4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c = LanguageSelector;
var _c;
__turbopack_context__.k.register(_c, "LanguageSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AppHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LanguageSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LanguageSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LanguageContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function AppHeader() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const [isDeveloper, setIsDeveloper] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingCount, setPendingCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const apiBaseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AppHeader.useMemo[apiBaseUrl]": ()=>{
            var _process_env_NEXT_PUBLIC_API_URL, _process_env_NEXT_PUBLIC_BACKEND_URL;
            const sanitize = {
                "AppHeader.useMemo[apiBaseUrl].sanitize": (u)=>u.replace(/\/+$/, "")
            }["AppHeader.useMemo[apiBaseUrl].sanitize"];
            const env = ((_process_env_NEXT_PUBLIC_API_URL = ("TURBOPACK compile-time value", "http://localhost:8000")) === null || _process_env_NEXT_PUBLIC_API_URL === void 0 ? void 0 : _process_env_NEXT_PUBLIC_API_URL.trim()) || ((_process_env_NEXT_PUBLIC_BACKEND_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BACKEND_URL) === null || _process_env_NEXT_PUBLIC_BACKEND_URL === void 0 ? void 0 : _process_env_NEXT_PUBLIC_BACKEND_URL.trim());
            if (env) return sanitize(env);
            if ("TURBOPACK compile-time truthy", 1) {
                if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
                    return sanitize("http://localhost:8000");
                }
                return sanitize(window.location.origin);
            }
            //TURBOPACK unreachable
            ;
        }
    }["AppHeader.useMemo[apiBaseUrl]"], []);
    const handleLogout = async ()=>{
        try {
            await fetch("".concat(apiBaseUrl, "/api/logout/"), {
                method: "POST",
                credentials: "include"
            });
        } catch (e) {
        // ignore network errors
        } finally{
            try {
                document.cookie = "auth_ok=; Max-Age=0; path=/";
            } catch (e) {}
            window.location.href = "/login";
        }
    };
    // Theme switch (shared across pages)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppHeader.useEffect": ()=>{
            if (typeof document === "undefined") return;
            const body = document.body;
            const toggle = document.getElementById("themeSwitch");
            const label = document.getElementById("themeLabel");
            const root = document.documentElement;
            const apply = {
                "AppHeader.useEffect.apply": (dark)=>{
                    if (dark) {
                        body.setAttribute("data-theme", "dark");
                        try {
                            localStorage.setItem("theme", "dark");
                        } catch (e) {}
                        if (toggle) toggle.checked = true;
                        if (label) label.textContent = t.common.dark;
                    } else {
                        body.removeAttribute("data-theme");
                        try {
                            localStorage.setItem("theme", "light");
                        } catch (e) {}
                        if (toggle) toggle.checked = false;
                        if (label) label.textContent = t.common.light;
                    }
                }
            }["AppHeader.useEffect.apply"];
            // default to dark if not set
            const saved = ({
                "AppHeader.useEffect.saved": ()=>{
                    try {
                        return localStorage.getItem("theme");
                    } catch (e) {
                        return null;
                    }
                }
            })["AppHeader.useEffect.saved"]();
            apply(!saved || saved === "dark");
            // Apply font scale if present
            try {
                const fs = localStorage.getItem("ajustes_font_scale");
                if (fs) root.setAttribute("data-font-scale", fs);
            } catch (e) {}
            if (toggle) {
                const onChange = {
                    "AppHeader.useEffect.onChange": ()=>apply(toggle.checked)
                }["AppHeader.useEffect.onChange"];
                toggle.addEventListener("change", onChange);
                return ({
                    "AppHeader.useEffect": ()=>toggle.removeEventListener("change", onChange)
                })["AppHeader.useEffect"];
            }
            return ({
                "AppHeader.useEffect": ()=>{}
            })["AppHeader.useEffect"];
        }
    }["AppHeader.useEffect"], []);
    // Load current user role to conditionally render Papelera link
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppHeader.useEffect": ()=>{
            let aborted = false;
            async function load() {
                try {
                    var _data_user;
                    const res = await fetch("".concat(apiBaseUrl, "/api/me/"), {
                        credentials: "include"
                    });
                    if (!res.ok) return;
                    const data = await res.json();
                    if (!aborted) setIsDeveloper(Boolean(data === null || data === void 0 ? void 0 : (_data_user = data.user) === null || _data_user === void 0 ? void 0 : _data_user.is_developer));
                } catch (e) {}
            }
            if (apiBaseUrl) void load();
            return ({
                "AppHeader.useEffect": ()=>{
                    aborted = true;
                }
            })["AppHeader.useEffect"];
        }
    }["AppHeader.useEffect"], [
        apiBaseUrl
    ]);
    // Pending count polling (developers only)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppHeader.useEffect": ()=>{
            if (!isDeveloper || !apiBaseUrl) return;
            let aborted = false;
            const getCount = {
                "AppHeader.useEffect.getCount": async ()=>{
                    try {
                        const r = await fetch("".concat(apiBaseUrl, "/api/inventory/pending/count/"), {
                            credentials: "include"
                        });
                        if (!r.ok) return;
                        const d = await r.json();
                        var _d_pending;
                        if (!aborted) setPendingCount(Number((_d_pending = d === null || d === void 0 ? void 0 : d.pending) !== null && _d_pending !== void 0 ? _d_pending : 0));
                    } catch (e) {}
                }
            }["AppHeader.useEffect.getCount"];
            void getCount();
            const timer = setInterval(getCount, 15000);
            return ({
                "AppHeader.useEffect": ()=>{
                    aborted = true;
                    clearInterval(timer);
                }
            })["AppHeader.useEffect"];
        }
    }["AppHeader.useEffect"], [
        isDeveloper,
        apiBaseUrl
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "inventory-header",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "inventory-header__inner",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "header-bar",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: t.header.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppHeader.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "header-actions",
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LanguageSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    id: "themeSwitch",
                                    hidden: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "themeSwitch",
                                    className: "switch",
                                    "aria-label": t.common.theme
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    id: "themeLabel",
                                    className: "theme-label",
                                    children: t.common.light
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleLogout,
                                    style: {
                                        padding: "8px 12px",
                                        borderRadius: 10,
                                        border: "1px solid rgba(255,255,255,.12)",
                                        background: "linear-gradient(90deg,#7b5cff,#26c4ff)",
                                        color: "#fff",
                                        fontWeight: 700,
                                        cursor: "pointer"
                                    },
                                    "aria-label": t.common.logout,
                                    title: t.common.logout,
                                    children: t.common.logout
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/AppHeader.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/AppHeader.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/inicio",
                                    children: t.common.home
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 141,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppHeader.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/inventario",
                                    children: t.common.inventory
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 142,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppHeader.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            isDeveloper && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/inventario/papelera",
                                    children: [
                                        "Papelera",
                                        typeof pendingCount === "number" && pendingCount > 0 ? " (".concat(pendingCount, ")") : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppHeader.tsx",
                                lineNumber: 144,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/categorias",
                                    children: t.common.categories
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 150,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppHeader.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/presupuesto",
                                    children: t.common.budget
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 151,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppHeader.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/ajustes",
                                    children: t.common.settings
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppHeader.tsx",
                                    lineNumber: 152,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppHeader.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AppHeader.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/AppHeader.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AppHeader.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/AppHeader.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_s(AppHeader, "aQShsix8gKz72fdpCVhcqcFU5bk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c = AppHeader;
var _c;
__turbopack_context__.k.register(_c, "AppHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AppFooter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function AppFooter() {
    const year = new Date().getFullYear();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "inventory-footer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: [
                "© ",
                year,
                " Servigenman — Uso exclusivo del personal autorizado ·",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "mailto:soporte@servigenman.cl",
                    children: " soporte@servigenman.cl"
                }, void 0, false, {
                    fileName: "[project]/src/components/AppFooter.tsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AppFooter.tsx",
            lineNumber: 7,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/AppFooter.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = AppFooter;
var _c;
__turbopack_context__.k.register(_c, "AppFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(auth)/login/components/AnimatedBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnimatedBackground",
    ()=>AnimatedBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function AnimatedBackground() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "waves",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "waves-svg",
                    viewBox: "0 0 1440 900",
                    preserveAspectRatio: "none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                    id: "gA",
                                    x1: "0%",
                                    y1: "0%",
                                    x2: "100%",
                                    y2: "0%",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "0%",
                                            stopColor: "var(--wave-a)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                                            lineNumber: 8,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "100%",
                                            stopColor: "var(--wave-b)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                                            lineNumber: 9,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                                    lineNumber: 7,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                    id: "gB",
                                    x1: "100%",
                                    y1: "0%",
                                    x2: "0%",
                                    y2: "0%",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "0%",
                                            stopColor: "var(--wave-b)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                                            lineNumber: 12,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "100%",
                                            stopColor: "var(--wave-a)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                                            lineNumber: 13,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                                    lineNumber: 11,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 6,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "wave slow",
                            stroke: "url(#gA)",
                            d: "M0,130 C180,110 300,85 520,95 C740,105 900,145 1080,135 C1260,125 1360,100 1440,110"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "wave mid",
                            stroke: "url(#gB)",
                            d: "M0,450 C220,430 360,410 580,420 C800,430 980,470 1140,460 C1300,450 1380,420 1440,430"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "wave",
                            stroke: "url(#gA)",
                            d: "M0,760 C200,740 340,740 560,740 C780,740 960,770 1120,760 C1280,750 1380,730 1440,740"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                    lineNumber: 5,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "circuit",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    viewBox: "0 0 1440 900",
                    preserveAspectRatio: "none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "trace",
                            d: "M80 160 H360 L520 260 H780 L980 200 H1320"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "node",
                            cx: "360",
                            cy: "160",
                            r: "3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "node",
                            cx: "520",
                            cy: "260",
                            r: "3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "node",
                            cx: "980",
                            cy: "200",
                            r: "3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "trace",
                            d: "M120 620 H400 L540 540 L740 560 L980 520 L1300 560"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "node",
                            cx: "400",
                            cy: "620",
                            r: "3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "node",
                            cx: "740",
                            cy: "560",
                            r: "3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "trace",
                            d: "M100 360 L260 360 L420 300 L700 300 L860 360 L1120 340 L1340 380"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "node",
                            cx: "260",
                            cy: "360",
                            r: "3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "node",
                            cx: "700",
                            cy: "300",
                            r: "3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "node",
                            cx: "1120",
                            cy: "340",
                            r: "3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "noise",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rays",
                id: "rays",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/app/(auth)/login/components/AnimatedBackground.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = AnimatedBackground;
var _c;
__turbopack_context__.k.register(_c, "AnimatedBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(auth)/login/hooks/useBodyClass.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBodyClass",
    ()=>useBodyClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useBodyClass() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBodyClass.useEffect": ()=>{
            if (typeof document === "undefined") {
                return;
            }
            const bodyClass = "servigenman-login";
            const htmlClass = "servigenman-login-root";
            document.body.classList.add(bodyClass);
            document.documentElement.classList.add(htmlClass);
            return ({
                "useBodyClass.useEffect": ()=>{
                    document.body.classList.remove(bodyClass);
                    document.documentElement.classList.remove(htmlClass);
                }
            })["useBodyClass.useEffect"];
        }
    }["useBodyClass.useEffect"], []);
}
_s(useBodyClass, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/inventario/interaction.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializeInventoryPage",
    ()=>initializeInventoryPage
]);
const INVENTORY_KEY = "inventarioData";
const CATS_KEY = "categoriasInventario";
// Backend base URL (override at build time with NEXT_PUBLIC_BACKEND_URL)
// In the browser we prefer same-origin calls (Next.js rewrite to backend) to carry cookies properly.
const BACKEND_URL = ("TURBOPACK compile-time truthy", 1) ? "" // same-origin: rely on Next.js rewrite for /api/*
 : "TURBOPACK unreachable";
async function backendFetch(path, options) {
    const base = BACKEND_URL.replace(/\/$/, "");
    const url = "".concat(base).concat(path);
    return fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options === null || options === void 0 ? void 0 : options.headers) || {}
        },
        ...options
    });
}
async function apiListItems() {
    try {
        const res = await backendFetch("/api/inventory/items/", {
            method: "GET"
        });
        if (!res.ok) return null;
        const data = await res.json();
        return Array.isArray(data === null || data === void 0 ? void 0 : data.results) ? data.results : null;
    } catch (e) {
        return null;
    }
}
async function apiCreateItem(payload) {
    try {
        const res = await backendFetch("/api/inventory/items/", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.pending) {
            try {
                alert("Creación enviada para aprobación del desarrollador.");
            } catch (e) {}
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
}
async function apiUpdateItem(id, payload) {
    try {
        const res = await backendFetch("/api/inventory/items/".concat(id, "/"), {
            method: "PUT",
            body: JSON.stringify(payload)
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.pending) {
            try {
                alert("Edición enviada para aprobación del desarrollador.");
            } catch (e) {}
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
}
async function apiDeleteItem(id) {
    try {
        const res = await backendFetch("/api/inventory/items/".concat(id, "/"), {
            method: "DELETE"
        });
        if (!res.ok) return false;
        try {
            const data = await res.json();
            if (data && data.pending) {
                alert("Eliminación enviada para aprobación del desarrollador.");
            }
        } catch (e) {}
        return true;
    } catch (e) {
        return false;
    }
}
const filasPorPagina = 10;
let paginaActual = 1;
let currentEditingRow = null;
function showEditToolbar(row) {
    currentEditingRow = row;
    let bar = document.getElementById("editToolbar");
    if (!bar) {
        bar = document.createElement("div");
        bar.id = "editToolbar";
        bar.className = "edit-toolbar";
        bar.innerHTML = '\n      <div class="edit-toolbar__inner">\n        <span class="edit-toolbar__label">Editando recurso</span>\n        <div class="edit-toolbar__actions">\n          <button type="button" id="editToolbarSave" class="edit-toolbar__btn primary">Guardar cambios</button>\n          <button type="button" id="editToolbarCancel" class="edit-toolbar__btn">Cancelar</button>\n        </div>\n      </div>';
        document.body.appendChild(bar);
    }
    const save = document.getElementById("editToolbarSave");
    const cancel = document.getElementById("editToolbarCancel");
    if (save) {
        save.onclick = ()=>{
            const btn = currentEditingRow === null || currentEditingRow === void 0 ? void 0 : currentEditingRow.querySelector('button[data-action="save"]');
            if (btn) void guardarFila(btn);
        };
    }
    if (cancel) {
        cancel.onclick = ()=>{
            const btn = currentEditingRow === null || currentEditingRow === void 0 ? void 0 : currentEditingRow.querySelector('button[data-action="cancel"]');
            if (btn) cancelarEdicion(btn);
        };
    }
    bar.style.display = "block";
}
function hideEditToolbar() {
    const bar = document.getElementById("editToolbar");
    if (bar) bar.style.display = "none";
    currentEditingRow = null;
}
function initializeInventoryPage() {
    if (typeof document === "undefined") {
        return ()=>{};
    }
    const cleanupFns = [];
    // Try backend first; fallback to local storage / DOM
    void bootstrapInventario();
    ordenarTabla();
    filtrarTabla({
        resetPage: true
    });
    paginaActual = 1;
    actualizarPaginacion();
    initCategoriasDesdeTablaYListas();
    aplicarPresetCategoria();
    const form = document.getElementById("formAgregar");
    if (form) {
        const submitHandler = (event)=>{
            void agregarRecurso(event);
        };
        form.addEventListener("submit", submitHandler);
        cleanupFns.push(()=>form.removeEventListener("submit", submitHandler));
    }
    const filtroInputs = [
        [
            "filtroIdRango",
            "input"
        ],
        [
            "filtroRecurso",
            "input"
        ],
        [
            "filtroCategoria",
            "input"
        ],
        [
            "filtroInfo",
            "input"
        ],
        [
            "ordenarPor",
            "change"
        ]
    ];
    filtroInputs.forEach((param)=>{
        let [id, evt] = param;
        const element = document.getElementById(id);
        if (!element) return;
        if (id === "ordenarPor") {
            const handler = ()=>{
                ordenarTabla();
                actualizarPaginacion();
            };
            element.addEventListener(evt, handler);
            cleanupFns.push(()=>element.removeEventListener(evt, handler));
            return;
        }
        if (id === "filtroRecurso") {
            const handler = ()=>{
                actualizarSugerencias();
                filtrarTabla({
                    resetPage: true
                });
            };
            element.addEventListener(evt, handler);
            cleanupFns.push(()=>element.removeEventListener(evt, handler));
            return;
        }
        const handler = ()=>filtrarTabla({
                resetPage: true
            });
        element.addEventListener(evt, handler);
        cleanupFns.push(()=>element.removeEventListener(evt, handler));
    });
    const botonLimpiar = document.querySelector("#filtros .boton-limpiar");
    if (botonLimpiar) {
        const handler = ()=>limpiarFiltros();
        botonLimpiar.addEventListener("click", handler);
        cleanupFns.push(()=>botonLimpiar.removeEventListener("click", handler));
    }
    const exportToggle = document.querySelector(".boton-exportar");
    if (exportToggle) {
        const handler = ()=>toggleExportMenu();
        exportToggle.addEventListener("click", handler);
        cleanupFns.push(()=>exportToggle.removeEventListener("click", handler));
    }
    const submenuButtons = Array.from(document.querySelectorAll(".submenu-btn"));
    submenuButtons.forEach((button)=>{
        const handler = ()=>{
            const submenuId = button.dataset.submenu;
            if (submenuId) {
                toggleSubmenu(submenuId);
            }
        };
        button.addEventListener("click", handler);
        cleanupFns.push(()=>button.removeEventListener("click", handler));
    });
    const exportLinks = Array.from(document.querySelectorAll("[data-export]"));
    exportLinks.forEach((link)=>{
        const handler = (event)=>{
            event.preventDefault();
            const action = link.dataset.export;
            if (!action) return;
            if (action === "excel-visible") {
                exportarExcel("visible");
            } else if (action === "excel-todo") {
                exportarExcel("todo");
            } else if (action === "csv-visible") {
                exportarCSV("visible");
            } else if (action === "csv-todo") {
                exportarCSV("todo");
            }
            closeAllMenus();
        };
        link.addEventListener("click", handler);
        cleanupFns.push(()=>link.removeEventListener("click", handler));
    });
    const exportContainer = document.querySelector(".exportar-dropdown");
    if (exportContainer) {
        const handler = (event)=>{
            if (!(event.target instanceof Node)) return;
            if (!event.target.closest(".exportar-dropdown")) {
                closeAllMenus();
            }
        };
        document.addEventListener("click", handler);
        cleanupFns.push(()=>document.removeEventListener("click", handler));
    }
    const btnPrev = document.getElementById("btnAnterior");
    if (btnPrev) {
        const handler = ()=>cambiarPagina(-1);
        btnPrev.addEventListener("click", handler);
        cleanupFns.push(()=>btnPrev.removeEventListener("click", handler));
    }
    const btnNext = document.getElementById("btnSiguiente");
    if (btnNext) {
        const handler = ()=>cambiarPagina(1);
        btnNext.addEventListener("click", handler);
        cleanupFns.push(()=>btnNext.removeEventListener("click", handler));
    }
    const themeSwitch = document.getElementById("themeSwitch");
    if (themeSwitch) {
        const handler = ()=>updateTheme(themeSwitch.checked);
        themeSwitch.addEventListener("change", handler);
        cleanupFns.push(()=>themeSwitch.removeEventListener("change", handler));
        applyStoredTheme();
    }
    const filtroRecurso = document.getElementById("filtroRecurso");
    if (filtroRecurso) {
        const handler = (event)=>{
            const target = event.target;
            if (!target.closest("#sugerenciasRecurso")) {
                const sug = document.getElementById("sugerenciasRecurso");
                if (sug) {
                    sug.innerHTML = "";
                    sug.className = "autocomplete-box";
                }
            }
        };
        document.addEventListener("click", handler);
        cleanupFns.push(()=>document.removeEventListener("click", handler));
    }
    const tabla = document.querySelector("#tablaRecursos");
    if (tabla) {
        const handler = (event)=>{
            const target = event.target;
            if (!(target instanceof HTMLButtonElement)) return;
            const action = target.dataset.action;
            if (!action) return;
            if (action === "edit") {
                editarFila(target);
            } else if (action === "delete") {
                eliminarFila(target);
            } else if (action === "save") {
                void guardarFila(target);
            } else if (action === "cancel") {
                cancelarEdicion(target);
            }
        };
        tabla.addEventListener("click", handler);
        cleanupFns.push(()=>tabla.removeEventListener("click", handler));
    }
    // Listen for currency changes
    const currencyChangeHandler = (event)=>{
        if (event.key === 'ajustes_currency') {
            // Refresh table to update currency formatting
            actualizarPaginacion();
        }
    };
    window.addEventListener('storage', currencyChangeHandler);
    cleanupFns.push(()=>window.removeEventListener('storage', currencyChangeHandler));
    return ()=>{
        cleanupFns.forEach((fn)=>fn());
    };
}
function getXLSX() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    var _XLSX;
    return (_XLSX = window.XLSX) !== null && _XLSX !== void 0 ? _XLSX : null;
}
function loadJSON(key, defVal) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defVal;
    } catch (error) {
        console.error("Error parsing storage", error);
        return defVal;
    }
}
function saveJSON(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (error) {
        console.error("Error saving storage", error);
    }
}
function readFileAsDataURL(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve(String(reader.result));
        reader.onerror = ()=>reject(reader.error);
        reader.readAsDataURL(file);
    });
}
function nextIdFromStorage() {
    const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
    return arr.reduce((max, item)=>Math.max(max, item.id || 0), 0) + 1;
}
function renderInventarioToDOM(arr) {
    const tbody = document.querySelector("#tablaRecursos tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    arr.forEach((item)=>{
        const tr = document.createElement("tr");
        tr.dataset.match = "1";
        var _item_cantidad, _item_precio, _item_precio1;
        tr.innerHTML = "\n      <td>".concat(item.id, "</td>\n      <td>").concat(item.recurso, "</td>\n      <td>").concat(item.categoria, "</td>\n      <td>").concat((_item_cantidad = item.cantidad) !== null && _item_cantidad !== void 0 ? _item_cantidad : 0, '</td>\n      <td data-precio="').concat((_item_precio = item.precio) !== null && _item_precio !== void 0 ? _item_precio : 0, '">').concat(formatCurrency((_item_precio1 = item.precio) !== null && _item_precio1 !== void 0 ? _item_precio1 : 0), '</td>\n      <td data-foto="').concat(item.foto ? "1" : "", '">\n        ').concat(item.foto ? '<img class="thumb" src="'.concat(item.foto, '" alt="" />') : "", "\n      </td>\n      <td>").concat(item.info ? item.info : "", '</td>\n      <td>\n        <div class="tabla-acciones">\n          <button type="button" class="boton-editar" data-action="edit">Editar</button>\n          <button type="button" class="boton-eliminar" data-action="delete">Eliminar</button>\n        </div>\n      </td>');
        tbody.appendChild(tr);
    });
    toggleEmptyState(arr.length === 0);
}
function snapshotInventarioDesdeTabla() {
    const rows = Array.from(document.querySelectorAll("#tablaRecursos tbody tr"));
    return rows.map((tr)=>{
        var _tds_, _tds_1, _tds_2, _tds_3, _tds_4, _tds_5, _tds_6;
        const tds = tr.querySelectorAll("td");
        const img = (_tds_ = tds[5]) === null || _tds_ === void 0 ? void 0 : _tds_.querySelector("img");
        var _tds__innerText, _tds__innerText_trim, _tds__innerText_trim1, _img_src, _tds__innerText_trim2;
        return {
            id: Number.parseInt((_tds__innerText = (_tds_1 = tds[0]) === null || _tds_1 === void 0 ? void 0 : _tds_1.innerText) !== null && _tds__innerText !== void 0 ? _tds__innerText : "0", 10),
            recurso: (_tds__innerText_trim = (_tds_2 = tds[1]) === null || _tds_2 === void 0 ? void 0 : _tds_2.innerText.trim()) !== null && _tds__innerText_trim !== void 0 ? _tds__innerText_trim : "",
            categoria: (_tds__innerText_trim1 = (_tds_3 = tds[2]) === null || _tds_3 === void 0 ? void 0 : _tds_3.innerText.trim()) !== null && _tds__innerText_trim1 !== void 0 ? _tds__innerText_trim1 : "",
            cantidad: Number.parseInt(((_tds_4 = tds[3]) === null || _tds_4 === void 0 ? void 0 : _tds_4.innerText) || "0", 10) || 0,
            precio: Number.parseFloat(((_tds_5 = tds[4]) === null || _tds_5 === void 0 ? void 0 : _tds_5.getAttribute("data-precio")) || "0") || 0,
            foto: (_img_src = img === null || img === void 0 ? void 0 : img.src) !== null && _img_src !== void 0 ? _img_src : "",
            info: (_tds__innerText_trim2 = (_tds_6 = tds[6]) === null || _tds_6 === void 0 ? void 0 : _tds_6.innerText.trim()) !== null && _tds__innerText_trim2 !== void 0 ? _tds__innerText_trim2 : ""
        };
    });
}
function persistInventario() {
    const items = snapshotInventarioDesdeTabla();
    saveJSON(INVENTORY_KEY, items);
}
async function bootstrapInventario() {
    const fromApi = await apiListItems();
    let data = null;
    if (Array.isArray(fromApi)) {
        data = fromApi;
        saveJSON(INVENTORY_KEY, data);
    } else {
        data = loadJSON(INVENTORY_KEY, null);
        if (!Array.isArray(data) || !data.length) {
            data = snapshotInventarioDesdeTabla();
            saveJSON(INVENTORY_KEY, data);
        }
    }
    renderInventarioToDOM(data);
    const cats = loadJSON(CATS_KEY, null);
    if (!Array.isArray(cats) || !cats.length) {
        const set = new Set((data !== null && data !== void 0 ? data : []).map((item)=>item === null || item === void 0 ? void 0 : item.categoria).filter((value)=>Boolean(value)));
        saveJSON(CATS_KEY, Array.from(set).sort((a, b)=>a.localeCompare(b, "es")));
    }
}
function filtrarTabla() {
    let { resetPage = true } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _this, _this1, _this2, _this3;
    var _value_trim;
    const inputIdRango = (_value_trim = (_this = document.getElementById("filtroIdRango")) === null || _this === void 0 ? void 0 : _this.value.trim()) !== null && _value_trim !== void 0 ? _value_trim : "";
    let idExacto = null;
    let idDesde = null;
    let idHasta = null;
    if (inputIdRango.includes("-")) {
        const partes = inputIdRango.split("-");
        if (partes[0] !== "" && !Number.isNaN(Number(partes[0]))) {
            idDesde = Number.parseInt(partes[0], 10);
        }
        if (partes[1] !== "" && !Number.isNaN(Number(partes[1]))) {
            idHasta = Number.parseInt(partes[1], 10);
        }
    } else if (!Number.isNaN(Number(inputIdRango)) && inputIdRango !== "") {
        idExacto = Number.parseInt(inputIdRango, 10);
    }
    const inputRecurso = (((_this1 = document.getElementById("filtroRecurso")) === null || _this1 === void 0 ? void 0 : _this1.value) || "").toLowerCase();
    const inputCategoria = (((_this2 = document.getElementById("filtroCategoria")) === null || _this2 === void 0 ? void 0 : _this2.value) || "").toLowerCase();
    const inputInfo = (((_this3 = document.getElementById("filtroInfo")) === null || _this3 === void 0 ? void 0 : _this3.value) || "").toLowerCase();
    const filas = document.querySelectorAll("#tablaRecursos tbody tr");
    filas.forEach((fila)=>{
        var _fila_cells_, _fila_cells_1, _fila_cells_2, _fila_cells_3;
        var _fila_cells__innerText;
        const celdaId = Number.parseInt((_fila_cells__innerText = (_fila_cells_ = fila.cells[0]) === null || _fila_cells_ === void 0 ? void 0 : _fila_cells_.innerText) !== null && _fila_cells__innerText !== void 0 ? _fila_cells__innerText : "0", 10);
        var _fila_cells__innerText_toLowerCase;
        const celdaRecurso = (_fila_cells__innerText_toLowerCase = (_fila_cells_1 = fila.cells[1]) === null || _fila_cells_1 === void 0 ? void 0 : _fila_cells_1.innerText.toLowerCase()) !== null && _fila_cells__innerText_toLowerCase !== void 0 ? _fila_cells__innerText_toLowerCase : "";
        var _fila_cells__innerText_toLowerCase1;
        const celdaCategoria = (_fila_cells__innerText_toLowerCase1 = (_fila_cells_2 = fila.cells[2]) === null || _fila_cells_2 === void 0 ? void 0 : _fila_cells_2.innerText.toLowerCase()) !== null && _fila_cells__innerText_toLowerCase1 !== void 0 ? _fila_cells__innerText_toLowerCase1 : "";
        var _fila_cells__innerText_toLowerCase2;
        const celdaInfo = (_fila_cells__innerText_toLowerCase2 = (_fila_cells_3 = fila.cells[6]) === null || _fila_cells_3 === void 0 ? void 0 : _fila_cells_3.innerText.toLowerCase()) !== null && _fila_cells__innerText_toLowerCase2 !== void 0 ? _fila_cells__innerText_toLowerCase2 : "";
        const coincideId = (idExacto === null || celdaId === idExacto) && (idDesde === null || celdaId >= idDesde) && (idHasta === null || celdaId <= idHasta);
        const mostrar = coincideId && celdaRecurso.includes(inputRecurso) && celdaCategoria.includes(inputCategoria) && celdaInfo.includes(inputInfo);
        fila.dataset.match = mostrar ? "1" : "0";
        fila.style.display = mostrar ? "" : "none";
    });
    if (resetPage) paginaActual = 1;
    actualizarPaginacion();
    persistInventario();
    const visibles = document.querySelectorAll("#tablaRecursos tbody tr[data-match='1']").length;
    toggleEmptyState(visibles === 0);
}
function ordenarTabla() {
    const sel = document.getElementById("ordenarPor");
    if (!sel) return;
    const criterio = sel.value;
    const tbody = document.querySelector("#tablaRecursos tbody");
    if (!tbody) return;
    const filas = Array.from(tbody.querySelectorAll("tr"));
    let columnaIndex = 0;
    let ascendente = true;
    switch(criterio){
        case "id-asc":
            columnaIndex = 0;
            ascendente = true;
            break;
        case "id-desc":
            columnaIndex = 0;
            ascendente = false;
            break;
        case "recurso-asc":
            columnaIndex = 1;
            ascendente = true;
            break;
        case "recurso-desc":
            columnaIndex = 1;
            ascendente = false;
            break;
        case "categoria-asc":
            columnaIndex = 2;
            ascendente = true;
            break;
        case "categoria-desc":
            columnaIndex = 2;
            ascendente = false;
            break;
        case "cantidad-asc":
            columnaIndex = 3;
            ascendente = true;
            break;
        case "cantidad-desc":
            columnaIndex = 3;
            ascendente = false;
            break;
        case "precio-asc":
            columnaIndex = 4;
            ascendente = true;
            break;
        case "precio-desc":
            columnaIndex = 4;
            ascendente = false;
            break;
        default:
            return;
    }
    filas.sort((a, b)=>{
        var _a_cells_columnaIndex, _b_cells_columnaIndex;
        var _a_cells_columnaIndex_innerText_trim_toLowerCase;
        const valorA = (_a_cells_columnaIndex_innerText_trim_toLowerCase = (_a_cells_columnaIndex = a.cells[columnaIndex]) === null || _a_cells_columnaIndex === void 0 ? void 0 : _a_cells_columnaIndex.innerText.trim().toLowerCase()) !== null && _a_cells_columnaIndex_innerText_trim_toLowerCase !== void 0 ? _a_cells_columnaIndex_innerText_trim_toLowerCase : "";
        var _b_cells_columnaIndex_innerText_trim_toLowerCase;
        const valorB = (_b_cells_columnaIndex_innerText_trim_toLowerCase = (_b_cells_columnaIndex = b.cells[columnaIndex]) === null || _b_cells_columnaIndex === void 0 ? void 0 : _b_cells_columnaIndex.innerText.trim().toLowerCase()) !== null && _b_cells_columnaIndex_innerText_trim_toLowerCase !== void 0 ? _b_cells_columnaIndex_innerText_trim_toLowerCase : "";
        if ([
            0,
            3,
            4
        ].includes(columnaIndex)) {
            const numA = Number.parseFloat(valorA.replace(",", ".")) || 0;
            const numB = Number.parseFloat(valorB.replace(",", ".")) || 0;
            return ascendente ? numA - numB : numB - numA;
        }
        if (valorA < valorB) return ascendente ? -1 : 1;
        if (valorA > valorB) return ascendente ? 1 : -1;
        return 0;
    });
    filas.forEach((fila)=>tbody.appendChild(fila));
    persistInventario();
}
function limpiarFiltros() {
    const ids = [
        "filtroIdRango",
        "filtroRecurso",
        "filtroCategoria",
        "filtroInfo"
    ];
    ids.forEach((id)=>{
        const element = document.getElementById(id);
        if (element) element.value = "";
    });
    const sugerencias = document.getElementById("sugerenciasRecurso");
    if (sugerencias) sugerencias.innerHTML = "";
    filtrarTabla();
}
function actualizarSugerencias() {
    const recursoInput = document.getElementById("filtroRecurso");
    const sugerenciasDiv = document.getElementById("sugerenciasRecurso");
    if (!recursoInput || !sugerenciasDiv) return;
    const texto = recursoInput.value.toLowerCase();
    sugerenciasDiv.innerHTML = "";
    if (texto.length < 2) {
        sugerenciasDiv.className = "autocomplete-box";
        return;
    }
    sugerenciasDiv.className = "autocomplete-box show";
    const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
    const recursosUnicos = Array.from(new Set(arr.map((item)=>item.recurso))).sort((a, b)=>a.localeCompare(b, "es"));
    const sugerencias = recursosUnicos.filter((recurso)=>recurso.toLowerCase().includes(texto)).slice(0, 12);
    sugerencias.forEach((opcion)=>{
        const div = document.createElement("div");
        div.className = "sugerencia-item";
        const regex = new RegExp("(".concat(texto, ")"), "gi");
        div.innerHTML = opcion.replace(regex, "<strong>$1</strong>");
        div.addEventListener("click", ()=>{
            recursoInput.value = opcion;
            sugerenciasDiv.innerHTML = "";
            sugerenciasDiv.className = "autocomplete-box";
            filtrarTabla({
                resetPage: true
            });
        });
        sugerenciasDiv.appendChild(div);
    });
}
function editarFila(button) {
    var _celdas_, _celdas_1, _celdas_2, _celdas_3, _celdas_4, _celdas__querySelector, _celdas_5, _celdas_6;
    const fila = button.closest("tr");
    if (!fila) return;
    const celdas = fila.querySelectorAll("td");
    var _celdas__innerText, _celdas__innerText1, _celdas__innerText2, _celdas__innerText3, _celdas__getAttribute, _celdas__querySelector_src, _celdas__innerText4;
    const original = {
        recurso: (_celdas__innerText = (_celdas_ = celdas[1]) === null || _celdas_ === void 0 ? void 0 : _celdas_.innerText) !== null && _celdas__innerText !== void 0 ? _celdas__innerText : "",
        categoria: (_celdas__innerText1 = (_celdas_1 = celdas[2]) === null || _celdas_1 === void 0 ? void 0 : _celdas_1.innerText) !== null && _celdas__innerText1 !== void 0 ? _celdas__innerText1 : "",
        cantidad: (_celdas__innerText2 = (_celdas_2 = celdas[3]) === null || _celdas_2 === void 0 ? void 0 : _celdas_2.innerText) !== null && _celdas__innerText2 !== void 0 ? _celdas__innerText2 : "0",
        precioText: (_celdas__innerText3 = (_celdas_3 = celdas[4]) === null || _celdas_3 === void 0 ? void 0 : _celdas_3.innerText) !== null && _celdas__innerText3 !== void 0 ? _celdas__innerText3 : "0",
        precioRaw: (_celdas__getAttribute = (_celdas_4 = celdas[4]) === null || _celdas_4 === void 0 ? void 0 : _celdas_4.getAttribute("data-precio")) !== null && _celdas__getAttribute !== void 0 ? _celdas__getAttribute : "0",
        imgSrc: (_celdas__querySelector_src = (_celdas_5 = celdas[5]) === null || _celdas_5 === void 0 ? void 0 : (_celdas__querySelector = _celdas_5.querySelector("img")) === null || _celdas__querySelector === void 0 ? void 0 : _celdas__querySelector.src) !== null && _celdas__querySelector_src !== void 0 ? _celdas__querySelector_src : "",
        info: (_celdas__innerText4 = (_celdas_6 = celdas[6]) === null || _celdas_6 === void 0 ? void 0 : _celdas_6.innerText) !== null && _celdas__innerText4 !== void 0 ? _celdas__innerText4 : ""
    };
    fila.dataset.original = JSON.stringify(original);
    celdas[1].innerHTML = '<input type="text" value="'.concat(original.recurso, '" class="editar-input" />');
    celdas[2].innerHTML = '<input type="text" value="'.concat(original.categoria, '" class="editar-input" />');
    celdas[3].innerHTML = '<input type="number" value="'.concat(original.cantidad, '" min="0" step="1" class="editar-input" />');
    celdas[4].innerHTML = '<input type="number" value="'.concat(Number.parseFloat(original.precioRaw) || 0, '" min="0" step="0.01" class="editar-input precio" />');
    celdas[5].innerHTML = "\n    <div>\n      ".concat(original.imgSrc ? '<img class="thumb" src="'.concat(original.imgSrc, '" alt="" />') : '<img class="thumb" src="" alt="" />', '\n      <input type="file" class="editar-foto" accept="image/*" style="display:block; margin-top:6px;" />\n    </div>');
    celdas[6].innerHTML = '<input type="text" value="'.concat(original.info, '" class="editar-input info" />');
    celdas[7].innerHTML = '\n    <div class="tabla-acciones">\n      <button type="button" class="boton-guardar" data-action="save">Guardar</button>\n      <button type="button" class="boton-cancelar" data-action="cancel">Cancelar</button>\n    </div>';
    showEditToolbar(fila);
}
async function guardarFila(button) {
    var _celdas__querySelector, _celdas_, _celdas__querySelector1, _celdas_1, _celdas__querySelector2, _celdas_2, _celdas__querySelector3, _celdas_3, _celdas_4, _celdas_5, _celdas__querySelector4, _celdas_6, _celdas_7;
    const fila = button.closest("tr");
    if (!fila) return;
    const celdas = fila.querySelectorAll("td");
    var _celdas__querySelector_value_trim;
    const nuevoRecurso = (_celdas__querySelector_value_trim = (_celdas_ = celdas[1]) === null || _celdas_ === void 0 ? void 0 : (_celdas__querySelector = _celdas_.querySelector("input")) === null || _celdas__querySelector === void 0 ? void 0 : _celdas__querySelector.value.trim()) !== null && _celdas__querySelector_value_trim !== void 0 ? _celdas__querySelector_value_trim : "";
    var _celdas__querySelector_value_trim1;
    const nuevaCategoria = (_celdas__querySelector_value_trim1 = (_celdas_1 = celdas[2]) === null || _celdas_1 === void 0 ? void 0 : (_celdas__querySelector1 = _celdas_1.querySelector("input")) === null || _celdas__querySelector1 === void 0 ? void 0 : _celdas__querySelector1.value.trim()) !== null && _celdas__querySelector_value_trim1 !== void 0 ? _celdas__querySelector_value_trim1 : "";
    const nuevaCantidad = Number.parseInt(((_celdas_2 = celdas[3]) === null || _celdas_2 === void 0 ? void 0 : (_celdas__querySelector2 = _celdas_2.querySelector("input")) === null || _celdas__querySelector2 === void 0 ? void 0 : _celdas__querySelector2.value) || "0", 10);
    const nuevoPrecio = Number.parseFloat(((_celdas_3 = celdas[4]) === null || _celdas_3 === void 0 ? void 0 : (_celdas__querySelector3 = _celdas_3.querySelector("input")) === null || _celdas__querySelector3 === void 0 ? void 0 : _celdas__querySelector3.value) || "0");
    const fileInput = (_celdas_4 = celdas[5]) === null || _celdas_4 === void 0 ? void 0 : _celdas_4.querySelector("input[type='file']");
    const imgElement = (_celdas_5 = celdas[5]) === null || _celdas_5 === void 0 ? void 0 : _celdas_5.querySelector("img");
    var _celdas__querySelector_value_trim2;
    const nuevaInfo = (_celdas__querySelector_value_trim2 = (_celdas_6 = celdas[6]) === null || _celdas_6 === void 0 ? void 0 : (_celdas__querySelector4 = _celdas_6.querySelector("input")) === null || _celdas__querySelector4 === void 0 ? void 0 : _celdas__querySelector4.value.trim()) !== null && _celdas__querySelector_value_trim2 !== void 0 ? _celdas__querySelector_value_trim2 : "";
    var _imgElement_src;
    let fotoDataURL = (_imgElement_src = imgElement === null || imgElement === void 0 ? void 0 : imgElement.src) !== null && _imgElement_src !== void 0 ? _imgElement_src : "";
    if (fileInput && fileInput.files && fileInput.files[0]) {
        fotoDataURL = await readFileAsDataURL(fileInput.files[0]);
    }
    // Confirmación de cambios antes de aplicar
    const safeCantidadTry = Number.isNaN(nuevaCantidad) ? 0 : nuevaCantidad;
    const safePrecioTry = Number.isNaN(nuevoPrecio) ? 0 : nuevoPrecio;
    const originalRaw = fila.dataset.original || "";
    try {
        if (originalRaw) {
            var _celdas_8;
            const original = JSON.parse(originalRaw);
            const cambios = [];
            if ((original.recurso || "") !== (nuevoRecurso || "")) {
                cambios.push('Recurso: "'.concat(original.recurso || "", '" → "').concat(nuevoRecurso || "", '"'));
            }
            if ((original.categoria || "") !== (nuevaCategoria || "")) {
                cambios.push('Categoría: "'.concat(original.categoria || "", '" → "').concat(nuevaCategoria || "", '"'));
            }
            if ((original.cantidad || "0") !== String(safeCantidadTry)) {
                cambios.push("Cantidad: ".concat(original.cantidad || "0", " → ").concat(safeCantidadTry));
            }
            if ((Number.parseFloat(original.precioRaw) || 0) !== safePrecioTry) {
                cambios.push("Precio: ".concat(formatCurrency(Number.parseFloat(original.precioRaw) || 0), " → ").concat(formatCurrency(safePrecioTry)));
            }
            if ((original.info || "") !== (nuevaInfo || "")) {
                cambios.push('Info: "'.concat(original.info || "", '" → "').concat(nuevaInfo || "", '"'));
            }
            const fotoCambio = (original.imgSrc || "") !== (fotoDataURL || "");
            if (fotoCambio) {
                cambios.push("Foto: (cambiada)");
            }
            if (cambios.length === 0) {
                // No hay cambios; salir del modo edición sin tocar backend
                celdas[7].innerHTML = '\n      <div class="tabla-acciones">\n        <button type="button" class="boton-editar" data-action="edit">Editar</button>\n        <button type="button" class="boton-eliminar" data-action="delete">Eliminar</button>\n      </div>';
                fila.dataset.original = "";
                filtrarTabla({
                    resetPage: false
                });
                ordenarTabla();
                actualizarPaginacion();
                hideEditToolbar();
                return;
            }
            var _celdas__innerText;
            const idText = (_celdas__innerText = (_celdas_8 = celdas[0]) === null || _celdas_8 === void 0 ? void 0 : _celdas_8.innerText) !== null && _celdas__innerText !== void 0 ? _celdas__innerText : "0";
            const ok = window.confirm("Confirmar modificación del recurso #".concat(idText, "\n\n") + cambios.join("\n"));
            if (!ok) {
                // Permanecer en modo edición si cancela
                return;
            }
        }
    } catch (e) {
        const ok = window.confirm("Confirmar modificación de este recurso?");
        if (!ok) return;
    }
    const safeCantidad = safeCantidadTry;
    const safePrecio = safePrecioTry;
    celdas[1].innerText = nuevoRecurso;
    celdas[2].innerText = nuevaCategoria;
    celdas[3].innerText = String(safeCantidad);
    celdas[4].setAttribute("data-precio", String(safePrecio));
    celdas[4].innerText = formatCurrency(safePrecio);
    if (fotoDataURL) {
        celdas[5].innerHTML = '<img class="thumb" src="'.concat(fotoDataURL, '" alt="" />');
        celdas[5].setAttribute("data-foto", "1");
    } else {
        celdas[5].innerHTML = "";
        celdas[5].setAttribute("data-foto", "");
    }
    celdas[6].innerText = nuevaInfo;
    celdas[7].innerHTML = '\n      <div class="tabla-acciones">\n        <button type="button" class="boton-editar" data-action="edit">Editar</button>\n        <button type="button" class="boton-eliminar" data-action="delete">Eliminar</button>\n      </div>';
    var _celdas__innerText1;
    const id = Number.parseInt((_celdas__innerText1 = (_celdas_7 = celdas[0]) === null || _celdas_7 === void 0 ? void 0 : _celdas_7.innerText) !== null && _celdas__innerText1 !== void 0 ? _celdas__innerText1 : "0", 10);
    // Best-effort sync with backend
    void apiUpdateItem(id, {
        id,
        recurso: nuevoRecurso,
        categoria: nuevaCategoria,
        cantidad: safeCantidad,
        precio: safePrecio,
        foto: fotoDataURL,
        info: nuevaInfo
    });
    fila.dataset.original = "";
    persistInventario();
    const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
    renderInventarioToDOM(arr);
    filtrarTabla({
        resetPage: false
    });
    ordenarTabla();
    actualizarPaginacion();
    hideEditToolbar();
}
function cancelarEdicion(button) {
    const fila = button.closest("tr");
    if (!fila) return;
    const originalRaw = fila.dataset.original;
    if (!originalRaw) return;
    const original = JSON.parse(originalRaw);
    const celdas = fila.querySelectorAll("td");
    celdas[1].innerText = original.recurso;
    celdas[2].innerText = original.categoria;
    celdas[3].innerText = original.cantidad;
    const precioNum = Number.parseFloat(original.precioRaw) || 0;
    celdas[4].setAttribute("data-precio", String(precioNum));
    celdas[4].innerText = formatCurrency(precioNum);
    if (original.imgSrc) {
        celdas[5].innerHTML = '<img class="thumb" src="'.concat(original.imgSrc, '" alt="" />');
        celdas[5].setAttribute("data-foto", "1");
    } else {
        celdas[5].innerHTML = "";
        celdas[5].setAttribute("data-foto", "");
    }
    celdas[6].innerText = original.info;
    celdas[7].innerHTML = '\n    <div class="tabla-acciones">\n      <button type="button" class="boton-editar" data-action="edit">Editar</button>\n      <button type="button" class="boton-eliminar" data-action="delete">Eliminar</button>\n    </div>';
    fila.dataset.original = "";
    filtrarTabla();
    ordenarTabla();
    actualizarPaginacion();
    hideEditToolbar();
}
function eliminarFila(button) {
    var _fila_cells_, _fila_cells;
    if (!window.confirm("¿Estás seguro de que deseas eliminar este recurso?")) {
        return;
    }
    const fila = button.closest("tr");
    var _fila_cells__innerText;
    const idText = (_fila_cells__innerText = fila === null || fila === void 0 ? void 0 : (_fila_cells = fila.cells) === null || _fila_cells === void 0 ? void 0 : (_fila_cells_ = _fila_cells[0]) === null || _fila_cells_ === void 0 ? void 0 : _fila_cells_.innerText) !== null && _fila_cells__innerText !== void 0 ? _fila_cells__innerText : "0";
    const id = Number.parseInt(idText, 10) || 0;
    if (id) {
        void apiDeleteItem(id);
    }
    fila === null || fila === void 0 ? void 0 : fila.remove();
    persistInventario();
    const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
    renderInventarioToDOM(arr);
    filtrarTabla({
        resetPage: false
    });
    ordenarTabla();
    actualizarPaginacion();
}
async function agregarRecurso(event) {
    var _this, _this1, _this2, _this3, _files, _this4, _this5;
    event.preventDefault();
    var _value_trim;
    const recurso = (_value_trim = (_this = document.getElementById("nuevoRecurso")) === null || _this === void 0 ? void 0 : _this.value.trim()) !== null && _value_trim !== void 0 ? _value_trim : "";
    var _value_trim1;
    const categoria = (_value_trim1 = (_this1 = document.getElementById("nuevaCategoria")) === null || _this1 === void 0 ? void 0 : _this1.value.trim()) !== null && _value_trim1 !== void 0 ? _value_trim1 : "";
    const cantidad = Number.parseInt(((_this2 = document.getElementById("nuevaCantidad")) === null || _this2 === void 0 ? void 0 : _this2.value) || "0", 10);
    const precio = Number.parseFloat(((_this3 = document.getElementById("nuevoPrecio")) === null || _this3 === void 0 ? void 0 : _this3.value) || "0");
    var _files_;
    const file = (_files_ = (_this4 = document.getElementById("nuevaFoto")) === null || _this4 === void 0 ? void 0 : (_files = _this4.files) === null || _files === void 0 ? void 0 : _files[0]) !== null && _files_ !== void 0 ? _files_ : null;
    var _value_trim2;
    const info = (_value_trim2 = (_this5 = document.getElementById("nuevaInfo")) === null || _this5 === void 0 ? void 0 : _this5.value.trim()) !== null && _value_trim2 !== void 0 ? _value_trim2 : "";
    if (!recurso || !categoria) return;
    const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
    let fotoDataURL = "";
    if (file) {
        fotoDataURL = await readFileAsDataURL(file);
    }
    const payload = {
        recurso,
        categoria,
        cantidad: Number.isNaN(cantidad) ? 0 : cantidad,
        precio: Number.isNaN(precio) ? 0 : precio,
        foto: fotoDataURL,
        info
    };
    const created = await apiCreateItem(payload);
    const nuevo = created !== null && created !== void 0 ? created : {
        id: nextIdFromStorage(),
        ...payload
    };
    arr.push(nuevo);
    saveJSON(INVENTORY_KEY, arr);
    renderInventarioToDOM(arr);
    syncDatalistsCategoria(categoria);
    const form = document.getElementById("formAgregar");
    form === null || form === void 0 ? void 0 : form.reset();
    const paginaPrev = paginaActual;
    filtrarTabla({
        resetPage: false
    });
    ordenarTabla();
    persistInventario();
    const totalFiltradas = document.querySelectorAll("#tablaRecursos tbody tr[data-match='1']").length;
    const totalPaginas = Math.max(1, Math.ceil(totalFiltradas / filasPorPagina));
    paginaActual = Math.min(paginaPrev, totalPaginas);
    actualizarPaginacion();
}
function syncDatalistsCategoria(catNueva) {
    if (!catNueva) return;
    const dlForm = document.getElementById("categoriasFormulario");
    const dlFilt = document.getElementById("categorias");
    const normalized = catNueva.toLowerCase();
    if (dlForm && !Array.from(dlForm.options).some((option)=>option.value.toLowerCase() === normalized)) {
        const opt = document.createElement("option");
        opt.value = catNueva;
        dlForm.appendChild(opt);
    }
    if (dlFilt && !Array.from(dlFilt.options).some((option)=>option.value.toLowerCase() === normalized)) {
        const opt = document.createElement("option");
        opt.value = catNueva;
        dlFilt.appendChild(opt);
    }
    const cats = loadJSON(CATS_KEY, []);
    if (!cats.some((cat)=>cat.toLowerCase() === normalized)) {
        cats.push(catNueva);
        saveJSON(CATS_KEY, cats);
    }
}
function toggleExportMenu() {
    const menu = document.getElementById("exportMenu");
    if (!menu) return;
    menu.classList.toggle("show");
    if (!menu.classList.contains("show")) {
        document.querySelectorAll(".submenu-content").forEach((submenu)=>submenu.classList.remove("show"));
    }
}
function toggleSubmenu(id) {
    document.querySelectorAll(".submenu-content").forEach((submenu)=>{
        if (submenu.id !== id) submenu.classList.remove("show");
    });
    const sub = document.getElementById(id);
    sub === null || sub === void 0 ? void 0 : sub.classList.toggle("show");
}
function closeAllMenus() {
    var _document_getElementById;
    (_document_getElementById = document.getElementById("exportMenu")) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.classList.remove("show");
    document.querySelectorAll(".submenu-content").forEach((submenu)=>submenu.classList.remove("show"));
}
function exportarCSV(opcion) {
    const filas = opcion === "visible" ? filasPaginaActual() : filasFiltradas();
    const encabezados = encabezadosTabla();
    const datos = datosDesdeFilas(filas);
    const lineas = [];
    lineas.push(encabezados.join(","));
    datos.forEach((arr)=>{
        const linea = arr.map((value)=>'"'.concat(String(value).replace(/"/g, '""'), '"')).join(",");
        lineas.push(linea);
    });
    const blob = new Blob([
        lineas.join("\n")
    ], {
        type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = opcion === "visible" ? "inventario_visible.csv" : "inventario_todo.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function exportarExcel(opcion) {
    const filas = opcion === "visible" ? filasPaginaActual() : filasFiltradas();
    const encabezados = encabezadosTabla();
    const datos = [
        encabezados,
        ...datosDesdeFilas(filas)
    ];
    const xlsx = getXLSX();
    if (!xlsx) {
        console.warn("Biblioteca XLSX no disponible");
        return;
    }
    const ws = xlsx.utils.aoa_to_sheet(datos);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Inventario");
    xlsx.writeFile(wb, opcion === "visible" ? "inventario_visible.xlsx" : "inventario_todo.xlsx");
}
function filasFiltradas() {
    const tbody = document.querySelector("#tablaRecursos tbody");
    if (!tbody) return [];
    return Array.from(tbody.querySelectorAll("tr")).filter((tr)=>tr.dataset.match === "1");
}
function filasPaginaActual() {
    const todas = filasFiltradas();
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    return todas.slice(inicio, fin);
}
function datosDesdeFilas(filas) {
    return filas.map((tr)=>{
        var _tds__querySelector, _tds_, _tds_1, _tds_2, _tds_3, _tds_4, _tds_5, _tds_6;
        const tds = tr.querySelectorAll("td");
        const tieneFoto = Boolean((_tds_ = tds[5]) === null || _tds_ === void 0 ? void 0 : (_tds__querySelector = _tds_.querySelector("img")) === null || _tds__querySelector === void 0 ? void 0 : _tds__querySelector.src);
        var _tds__innerText, _tds__innerText1, _tds__innerText2, _tds__innerText3, _tds__innerText4, _tds__innerText5;
        return [
            (_tds__innerText = (_tds_1 = tds[0]) === null || _tds_1 === void 0 ? void 0 : _tds_1.innerText) !== null && _tds__innerText !== void 0 ? _tds__innerText : "",
            (_tds__innerText1 = (_tds_2 = tds[1]) === null || _tds_2 === void 0 ? void 0 : _tds_2.innerText) !== null && _tds__innerText1 !== void 0 ? _tds__innerText1 : "",
            (_tds__innerText2 = (_tds_3 = tds[2]) === null || _tds_3 === void 0 ? void 0 : _tds_3.innerText) !== null && _tds__innerText2 !== void 0 ? _tds__innerText2 : "",
            (_tds__innerText3 = (_tds_4 = tds[3]) === null || _tds_4 === void 0 ? void 0 : _tds_4.innerText) !== null && _tds__innerText3 !== void 0 ? _tds__innerText3 : "",
            (_tds__innerText4 = (_tds_5 = tds[4]) === null || _tds_5 === void 0 ? void 0 : _tds_5.innerText) !== null && _tds__innerText4 !== void 0 ? _tds__innerText4 : "",
            tieneFoto ? "sí" : "no",
            (_tds__innerText5 = (_tds_6 = tds[6]) === null || _tds_6 === void 0 ? void 0 : _tds_6.innerText) !== null && _tds__innerText5 !== void 0 ? _tds__innerText5 : ""
        ];
    });
}
function encabezadosTabla() {
    return [
        "ID",
        "Recurso",
        "Categoría",
        "Cantidad",
        "Precio",
        "Foto",
        "Información"
    ];
}
function actualizarPaginacion() {
    const tbody = document.querySelector("#tablaRecursos tbody");
    if (!tbody) return;
    const filas = Array.from(tbody.querySelectorAll("tr"));
    const filtradas = filas.filter((fila)=>fila.dataset.match === "1");
    const total = filtradas.length;
    const totalPaginas = Math.max(1, Math.ceil(total / filasPorPagina));
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    if (paginaActual < 1) paginaActual = 1;
    filtradas.forEach((fila)=>{
        fila.style.display = "none";
    });
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    filtradas.slice(inicio, fin).forEach((fila)=>{
        fila.style.display = "";
    });
    const info = document.getElementById("infoPagina");
    if (info) {
        info.textContent = "Página ".concat(paginaActual, " de ").concat(totalPaginas);
    }
    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");
    if (btnAnterior) btnAnterior.disabled = paginaActual <= 1;
    if (btnSiguiente) btnSiguiente.disabled = paginaActual >= totalPaginas;
    persistInventario();
}
function cambiarPagina(direccion) {
    paginaActual += direccion;
    actualizarPaginacion();
}
function updateTheme(isDark) {
    const body = document.body;
    const label = document.getElementById("themeLabel");
    if (isDark) {
        body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        if (label) label.textContent = "Oscuro";
    } else {
        body.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        if (label) label.textContent = "Claro";
    }
}
function applyStoredTheme() {
    const saved = localStorage.getItem("theme");
    const body = document.body;
    const toggle = document.getElementById("themeSwitch");
    const label = document.getElementById("themeLabel");
    // Default to dark theme if not set
    if (!saved || saved === "dark") {
        if (!saved) localStorage.setItem("theme", "dark");
        body.setAttribute("data-theme", "dark");
        if (toggle) toggle.checked = true;
        if (label) label.textContent = "Oscuro";
    } else {
        body.removeAttribute("data-theme");
        if (toggle) toggle.checked = false;
        if (label) label.textContent = "Claro";
    }
}
function toggleEmptyState(show) {
    const el = document.getElementById("emptyState");
    const tableWrap = document.querySelector(".tabla-scroll");
    if (el) el.style.display = show ? "block" : "none";
    if (tableWrap) tableWrap.style.display = show ? "none" : "";
}
function initCategoriasDesdeTablaYListas() {
    const set = new Set();
    document.querySelectorAll("#tablaRecursos tbody tr").forEach((tr)=>{
        var _tr_cells_;
        const cat = (_tr_cells_ = tr.cells[2]) === null || _tr_cells_ === void 0 ? void 0 : _tr_cells_.innerText.trim();
        if (cat) set.add(cat);
    });
    document.querySelectorAll("#categorias option").forEach((opt)=>{
        const value = opt.value.trim();
        if (value) set.add(value);
    });
    document.querySelectorAll("#categoriasFormulario option").forEach((opt)=>{
        const value = opt.value.trim();
        if (value) set.add(value);
    });
    localStorage.setItem(CATS_KEY, JSON.stringify(Array.from(set)));
}
function aplicarPresetCategoria() {
    const preset = localStorage.getItem("presetCategoria");
    if (!preset) return;
    const input = document.getElementById("filtroCategoria");
    if (input) {
        input.value = preset;
        filtrarTabla({
            resetPage: true
        });
    }
    localStorage.removeItem("presetCategoria");
}
function getCurrencyPrefs() {
    try {
        const curr = localStorage.getItem('ajustes_currency') || 'CLP';
        const decimalsRaw = localStorage.getItem('ajustes_currency_decimals');
        const decimals = decimalsRaw !== null ? parseInt(decimalsRaw, 10) : curr === 'CLP' ? 0 : 2;
        const locale = curr === 'CLP' ? 'es-CL' : curr === 'EUR' ? 'es-ES' : 'en-US';
        return {
            curr,
            decimals,
            locale
        };
    } catch (e) {
        return {
            curr: 'CLP',
            decimals: 0,
            locale: 'es-CL'
        };
    }
}
function formatCurrency(value) {
    const { curr, decimals, locale } = getCurrencyPrefs();
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: curr,
            maximumFractionDigits: decimals
        }).format(value || 0);
    } catch (e) {
        return String(value || 0);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/inventario/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InventoryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AppHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AppFooter.tsx [app-client] (ecmascript)");
/* eslint-disable @next/next/no-img-element */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LanguageContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$login$2f$components$2f$AnimatedBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(auth)/login/components/AnimatedBackground.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$login$2f$hooks$2f$useBodyClass$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(auth)/login/hooks/useBodyClass.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$inventario$2f$interaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/inventario/interaction.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function InventoryPage() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$login$2f$hooks$2f$useBodyClass$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBodyClass"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const [isDeveloper, setIsDeveloper] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const apiBaseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InventoryPage.useMemo[apiBaseUrl]": ()=>{
            var _process_env_NEXT_PUBLIC_API_URL;
            const sanitize = {
                "InventoryPage.useMemo[apiBaseUrl].sanitize": (u)=>u.replace(/\/+$/, "")
            }["InventoryPage.useMemo[apiBaseUrl].sanitize"];
            const env = (_process_env_NEXT_PUBLIC_API_URL = ("TURBOPACK compile-time value", "http://localhost:8000")) === null || _process_env_NEXT_PUBLIC_API_URL === void 0 ? void 0 : _process_env_NEXT_PUBLIC_API_URL.trim();
            if (env) return sanitize(env);
            if ("TURBOPACK compile-time truthy", 1) {
                if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
                    return sanitize("http://localhost:8000");
                }
                return sanitize(window.location.origin);
            }
            //TURBOPACK unreachable
            ;
        }
    }["InventoryPage.useMemo[apiBaseUrl]"], []);
    const handleLogout = async ()=>{
        try {
            await fetch("".concat(apiBaseUrl, "/api/logout/"), {
                method: "POST",
                credentials: "include"
            });
        } catch (e) {
        // ignore
        } finally{
            window.location.href = "/login";
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InventoryPage.useEffect": ()=>{
            if (typeof document === "undefined") {
                return ({
                    "InventoryPage.useEffect": ()=>{}
                })["InventoryPage.useEffect"];
            }
            const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$inventario$2f$interaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeInventoryPage"])();
            return ({
                "InventoryPage.useEffect": ()=>{
                    cleanup();
                }
            })["InventoryPage.useEffect"];
        }
    }["InventoryPage.useEffect"], []);
    // Agrega/quita la clase en <body> para estilos del inventario
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InventoryPage.useEffect": ()=>{
            if (typeof document === "undefined") {
                return ({
                    "InventoryPage.useEffect": ()=>{}
                })["InventoryPage.useEffect"];
            }
            const inventoryClass = "inventory-layout";
            document.body.classList.add(inventoryClass);
            return ({
                "InventoryPage.useEffect": ()=>{
                    document.body.classList.remove(inventoryClass);
                }
            })["InventoryPage.useEffect"];
        }
    }["InventoryPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InventoryPage.useEffect": ()=>{
            ({
                "InventoryPage.useEffect": async ()=>{
                    try {
                        var _data_user;
                        const res = await fetch("".concat(apiBaseUrl, "/api/me/"), {
                            credentials: "include"
                        });
                        if (!res.ok) return;
                        const data = await res.json();
                        setIsDeveloper(Boolean(data === null || data === void 0 ? void 0 : (_data_user = data.user) === null || _data_user === void 0 ? void 0 : _data_user.is_developer));
                    } catch (e) {}
                }
            })["InventoryPage.useEffect"]();
        }
    }["InventoryPage.useEffect"], [
        apiBaseUrl
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
                strategy: "afterInteractive"
            }, void 0, false, {
                fileName: "[project]/src/app/inventario/page.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$login$2f$components$2f$AnimatedBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatedBackground"], {}, void 0, false, {
                fileName: "[project]/src/app/inventario/page.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "inventory-page",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/inventario/page.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inventory-shell",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                className: "inventory-main",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "inventory-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "inventory-card__heading",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    children: t.inventory.listTitle
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: t.inventory.listDescription
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 17
                                                }, this),
                                                isDeveloper && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/inventario/papelera",
                                                        style: {
                                                            fontWeight: 600
                                                        },
                                                        children: "Papelera / Cambios pendientes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/inventario/page.tsx",
                                            lineNumber: 92,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "inventory-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: t.inventory.addNewResource
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                    id: "formAgregar",
                                                    className: "inventory-form",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "form-grid",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "visually-hidden",
                                                                    htmlFor: "nuevoRecurso",
                                                                    children: t.inventory.resourceName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 108,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    id: "nuevoRecurso",
                                                                    placeholder: t.inventory.resourceName,
                                                                    required: true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 111,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "visually-hidden",
                                                                    htmlFor: "nuevaCategoria",
                                                                    children: t.inventory.category
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 118,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    id: "nuevaCategoria",
                                                                    list: "categoriasFormulario",
                                                                    placeholder: t.inventory.category,
                                                                    required: true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 121,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                                                    id: "categoriasFormulario",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Bombas de agua"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 129,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Herramientas"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 130,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Materiales eléctricos"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 131,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Repuestos"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 132,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Lubricantes"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 133,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 128,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "visually-hidden",
                                                                    htmlFor: "nuevaCantidad",
                                                                    children: t.inventory.quantity
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 136,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    id: "nuevaCantidad",
                                                                    placeholder: t.inventory.quantity,
                                                                    min: "0",
                                                                    step: "1",
                                                                    required: true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 139,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "visually-hidden",
                                                                    htmlFor: "nuevoPrecio",
                                                                    children: t.inventory.price
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 148,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    id: "nuevoPrecio",
                                                                    placeholder: t.inventory.price,
                                                                    min: "0",
                                                                    step: "0.01",
                                                                    required: true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 151,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "visualmente-hidden",
                                                                    htmlFor: "nuevaFoto",
                                                                    children: t.inventory.photo
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 160,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "file",
                                                                    id: "nuevaFoto",
                                                                    accept: "image/*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 163,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "visually-hidden",
                                                                    htmlFor: "nuevaInfo",
                                                                    children: t.inventory.additionalInfo
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 165,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    id: "nuevaInfo",
                                                                    placeholder: t.inventory.additionalInfo
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 168,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 107,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            className: "boton-agregar",
                                                            children: t.inventory.add
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 175,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/inventario/page.tsx",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "inventory-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: t.inventory.filterAndSort
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    id: "filtros",
                                                    className: "filters-panel",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            id: "filtroIdRango",
                                                            className: "filtro-input",
                                                            placeholder: t.inventory.idOrRange
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 184,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "autocomplete-container",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    id: "filtroRecurso",
                                                                    className: "filtro-input",
                                                                    placeholder: t.inventory.filterByResource,
                                                                    autoComplete: "off"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 192,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    id: "sugerenciasRecurso",
                                                                    className: "autocomplete-box"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 199,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 191,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            id: "filtroCategoria",
                                                            className: "filtro-input",
                                                            list: "categorias",
                                                            placeholder: t.inventory.filterByCategory
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                                            id: "categorias",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Bombas de agua"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 210,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Herramientas"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 211,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Materiales eléctricos"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 212,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Repuestos"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 213,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Lubricantes"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 214,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 209,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            id: "filtroInfo",
                                                            className: "filtro-input",
                                                            placeholder: t.inventory.filterByInfo
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 217,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            id: "ordenarPor",
                                                            className: "filtro-input",
                                                            defaultValue: "id-desc",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    children: t.inventory.sortBy
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 225,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "id-asc",
                                                                    children: "ID ↑"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 226,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "id-desc",
                                                                    children: "ID ↓"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 227,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "recurso-asc",
                                                                    children: [
                                                                        t.home.resource,
                                                                        " A-Z"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 228,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "recurso-desc",
                                                                    children: [
                                                                        t.home.resource,
                                                                        " Z-A"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 229,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "categoria-asc",
                                                                    children: [
                                                                        t.inventory.category,
                                                                        " A-Z"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 230,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "categoria-desc",
                                                                    children: [
                                                                        t.inventory.category,
                                                                        " Z-A"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 231,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "cantidad-asc",
                                                                    children: [
                                                                        t.inventory.quantity,
                                                                        " ↑"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 232,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "cantidad-desc",
                                                                    children: [
                                                                        t.inventory.quantity,
                                                                        " ↓"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 233,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "precio-asc",
                                                                    children: [
                                                                        t.inventory.price,
                                                                        " ↑"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 234,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "precio-desc",
                                                                    children: [
                                                                        t.inventory.price,
                                                                        " ↓"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 235,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            className: "boton-limpiar",
                                                            children: t.inventory.clearFilters
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "exportar-dropdown",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "boton-exportar",
                                                                    children: [
                                                                        t.inventory.export,
                                                                        " ▼"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 243,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    id: "exportMenu",
                                                                    className: "dropdown-content",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "submenu",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    className: "submenu-btn",
                                                                                    "data-submenu": "excelSub",
                                                                                    children: "Excel ▸"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                                    lineNumber: 248,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    id: "excelSub",
                                                                                    className: "submenu-content",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                            href: "#",
                                                                                            "data-export": "excel-visible",
                                                                                            children: t.inventory.visible
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                                            lineNumber: 252,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                            href: "#",
                                                                                            "data-export": "excel-todo",
                                                                                            children: t.inventory.all
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                                            lineNumber: 253,
                                                                                            columnNumber: 27
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                                    lineNumber: 251,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 247,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "submenu",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    className: "submenu-btn",
                                                                                    "data-submenu": "csvSub",
                                                                                    children: "CSV ▸"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                                    lineNumber: 257,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    id: "csvSub",
                                                                                    className: "submenu-content",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                            href: "#",
                                                                                            "data-export": "csv-visible",
                                                                                            children: t.inventory.visible
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                                            lineNumber: 261,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                            href: "#",
                                                                                            "data-export": "csv-todo",
                                                                                            children: t.inventory.all
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                                            lineNumber: 262,
                                                                                            columnNumber: 27
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                                    lineNumber: 260,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 256,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 242,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/inventario/page.tsx",
                                            lineNumber: 181,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            id: "emptyState",
                                            className: "empty-state",
                                            "aria-live": "polite",
                                            style: {
                                                display: "none"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "empty-state__box",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "empty-state__icon",
                                                        "aria-hidden": "true",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "28",
                                                            height: "28",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                    cx: "12",
                                                                    cy: "12",
                                                                    r: "12",
                                                                    fill: "url(#g)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 275,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M8 7h5l3 3v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm6 3h2l-2-2v2z",
                                                                    fill: "#fff"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 276,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                                        id: "g",
                                                                        x1: "0",
                                                                        y1: "0",
                                                                        x2: "24",
                                                                        y2: "24",
                                                                        gradientUnits: "userSpaceOnUse",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                                stopColor: "#2ad1ff"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/inventario/page.tsx",
                                                                                lineNumber: 279,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                                offset: "1",
                                                                                stopColor: "#6d78ff"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/inventario/page.tsx",
                                                                                lineNumber: 280,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 278,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 277,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "empty-state__title",
                                                        children: t.inventory.emptyStateTitle
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "empty-state__subtitle",
                                                        children: t.inventory.emptyStateDescription
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/inventario/page.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/inventario/page.tsx",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "tabla-scroll",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                id: "tablaRecursos",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "ID"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 296,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: t.home.resource
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 297,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: t.inventory.category
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 298,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: t.inventory.quantity
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 299,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: t.inventory.price
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 300,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: t.inventory.photo
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 301,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: t.inventory.info
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 302,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: t.common.actions
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                    lineNumber: 303,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                            lineNumber: 295,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                "data-match": "1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 308,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "Bombas sumergibles 1HP"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 309,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "Bombas de agua"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 310,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 311,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "120.00"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 312,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        "data-foto": ""
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 313,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "Equipo básico"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 314,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "tabla-acciones",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    className: "boton-editar",
                                                                                    "data-action": "edit",
                                                                                    children: t.inventory.edit
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                                    lineNumber: 317,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    className: "boton-eliminar",
                                                                                    "data-action": "delete",
                                                                                    children: t.inventory.delete
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                                    lineNumber: 318,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 316,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 315,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/inventario/page.tsx",
                                                                lineNumber: 307,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                "data-match": "1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 323,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "Kit reparación rodamientos"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 324,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "Repuestos"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 325,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 326,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "45.50"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 327,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        "data-foto": ""
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 328,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: "Incluye grasa"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 329,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "tabla-acciones",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    className: "boton-editar",
                                                                                    "data-action": "edit",
                                                                                    children: t.inventory.edit
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                                    lineNumber: 332,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    className: "boton-eliminar",
                                                                                    "data-action": "delete",
                                                                                    children: t.inventory.delete
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                                                    lineNumber: 333,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/inventario/page.tsx",
                                                                            lineNumber: 331,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                                        lineNumber: 330,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/inventario/page.tsx",
                                                                lineNumber: 322,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/inventario/page.tsx",
                                                        lineNumber: 306,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/inventario/page.tsx",
                                                lineNumber: 293,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/inventario/page.tsx",
                                            lineNumber: 292,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "paginacion",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    id: "btnAnterior",
                                                    children: t.inventory.previous
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 342,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    id: "infoPagina",
                                                    children: [
                                                        t.inventory.page,
                                                        " 1"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 343,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    id: "btnSiguiente",
                                                    children: t.inventory.next
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/inventario/page.tsx",
                                                    lineNumber: 344,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/inventario/page.tsx",
                                            lineNumber: 341,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/inventario/page.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventario/page.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/app/inventario/page.tsx",
                                lineNumber: 349,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/inventario/page.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/inventario/page.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(InventoryPage, "xkyhKRt4zwE8aQDO9EKwDogqx+0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$login$2f$hooks$2f$useBodyClass$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBodyClass"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c = InventoryPage;
var _c;
__turbopack_context__.k.register(_c, "InventoryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_856bb6c5._.js.map