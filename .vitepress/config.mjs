import { defineConfig } from "vitepress";

const nav = [
  {
    text: "Vix.cpp",
    link: "https://vixcpp.com",
  },
  {
    text: "Registry",
    link: "https://registry.vixcpp.com/",
  },
  {
    text: "GitHub",
    link: "https://github.com/rixcpp/rix",
  },
];

const gettingStarted = {
  text: "Getting Started",
  collapsed: false,
  items: [
    {
      text: "Welcome to Rix",
      link: "/getting-started/",
    },
    {
      text: "What is Rix?",
      link: "/getting-started/what-is-rix",
    },
    {
      text: "Installation",
      link: "/getting-started/installation",
    },
    {
      text: "Quick Start",
      link: "/getting-started/quick-start",
    },
    {
      text: "Use the Rix Facade",
      link: "/getting-started/use-the-facade",
    },
  ],
};

const facade = {
  text: "Rix Facade",
  collapsed: false,
  items: [
    {
      text: "Overview",
      link: "/facade/",
    },
    {
      text: "Feature Macros",
      link: "/facade/feature-macros",
    },
    {
      text: "Lightweight Usage",
      link: "/facade/lightweight-usage",
    },
    {
      text: "Facade API",
      link: "/facade/api",
    },
  ],
};

const packages = {
  text: "Packages",
  collapsed: false,
  items: [
    {
      text: "Overview",
      link: "/packages/",
    },
    {
      text: "Auth",
      collapsed: false,
      items: [
        {
          text: "Overview",
          link: "/packages/auth/",
        },
        {
          text: "Quick Start",
          link: "/packages/auth/quick-start",
        },
        {
          text: "Register and Login",
          link: "/packages/auth/register-login",
        },
        {
          text: "Password Hashing",
          link: "/packages/auth/password-hashing",
        },
        {
          text: "Sessions",
          link: "/packages/auth/sessions",
        },
        {
          text: "Tokens",
          link: "/packages/auth/tokens",
        },
        {
          text: "Configuration",
          link: "/packages/auth/configuration",
        },
        {
          text: "Memory Store",
          link: "/packages/auth/memory-store",
        },
        {
          text: "Database Store",
          link: "/packages/auth/database-store",
        },
        {
          text: "Errors",
          link: "/packages/auth/errors",
        },
        {
          text: "Security Notes",
          link: "/packages/auth/security",
        },
        {
          text: "API Reference",
          link: "/packages/auth/api-reference",
        },
      ],
    },
    {
      text: "CSV",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/packages/csv/",
        },
        {
          text: "Quick Start",
          link: "/packages/csv/quick-start",
        },
        {
          text: "Parse CSV",
          link: "/packages/csv/parse",
        },
        {
          text: "Write CSV",
          link: "/packages/csv/write",
        },
        {
          text: "Options",
          link: "/packages/csv/options",
        },
        {
          text: "API Reference",
          link: "/packages/csv/api-reference",
        },
      ],
    },
    {
      text: "Debug",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/packages/debug/",
        },
        {
          text: "Quick Start",
          link: "/packages/debug/quick-start",
        },
        {
          text: "Print",
          link: "/packages/debug/print",
        },
        {
          text: "Format",
          link: "/packages/debug/format",
        },
        {
          text: "Log",
          link: "/packages/debug/log",
        },
        {
          text: "Inspect",
          link: "/packages/debug/inspect",
        },
        {
          text: "API Reference",
          link: "/packages/debug/api-reference",
        },
      ],
    },
    {
      text: "PDF",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/packages/pdf/",
        },
        {
          text: "Quick Start",
          link: "/packages/pdf/quick-start",
        },
        {
          text: "Create a Document",
          link: "/packages/pdf/document",
        },
        {
          text: "Text",
          link: "/packages/pdf/text",
        },
        {
          text: "Tables",
          link: "/packages/pdf/tables",
        },
        {
          text: "Drawing",
          link: "/packages/pdf/drawing",
        },
        {
          text: "Metadata",
          link: "/packages/pdf/metadata",
        },
        {
          text: "Save and Write",
          link: "/packages/pdf/save-and-write",
        },
        {
          text: "Errors",
          link: "/packages/pdf/errors",
        },
        {
          text: "API Reference",
          link: "/packages/pdf/api-reference",
        },
      ],
    },
  ],
};

