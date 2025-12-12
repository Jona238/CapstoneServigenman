"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Pages where chatbot should NOT appear
const HIDDEN_PATHS = ["/login", "/recuperacion"];

export default function N8NChatbot() {
  const [theme, setTheme] = useState("dark");
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();

  // Check if current path should hide the chatbot
  const shouldHide = HIDDEN_PATHS.some(
    (path) => pathname === path || pathname?.startsWith(`${path}/`)
  );

  useEffect(() => {
    // Function to get current theme
    const getTheme = () => {
      if (typeof document === "undefined") return "dark";
      const attr = document.body.getAttribute("data-theme");
      if (attr) return attr;
      
      try {
        const saved = localStorage.getItem("theme");
        return !saved || saved === "dark" ? "dark" : "light";
      } catch {
        return "dark";
      }
    };

    setTheme(getTheme());

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          setTheme(document.body.getAttribute("data-theme") || "light");
        }
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Don't load on hidden pages
    if (shouldHide) {
      // Remove widget if navigating to hidden page
      const existingWidgets = document.querySelectorAll('.n8n-chat');
      existingWidgets.forEach(w => w.remove());
      const scriptEl = document.getElementById("n8n-chat-script");
      if (scriptEl) scriptEl.remove();
      const cssEl = document.getElementById("n8n-chat-css");
      if (cssEl) cssEl.remove();
      const fixStyleEl = document.getElementById("n8n-chat-fix-styles");
      if (fixStyleEl) fixStyleEl.remove();
      setIsLoaded(false);
      return;
    }

    // Prevent double loading
    if (isLoaded) return;

    // Check if already loaded by checking for existing elements
    if (document.querySelector('.n8n-chat')) {
      setIsLoaded(true);
      return;
    }

    const isDark = theme === "dark";

    // Add professional styles
    const fixStyleId = "n8n-chat-fix-styles";
    if (!document.getElementById(fixStyleId)) {
      const fixStyle = document.createElement("style");
      fixStyle.id = fixStyleId;
      fixStyle.innerHTML = `
        /* Container positioning */
        .n8n-chat {
          position: fixed !important;
          bottom: 24px !important;
          right: 24px !important;
          z-index: 9999 !important;
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        
        .n8n-chat .chat-window-wrapper {
          position: fixed !important;
          bottom: 24px !important;
          right: 24px !important;
          z-index: 9999 !important;
          max-width: calc(100vw - 48px) !important;
          max-height: calc(100vh - 48px) !important;
        }

        /* Toggle button (bubble) */
        .n8n-chat .chat-window-toggle {
          width: 60px !important;
          height: 60px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          border: none !important;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
        }

        .n8n-chat .chat-window-toggle:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 6px 28px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .n8n-chat .chat-window-toggle svg {
          width: 26px !important;
          height: 26px !important;
          color: #ffffff !important;
          fill: #ffffff !important;
        }

        /* Chat window */
        .n8n-chat .chat-window {
          width: 380px !important;
          height: 520px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          background: ${isDark ? "#1e293b" : "#ffffff"} !important;
          border: 1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, ${isDark ? "0.4" : "0.15"}), 
                      0 8px 24px rgba(0, 0, 0, ${isDark ? "0.2" : "0.08"}) !important;
          transition: height 0.3s ease !important;
        }

        /* Expanded mode */
        .n8n-chat .chat-window.chat-expanded {
          height: calc(100vh - 100px) !important;
        }

        /* Expand button */
        .n8n-chat .chat-expand-btn {
          position: absolute !important;
          top: 50% !important;
          right: 40px !important;
          transform: translateY(-50%) !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border: none !important;
          border-radius: 6px !important;
          width: 28px !important;
          height: 28px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background 0.2s !important;
          padding: 0 !important;
        }

        .n8n-chat .chat-expand-btn:hover {
          background: rgba(255, 255, 255, 0.3) !important;
        }

        .n8n-chat .chat-expand-btn svg {
          width: 16px !important;
          height: 16px !important;
          color: #ffffff !important;
          fill: none !important;
          stroke: currentColor !important;
          stroke-width: 2 !important;
        }

        /* Header */
        .n8n-chat .chat-header {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          padding: 18px 20px !important;
          border: none !important;
          position: relative !important;
        }

        .n8n-chat .chat-header h1,
        .n8n-chat .chat-heading h1 {
          font-size: 17px !important;
          font-weight: 600 !important;
          color: #ffffff !important;
          margin: 0 !important;
        }

        .n8n-chat .chat-header p,
        .n8n-chat .chat-heading p {
          font-size: 13px !important;
          color: rgba(255, 255, 255, 0.85) !important;
          margin: 4px 0 0 0 !important;
        }

        .n8n-chat .chat-close-button {
          color: #ffffff !important;
          opacity: 0.8 !important;
          transition: opacity 0.2s !important;
        }

        .n8n-chat .chat-close-button:hover {
          opacity: 1 !important;
        }

        /* Body / Messages area */
        .n8n-chat .chat-body,
        .n8n-chat .chat-layout .chat-body {
          background: ${isDark ? "#0f172a" : "#f8fafc"} !important;
          flex: 1 !important;
          overflow-y: auto !important;
          min-height: 0 !important;
        }

        .n8n-chat .chat-messages-list {
          padding: 16px !important;
          background: ${isDark ? "#0f172a" : "#f8fafc"} !important;
          overflow-y: auto !important;
          max-height: 100% !important;
        }

        /* Chat layout flex */
        .n8n-chat .chat-layout {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          overflow: hidden !important;
        }

        /* Messages */
        .n8n-chat .chat-message {
          max-width: 80% !important;
          margin-bottom: 12px !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }

        .n8n-chat .chat-message.chat-message-from-bot {
          background: ${isDark ? "#1e293b" : "#ffffff"} !important;
          color: ${isDark ? "#e2e8f0" : "#1e293b"} !important;
          border-radius: 16px 16px 16px 4px !important;
          padding: 12px 16px !important;
          border: 1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, ${isDark ? "0.2" : "0.05"}) !important;
        }

        .n8n-chat .chat-message.chat-message-from-user {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
          color: #ffffff !important;
          border-radius: 16px 16px 4px 16px !important;
          padding: 12px 16px !important;
          margin-left: auto !important;
          border: none !important;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
        }

        /* Welcome screen */
        .n8n-chat .chat-get-started {
          background: ${isDark ? "#0f172a" : "#f8fafc"} !important;
          padding: 24px !important;
        }

        .n8n-chat .chat-button,
        .n8n-chat .chat-get-started button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 12px 24px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
        }

        .n8n-chat .chat-button:hover,
        .n8n-chat .chat-get-started button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
        }

        /* Input area */
        .n8n-chat .chat-footer,
        .n8n-chat .chat-input {
          background: ${isDark ? "#1e293b" : "#ffffff"} !important;
          border-top: 1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} !important;
          padding: 12px 16px !important;
        }

        .n8n-chat .chat-inputs {
          background: ${isDark ? "#0f172a" : "#f1f5f9"} !important;
          border-radius: 12px !important;
          border: 1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: flex-end !important;
          width: 100% !important;
        }

        .n8n-chat .chat-inputs textarea,
        .n8n-chat .chat-input textarea {
          background: transparent !important;
          color: ${isDark ? "#e2e8f0" : "#1e293b"} !important;
          border: none !important;
          padding: 12px 14px !important;
          font-size: 14px !important;
          resize: none !important;
          flex: 1 !important;
          min-width: 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .n8n-chat .chat-inputs textarea::placeholder,
        .n8n-chat .chat-input textarea::placeholder {
          color: ${isDark ? "#64748b" : "#94a3b8"} !important;
        }

        .n8n-chat .chat-inputs textarea:focus,
        .n8n-chat .chat-input textarea:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        .n8n-chat .chat-inputs-controls {
          flex-shrink: 0 !important;
        }

        .n8n-chat .chat-input-send-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          margin: 6px !important;
          padding: 8px !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          flex-shrink: 0 !important;
        }

        .n8n-chat .chat-input-send-button:hover {
          transform: scale(1.05) !important;
        }

        .n8n-chat .chat-input-send-button svg {
          color: #ffffff !important;
          fill: #ffffff !important;
          width: 18px !important;
          height: 18px !important;
        }

        /* Powered by footer - hide it */
        .n8n-chat .chat-powered-by {
          display: none !important;
        }

        /* Scrollbar */
        .n8n-chat .chat-messages-list::-webkit-scrollbar {
          width: 5px !important;
        }

        .n8n-chat .chat-messages-list::-webkit-scrollbar-track {
          background: transparent !important;
        }

        .n8n-chat .chat-messages-list::-webkit-scrollbar-thumb {
          background: ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} !important;
          border-radius: 3px !important;
        }

        /* Mobile */
        @media (max-width: 480px) {
          .n8n-chat .chat-window {
            width: calc(100vw - 32px) !important;
            height: calc(100vh - 100px) !important;
            max-height: 600px !important;
          }
          
          .n8n-chat,
          .n8n-chat .chat-window-wrapper {
            bottom: 16px !important;
            right: 16px !important;
          }
          
          .n8n-chat .chat-window-toggle {
            width: 54px !important;
            height: 54px !important;
          }

          .n8n-chat .chat-footer,
          .n8n-chat .chat-input {
            padding: 10px 12px !important;
          }

          .n8n-chat .chat-inputs {
            border-radius: 10px !important;
          }

          .n8n-chat .chat-inputs textarea,
          .n8n-chat .chat-input textarea {
            padding: 10px 12px !important;
            font-size: 16px !important; /* Prevents zoom on iOS */
            min-height: 44px !important;
          }

          .n8n-chat .chat-input-send-button {
            margin: 4px !important;
            padding: 10px !important;
            min-width: 44px !important;
            min-height: 44px !important;
          }

          .n8n-chat .chat-header {
            padding: 14px 16px !important;
          }

          .n8n-chat .chat-expand-btn {
            right: 36px !important;
            width: 32px !important;
            height: 32px !important;
          }

          .n8n-chat .chat-message {
            max-width: 90% !important;
            font-size: 15px !important;
          }
        }
      `;
      document.head.appendChild(fixStyle);
    }

    // Load N8N chat CSS first
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    cssLink.id = "n8n-chat-css";
    if (!document.getElementById("n8n-chat-css")) {
      document.head.appendChild(cssLink);
    }

    // Load the N8N chat script
    const script = document.createElement("script");
    script.type = "module";
    script.id = "n8n-chat-script";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

      createChat({
        webhookUrl: 'https://nicvergara852.app.n8n.cloud/webhook/ebae01d6-c5ce-4b6a-854c-241e602fc881/chat',
        showWelcomeScreen: true,
        defaultLanguage: 'es',
        initialMessages: [
          'Hola! 👋',
          'Soy el asistente virtual de ServiGenman. ¿En qué puedo ayudarte hoy?'
        ],
        i18n: {
          es: {
            title: 'Asistente ServiGenman',
            subtitle: 'Estamos aquí para ayudarte',
            footer: '',
            getStarted: 'Iniciar conversación',
            inputPlaceholder: 'Escribe tu mensaje...',
            closeButtonTooltip: 'Cerrar chat',
          },
        },
      });

      // Add expand button after chat is created
      setTimeout(() => {
        const header = document.querySelector('.n8n-chat .chat-header');
        const chatWindow = document.querySelector('.n8n-chat .chat-window');
        
        if (header && chatWindow && !document.querySelector('.chat-expand-btn')) {
          const expandBtn = document.createElement('button');
          expandBtn.className = 'chat-expand-btn';
          expandBtn.title = 'Expandir/Contraer';
          expandBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5"/><path d="M7 10l5 5 5-5"/></svg>';
          
          let isExpanded = false;
          expandBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            chatWindow.classList.toggle('chat-expanded', isExpanded);
            expandBtn.innerHTML = isExpanded 
              ? '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"/><path d="M7 14l5-5 5 5"/></svg>'
              : '<svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5"/><path d="M7 10l5 5 5-5"/></svg>';
          });
          
          header.style.position = 'relative';
          header.appendChild(expandBtn);
        }
      }, 500);
    `;
    
    document.body.appendChild(script);
    setIsLoaded(true);

    return () => {
      const existingScript = document.getElementById("n8n-chat-script");
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
      const existingCss = document.getElementById("n8n-chat-css");
      if (existingCss) {
        existingCss.remove();
      }
    };
  }, [theme, shouldHide, isLoaded]);

  // Don't render anything on hidden pages
  if (shouldHide) return null;

  // SDK creates its own container
  return null;
}
