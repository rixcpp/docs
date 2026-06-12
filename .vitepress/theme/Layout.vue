<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import Breadcrumb from "./Breadcrumb.vue";

const { Layout } = DefaultTheme;
const route = useRoute();

const showBanner = ref(true);
const isDark = ref(true);

const navLinks = [
  { text: "Guides", href: "/guides/build-rest-api" },
  { text: "Templates", href: "/templates/" },
  { text: "API", href: "/api/index" },
  { text: "Modules", href: "/modules/core/" },
  { text: "Registry", href: "https://registry.vixcpp.com" },
];

const footerLinks = [
  { text: "Docs", href: "/" },
  { text: "Guides", href: "/guides/build-rest-api" },
  { text: "API", href: "/api/index" },
  { text: "Modules", href: "/modules/core/" },
  { text: "Registry", href: "https://registry.vixcpp.com" },
  { text: "GitHub", href: "https://github.com/vixcpp/vix" },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/vixcpp/vix",
    icon: `<path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.48 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 7.07c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.92 0 1.38-.01 2.5-.01 2.84 0 .27.18.59.69.48A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/>`,
  },
  {
    label: "X",
    href: "https://x.com/vix_cpp",
    icon: `<path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-6.8L5.3 22H2l7.3-8.4L1.7 2h6.9l4.7 6.1L18.9 2Zm-1.2 18h1.7L7.7 3.9H5.9L17.7 20Z"/>`,
  },
];

const normalizePath = (path) => {
  if (!path) return "/";

  const clean = path.split("#")[0].split("?")[0];

  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1);
  }

  return clean;
};