const examples = {
  text: "Examples",
  collapsed: true,
  items: [
    {
      text: "Overview",
      link: "/examples/",
    },
    {
      text: "Basic Rix",
      link: "/examples/basic",
    },
    {
      text: "CSV",
      link: "/examples/csv",
    },
    {
      text: "Debug",
      link: "/examples/debug",
    },
    {
      text: "Auth",
      collapsed: false,
      items: [
        {
          text: "Memory Register and Login",
          link: "/examples/auth/memory-register-login",
        },
        {
          text: "Password Hash",
          link: "/examples/auth/password-hash",
        },
        {
          text: "Session Refresh and Logout",
          link: "/examples/auth/session-refresh-logout",
        },
        {
          text: "Token Issue",
          link: "/examples/auth/token-issue",
        },
      ],
    },
    {
      text: "PDF",
      collapsed: true,
      items: [
        {
          text: "Basic PDF",
          link: "/examples/pdf/basic",
        },
        {
          text: "Text",
          link: "/examples/pdf/text",
        },
        {
          text: "Table",
          link: "/examples/pdf/table",
        },
        {
          text: "Drawing",
          link: "/examples/pdf/drawing",
        },
        {
          text: "Metadata",
          link: "/examples/pdf/metadata",
        },
        {
          text: "Make Text",
          link: "/examples/pdf/make-text",
        },
        {
          text: "Error Handling",
          link: "/examples/pdf/error-handling",
        },
      ],
    },
  ],
};

const guides = {
  text: "Guides",
  collapsed: true,
  items: [
    {
      text: "Rix and Vix.cpp",
      link: "/guides/rix-and-vixcpp",
    },
    {
      text: "Package Model",
      link: "/guides/package-model",
    },
    {
      text: "Facade vs Independent Packages",
      link: "/guides/facade-vs-independent-packages",
    },
    {
      text: "Using Rix in a Vix Project",
      link: "/guides/using-rix-in-vix-project",
    },
    {
      text: "Writing a Rix Package",
      link: "/guides/writing-a-rix-package",
    },
  ],
};

const apiReference = {
  text: "API Reference",
  collapsed: true,
  items: [
    {
      text: "Overview",
      link: "/api/",
    },
    {
      text: "Rix Facade",
      link: "/api/facade",
    },
    {
      text: "Auth",
      link: "/api/auth",
    },
    {
      text: "CSV",
      link: "/api/csv",
    },
    {
      text: "Debug",
      link: "/api/debug",
    },
    {
      text: "PDF",
      link: "/api/pdf",
    },
  ],
};

const community = {
  text: "Community",
  collapsed: true,
  items: [
    {
      text: "Contributing",
      link: "/contributing",
    },
    {
      text: "Code of Conduct",
      link: "/code-of-conduct",
    },
    {
      text: "Security",
      link: "/security",
    },
  ],
};

const sidebar = [
  gettingStarted,
  facade,
  packages,
  examples,
  guides,
  apiReference,
  community,
];

export default defineConfig({
  lang: "en-US",

  title: "Rix Documentation",
  description:
    "Rix is the unified userland library layer for Vix.cpp applications.",

  base: "/",

  cleanUrls: true,

  markdown: {
    html: true,
    lineNumbers: true,
  },

  head: [
    ["link", { rel: "icon", href: "/assets/pwa/favicon.ico" }],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/assets/pwa/favicon-16x16.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/assets/pwa/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        href: "/assets/pwa/apple-touch-icon.png",
      },
    ],

    ["meta", { name: "theme-color", content: "#0b0e14" }],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      {
        name: "apple-mobile-web-app-title",
        content: "Rix Docs",
      },
    ],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Rix Documentation" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Learn how to use Rix packages in Vix.cpp applications.",
      },
    ],
    ["meta", { property: "og:site_name", content: "Rix Documentation" }],

    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Rix Documentation" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "Rix provides optional userland libraries and a unified facade for Vix.cpp applications.",
      },
    ],
  ],

  vite: {
    optimizeDeps: {
      include: ["mark.js", "minisearch"],
    },

    ssr: {
      noExternal: ["mark.js"],
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return;
            }

            if (id.includes("minisearch")) {
              return "minisearch";
            }

            if (id.includes("mark.js")) {
              return "markjs";
            }

            return "vendor";
          },
        },
      },
    },
  },

  themeConfig: {
    siteTitle: "Rix",
    logo: "/assets/pwa/icon-192.png",

    appearance: true,

    nav,

    sidebar,

    search: {
      provider: "local",
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
          },
        },
      },
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/rixcpp/rix",
      },
      {
        icon: "x",
        link: "https://x.com/vix_cpp",
      },
    ],

    outline: {
      level: "deep",
      label: "On this page",
    },

    returnToTopLabel: "Back to top",

    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },

    editLink: {
      pattern: "https://github.com/rixcpp/docs/edit/main/:path",
      text: "Edit this page on GitHub",
    },

    docFooter: {
      prev: "Previous page",
      next: "Next page",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Rix",
    },
  },
});
