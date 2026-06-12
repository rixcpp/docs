import DefaultTheme from "vitepress/theme";
import "./custom.css";

import Layout from "./Layout.vue";
import DocsHomeHero from "./DocsHomeHero.vue";
import CodeTabs from "./CodeTabs.vue";
import CodeBlock from "./CodeBlock.vue";

import { highlightCpp, highlightShell, normalizeLang } from "./highlighter";

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);
    const { app, router } = ctx;

    app.component("DocsHomeHero", DocsHomeHero);
    app.component("CodeTabs", CodeTabs);
    app.component("CodeBlock", CodeBlock);

    if (typeof window === "undefined") {
      return;
    }

    // ──────────────────────────────────────────────
    // Scroll handling
    // ──────────────────────────────────────────────
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.addEventListener("load", () => {
      window.scrollTo(0, 0);
    });

    // ──────────────────────────────────────────────
    // Custom header layout sync
    // ──────────────────────────────────────────────
    const syncVixHeaderHeight = () => {
      const header = document.querySelector(".vix-nav");
      if (!header) return;

      const height = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--vix-header-height",
        `${height}px`,
      );
    };

    window.addEventListener("load", syncVixHeaderHeight);
    window.addEventListener("resize", syncVixHeaderHeight);

    window.requestAnimationFrame(() => {
      syncVixHeaderHeight();
      setTimeout(syncVixHeaderHeight, 80);
    });

    const headerObserver = new MutationObserver(() => {
      syncVixHeaderHeight();
    });

    headerObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // ──────────────────────────────────────────────
    // Custom syntax highlighter for VitePress fenced blocks
    // Runs on every page mount + route change
    // ──────────────────────────────────────────────
    const applyHighlight = () => {
      const blocks = document.querySelectorAll(
        '.vp-doc div[class*="language-"] code, .vp-doc [class*="language-"] code',
      );

      blocks.forEach((codeEl) => {
        if (codeEl.dataset.vixHighlighted === "1") return;

        // Find parent container and detect language
        const container = codeEl.closest('[class*="language-"]');
        if (!container) return;

        // Extract language from class like "language-cpp" / "language-shell"
        const cls = container.className.match(/language-([\w+-]+)/);
        const rawLang = cls ? cls[1] : "text";
        const lang = normalizeLang(rawLang);

        // Recover raw text (textContent strips Shiki's spans, preserves whitespace)
        const raw = codeEl.textContent || "";

        if (lang === "cpp") {
          codeEl.innerHTML = highlightCpp(raw);
        } else if (lang === "shell") {
          codeEl.innerHTML = highlightShell(raw);
        } else {
          // text/plain/unknown: keep as escaped text
          codeEl.innerHTML = raw
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        }

        codeEl.dataset.vixHighlighted = "1";
        container.classList.add("vix-styled");
      });
    };

    // Run on initial mount
    const runHighlight = () => {
      // Wait one frame so VitePress finishes rendering the page
      window.requestAnimationFrame(() => {
        applyHighlight();
        // Second pass to catch line-numbers wrappers that mount slightly later
        setTimeout(applyHighlight, 50);
      });
    };

    runHighlight();

    // Re-run on every route change
    if (router && typeof router.onAfterRouteChange === "function") {
      const prev = router.onAfterRouteChange;
      router.onAfterRouteChange = (to) => {
        prev?.(to);
        runHighlight();
      };
    } else if (router) {
      router.onAfterRouteChanged = () => runHighlight();
    }

    // Safety net: re-run on DOM mutations within doc area
    const target = document.body;
    const observer = new MutationObserver(() => {
      // Throttle: only run if there are unhighlighted blocks
      const pending = document.querySelector(
        '.vp-doc [class*="language-"] code:not([data-vix-highlighted])',
      );
      if (pending) applyHighlight();
    });
    observer.observe(target, { childList: true, subtree: true });
  },
};