const isActiveLink = (href) => {
  if (!href || href.startsWith("http")) {
    return false;
  }

  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(href);

  if (targetPath === "/") {
    return currentPath === "/";
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
};

const openSearch = () => {
  const searchButton = document.querySelector(
    ".DocSearch-Button, .VPNavBarSearchButton, .VPLocalSearchBox button",
  );

  if (searchButton instanceof HTMLElement) {
    searchButton.click();
  }
};

const applyTheme = (dark) => {
  isDark.value = dark;

  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("vitepress-theme-appearance", dark ? "dark" : "light");
};

const toggleTheme = () => {
  applyTheme(!isDark.value);
};

const syncHeaderState = async () => {
  await nextTick();

  document.body.classList.toggle("vix-banner-visible", showBanner.value);
  document.body.classList.toggle("vix-banner-hidden", !showBanner.value);
};

const closeBanner = () => {
  showBanner.value = false;
};

watch(showBanner, () => {
  syncHeaderState();
});

onMounted(() => {
  const savedTheme = localStorage.getItem("vitepress-theme-appearance");

  if (savedTheme === "dark") {
    applyTheme(true);
  } else if (savedTheme === "light") {
    applyTheme(false);
  } else {
    isDark.value = document.documentElement.classList.contains("dark");
  }

  syncHeaderState();
});

onBeforeUnmount(() => {
  document.body.classList.remove("vix-banner-visible", "vix-banner-hidden");
});
</script>

<template>
  <header class="vix-nav">
    <div v-if="showBanner" class="vix-nav__banner">
      <span class="vix-nav__banner-mark" aria-hidden="true">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="vix-banner-left"
              x1="5"
              y1="6"
              x2="18"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stop-color="#d4fcd4" />
              <stop offset="55%" stop-color="#4ade80" />
              <stop offset="100%" stop-color="#22c55e" />
            </linearGradient>

            <linearGradient
              id="vix-banner-right"
              x1="31"
              y1="6"
              x2="18"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stop-color="#22c55e" />
              <stop offset="100%" stop-color="#15803d" />
            </linearGradient>
          </defs>

          <polygon points="5,6 12,6 18,28 14,28" fill="url(#vix-banner-left)" />
          <polygon
            points="31,6 24,6 18,28 22,28"
            fill="url(#vix-banner-right)"
          />
          <line
            x1="9"
            y1="16"
            x2="13.5"
            y2="29"
            stroke="#bbf7d0"
            stroke-width="1.1"
            stroke-linecap="round"
            opacity="0.7"
          />
        </svg>
      </span>

      <span>Vix.cpp v2.6.0 is here</span>
      <a
        href="https://blog.vixcpp.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="Read the Vix.cpp blog"
      >
        Read the blog
      </a>

      <button
        class="vix-nav__banner-close"
        type="button"
        aria-label="Close announcement"
        @click="closeBanner"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <div class="vix-nav__bar">
      <div class="vix-nav__inner">
        <a class="vix-nav__brand" href="/" aria-label="Vix.cpp Documentation">
          <span class="vix-nav__brand-name">Vix.cpp</span>
          <span class="vix-nav__slash">/</span>
          <span class="vix-nav__docs">Docs</span>
        </a>

        <nav class="vix-nav__links" aria-label="Main navigation">
          <a
            v-for="link in navLinks"
            :key="link.text"
            :class="['vix-nav__link', { 'is-active': isActiveLink(link.href) }]"
            :href="link.href"
            :target="link.href.startsWith('http') ? '_blank' : undefined"
            :rel="link.href.startsWith('http') ? 'noreferrer' : undefined"
          >
            {{ link.text }}
          </a>
        </nav>

        <div class="vix-nav__right">
          <button
            class="vix-nav__theme"
            type="button"
            :aria-label="
              isDark ? 'Switch to light theme' : 'Switch to dark theme'
            "
            @click="toggleTheme"
          >
            <svg
              v-if="isDark"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M12 4V2" />
              <path d="M12 22v-2" />
              <path d="m4.93 4.93-1.41-1.41" />
              <path d="m20.48 20.48-1.41-1.41" />
              <path d="M4 12H2" />
              <path d="M22 12h-2" />
              <path d="m4.93 19.07-1.41 1.41" />
              <path d="m20.48 3.52-1.41 1.41" />
              <circle cx="12" cy="12" r="4" />
            </svg>

            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z" />
            </svg>
          </button>

          <a
            v-for="item in socials"
            :key="item.label"
            class="vix-nav__icon"
            :href="item.href"
            target="_blank"
            rel="noreferrer"
            :aria-label="item.label"
          >
            <svg
              class="vix-nav__social-svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              v-html="item.icon"
            ></svg>
          </a>

          <button
            class="vix-nav__search"
            type="button"
            aria-label="Search"
            @click="openSearch"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <span>Search Docs</span>
            <kbd>Ctrl K</kbd>
          </button>
        </div>
      </div>
    </div>
  </header>

  <Layout>
    <template #doc-before>
      <Breadcrumb />
    </template>

    <template #layout-bottom>
      <footer class="vix-footer" role="contentinfo">
        <div class="vix-footer-inner">
          <div class="vix-footer-brand">
            <span class="vix-footer-name">Vix.cpp</span>
            <span class="vix-footer-desc">
              Modern C++ runtime and developer toolkit.
            </span>
          </div>

          <nav class="vix-footer-nav" aria-label="Footer navigation">
            <a
              v-for="link in footerLinks"
              :key="link.text"
              class="vix-footer-link"
              :href="link.href"
              :target="link.href.startsWith('http') ? '_blank' : undefined"
              :rel="link.href.startsWith('http') ? 'noreferrer' : undefined"
            >
              {{ link.text }}
            </a>
          </nav>
        </div>

        <div class="vix-footer-meta">
          <span>MIT License</span>
          <span>Copyright © 2026 Vix.cpp</span>
          <span>Built by Softadastra</span>
        </div>
      </footer>
    </template>
  </Layout>
</template>

<style>
:root {
  --vix-doc-sidebar-width: 300px;
}

@media (min-width: 1440px) {
  :root {
    --vix-doc-sidebar-width: 320px;
  }
}

.VPNav {
  display: none !important;
}

.VPFooter {
  display: none !important;
}

.VPContent {
  padding-top: 0 !important;
}

/* ============================================================
   Vix.cpp custom docs header
   Same background as docs, fully responsive
   ============================================================ */

.vix-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  width: 100%;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg) !important;
  border-bottom: 1px solid var(--vp-c-divider);
}

.vix-nav__banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 8px 56px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg) !important;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.2;
  text-align: center;
}

.vix-nav__banner a {
  color: #4ade80;
  font-weight: 760;
  text-decoration: underline;
  text-underline-offset: 3px;
  white-space: nowrap;
}

.vix-nav__banner-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  margin-right: 3px;
  flex-shrink: 0;
}

.vix-nav__banner-mark svg {
  display: block;
  width: 21px;
  height: 21px;
}

.vix-nav__banner-close {
  position: absolute;
  top: 50%;
  right: 16px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transform: translateY(-50%);
}

.vix-nav__banner-close:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.vix-nav__banner-close span {
  font-size: 24px;
  line-height: 1;
}

.vix-nav__bar {
  height: 60px;
  background: var(--vp-c-bg) !important;
}

.vix-nav__inner {
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) auto;
  align-items: center;
  gap: 26px;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0 18px;
  background: var(--vp-c-bg) !important;
}

.vix-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  color: var(--vp-c-text-1);
  text-decoration: none;
  white-space: nowrap;
}

.vix-nav__brand:hover {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.vix-nav__brand-name {
  font-size: 17px;
  font-weight: 760;
  letter-spacing: -0.035em;
}

.vix-nav__slash {
  color: var(--vp-c-text-2);
  font-size: 18px;
  font-weight: 500;
}

.vix-nav__docs {
  color: var(--vp-c-text-1);
  font-size: 17px;
  font-weight: 720;
  letter-spacing: -0.03em;
}

.vix-nav__links {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  min-width: 0;
  overflow: hidden;
}

.vix-nav__link {
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  font-weight: 620;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.14s ease,
    background-color 0.14s ease;
}

.vix-nav__link:hover {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.vix-nav__link.is-active {
  color: var(--vp-c-text-1) !important;
  font-weight: 760 !important;
}

.vix-nav__link.is-active::after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 2px;
  border-radius: 999px;
  background: #22c55e;
}

.vix-nav__link {
  position: relative;
}

.vix-nav__link.is-active {
  color: var(--vp-c-text-1) !important;
  font-weight: 760 !important;
}

.vix-nav__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
}

.vix-nav__theme,
.vix-nav__icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  color: var(--vp-c-text-1) !important;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  opacity: 1 !important;
  flex-shrink: 0;
  transition:
    background 0.14s ease,
    border-color 0.14s ease,
    transform 0.14s ease;
}

.vix-nav__theme {
  border-radius: 999px;
}

.vix-nav__theme:hover,
.vix-nav__icon:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-text-2);
  transform: translateY(-1px);
}

.vix-nav__theme svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.vix-nav__social-svg {
  display: block;
  width: 17px;
  height: 17px;
  color: currentColor !important;
  fill: currentColor !important;
}

.vix-nav__social-svg path {
  fill: currentColor !important;
}

.vix-nav__search {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 36px;
  padding: 0 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.vix-nav__search:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-text-2);
}

.vix-nav__search svg {
  width: 17px;
  height: 17px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.vix-nav__search span {
  font-size: 13px;
  font-weight: 650;
  white-space: nowrap;
}

.vix-nav__search kbd {
  color: var(--vp-c-text-2);
  background: transparent;
  border: 0;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.vix-nav__banner a {
  color: #4ade80 !important;
  font-weight: 760;
  text-decoration: underline !important;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 4px;
  white-space: nowrap;
}

.vix-nav__banner a:hover {
  color: #86efac !important;
  text-decoration: underline !important;
}
/* Medium screens */
@media (max-width: 1180px) {
  .vix-nav__inner {
    gap: 18px;
  }

  .vix-nav__links {
    gap: 14px;
  }

  .vix-nav__link {
    font-size: 13px;
  }

  .vix-nav__search span {
    display: none;
  }
}

/* Tablet */
@media (max-width: 980px) {
  .vix-nav__bar {
    height: auto;
    min-height: 58px;
  }

  .vix-nav__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 14px;
    padding: 12px 14px;
  }

  .vix-nav__brand {
    order: 1;
    flex: 1 1 auto;
  }

  .vix-nav__right {
    order: 2;
    flex: 0 0 auto;
  }

  .vix-nav__links {
    order: 3;
    flex: 1 1 100%;
    width: 100%;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 0 2px;
    scrollbar-width: none;
  }

  .vix-nav__links::-webkit-scrollbar {
    display: none;
  }

  .vix-nav__link {
    padding: 8px 10px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 999px;
    font-size: 12.5px;
    flex-shrink: 0;
  }

  .vix-nav__search {
    width: 32px;
    height: 32px;
    padding: 0;
    justify-content: center;
  }

  .vix-nav__search kbd {
    display: none;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .vix-nav__banner {
    justify-content: flex-start;
    min-height: 38px;
    padding: 8px 44px 8px 12px;
    font-size: 11.5px;
    text-align: left;
  }

  .vix-nav__banner-mark {
    width: 19px;
    height: 19px;
  }

  .vix-nav__banner-mark svg {
    width: 19px;
    height: 19px;
  }

  .vix-nav__banner-close {
    right: 10px;
    width: 28px;
    height: 28px;
  }

  .vix-nav__inner {
    padding: 10px 12px;
  }

  .vix-nav__brand-name {
    font-size: 15.5px;
    font-weight: 780;
  }

  .vix-nav__slash,
  .vix-nav__docs {
    display: none;
  }

  .vix-nav__theme,
  .vix-nav__icon,
  .vix-nav__search {
    width: 30px;
    height: 30px;
  }

  .vix-nav__right {
    gap: 6px;
  }
}

/* Small mobile */
@media (max-width: 420px) {
  .vix-nav__banner {
    gap: 4px;
    font-size: 11px;
  }

  .vix-nav__banner a {
    max-width: 96px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vix-nav__inner {
    gap: 8px;
  }

  .vix-nav__link {
    padding: 7px 9px;
    font-size: 12px;
  }
}
/* ============================================================
   Vix.cpp docs footer
   ============================================================ */

.vix-footer {
  position: relative;
  flex-shrink: 0;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.vix-footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px 32px 14px;
  display: grid;
  grid-template-columns: minmax(220px, auto) 1fr;
  align-items: center;
  gap: 24px;
}

.vix-footer-brand {
  min-width: 0;
}

.vix-footer-name {
  display: block;
  font-size: 13px;
  line-height: 1.3;
  font-weight: 760;
  letter-spacing: -0.015em;
  color: var(--vp-c-text-1);
}

.vix-footer-desc {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.vix-footer-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  flex-wrap: wrap;
}

.vix-footer-link {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.12s ease;
}

.vix-footer-link:hover {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.vix-footer-meta {
  position: relative;
  max-width: 1180px;
  margin: 0 auto;
  padding: 10px 32px 16px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  flex-wrap: wrap;
  font-size: 11.5px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.vix-footer-meta::before {
  content: "";
  position: absolute;
  top: 0;
  left: calc(-1 * var(--vix-doc-sidebar-width, 300px));
  right: 0;
  height: 1px;
  background: var(--vp-c-divider);
}

@media (min-width: 960px) {
  .vix-footer {
    margin-left: 0 !important;
    padding-left: var(--vix-doc-sidebar-width, 300px);
    border-left: 0 !important;
  }

  .vix-footer-inner,
  .vix-footer-meta {
    max-width: none;
    margin-left: 0;
    margin-right: 0;
  }
}

@media (min-width: 1440px) {
  .vix-footer {
    padding-left: var(--vix-doc-sidebar-width, 320px);
  }

  .vix-footer-meta::before {
    left: calc(-1 * var(--vix-doc-sidebar-width, 320px));
  }
}

@media (max-width: 1180px) {
  .vix-nav__inner {
    gap: 24px;
  }

  .vix-nav__links {
    gap: 18px;
  }

  .vix-nav__link {
    font-size: 14px;
  }

  .vix-nav__search span {
    display: none;
  }
}

@media (max-width: 959px) {
  .vix-nav__banner {
    height: 40px;
    justify-content: flex-start;
    padding: 0 48px 0 16px;
    font-size: 12px;
  }

  .vix-nav__bar {
    height: 58px;
  }

  .vix-nav__inner {
    grid-template-columns: auto 1fr auto;
    gap: 16px;
    padding: 0 16px;
  }

  .vix-nav__brand-name {
    font-size: 16px;
    font-weight: 750;
  }

  .vix-nav__slash,
  .vix-nav__docs,
  .vix-nav__links,
  .vix-nav__search {
    display: none;
  }

  .vix-nav__right {
    gap: 8px;
  }

  .vix-nav__theme,
  .vix-nav__icon {
    width: 30px;
    height: 30px;
  }

  .vix-footer {
    margin-left: 0 !important;
    padding-left: 0 !important;
    border-left: 0;
  }

  .vix-footer-meta::before {
    left: 0;
  }
}

@media (max-width: 760px) {
  .vix-footer-inner {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 16px 18px 12px;
  }

  .vix-footer-nav {
    justify-content: flex-start;
    gap: 14px;
  }

  .vix-footer-meta {
    padding: 10px 18px 14px;
    gap: 10px;
  }
}

@media (max-width: 520px) {
  .vix-nav__banner {
    gap: 4px;
    padding: 0 42px 0 12px;
    font-size: 11.5px;
  }

  .vix-nav__banner a {
    display: inline-flex;
    color: #ffffff;
    font-weight: 750;
    text-decoration: underline;
    text-underline-offset: 3px;
    white-space: nowrap;
  }
}

@media (max-width: 460px) {
  .vix-footer-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }

  .vix-footer-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
