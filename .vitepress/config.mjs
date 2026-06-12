import { defineConfig } from "vitepress";

const nav = [
  {
    text: "Download PDF",
    link: "/vixcpp-documentation.pdf",
  },
  {
    text: "Registry",
    link: "https://registry.vixcpp.com/",
  },
];

const gettingStarted = {
  text: "Getting Started",
  collapsed: false,
  items: [
    {
      text: "Welcome to Vix.cpp",
      link: "/getting-started/",
    },
    {
      text: "What is Vix.cpp?",
      link: "/getting-started/what-is-vixcpp",
    },
    {
      text: "Installation",
      link: "/getting-started/installation",
    },
    {
      text: "Set Up Your Environment",
      link: "/getting-started/setup-environment",
    },
    {
      text: "Run Your First C++ File",
      link: "/getting-started/run-your-first-file",
    },
    {
      text: "Create Your First Project",
      link: "/getting-started/create-your-first-project",
    },
    {
      text: "Your First HTTP Server",
      link: "/getting-started/first-http-server",
    },
  ],
};

const projectTemplates = {
  text: "Project Templates",
  collapsed: true,
  items: [
    {
      text: "Overview",
      link: "/templates/",
    },
    {
      text: "Application",
      link: "/templates/application",
    },
    {
      text: "Backend",
      link: "/templates/backend",
    },
    {
      text: "Web",
      link: "/templates/web",
    },
    {
      text: "Vue",
      link: "/templates/vue",
    },
    {
      text: "Game",
      link: "/templates/game",
    },
    {
      text: "Library",
      link: "/templates/library",
    },
  ],
};

const vixBook = {
  text: "The Vix Book",
  collapsed: true,
  items: [
    {
      text: "Introduction",
      link: "/book/01-introduction",
    },
    {
      text: "Why Vix Exists",
      link: "/book/02-why-vix",
    },
    {
      text: "Mental Model",
      link: "/book/03-mental-model",
    },
    {
      text: "Application Model",
      link: "/book/04-application-model",
    },
    {
      text: "Runtime Workflow",
      link: "/book/05-runtime-workflow",
    },
    {
      text: "Build Workflow",
      link: "/book/06-build-workflow",
    },
    {
      text: "Modules and Composition",
      link: "/book/07-modules-and-composition",
    },
    {
      text: "From Local to Production",
      link: "/book/08-local-to-production",
    },
    {
      text: "Next Steps",
      link: "/book/09-next-steps",
    },
  ],
};

const guides = {
  text: "Guides",
  collapsed: true,
  items: [
    {
      text: "Understand Vix.cpp",
      collapsed: true,
      items: [
        {
          text: "What is Vix.cpp?",
          link: "/getting-started/what-is-vixcpp",
        },
        {
          text: "Vix.cpp vs CMake",
          link: "/guides/vix-vs-cmake",
        },
        {
          text: "C++ Runtime",
          link: "/guides/cpp-runtime",
        },
        {
          text: "C++ Developer Toolkit",
          link: "/guides/cpp-developer-toolkit",
        },
      ],
    },
    {
      text: "Application Workflows",
      collapsed: true,
      items: [
        {
          text: "Build a REST API",
          link: "/guides/build-rest-api",
        },
        {
          text: "WebSocket Chat",
          link: "/guides/websocket-chat",
        },
        {
          text: "Static Files",
          link: "/guides/static-files",
        },
        {
          text: "Templates",
          link: "/guides/templates",
        },
        {
          text: "Game",
          link: "/guides/game",
        },
      ],
    },
    {
      text: "Backend Essentials",
      collapsed: true,
      items: [
        {
          text: "Validation",
          link: "/guides/validation",
        },
        {
          text: "Authentication",
          link: "/guides/authentication",
        },
        {
          text: "Sessions",
          link: "/guides/sessions",
        },
        {
          text: "CORS",
          link: "/guides/cors",
        },
        {
          text: "Rate Limiting",
          link: "/guides/rate-limiting",
        },
      ],
    },
    {
      text: "Data",
      collapsed: true,
      items: [
        {
          text: "JSON",
          link: "/guides/json/",
        },
        {
          text: "Quick Start",
          link: "/guides/json/quick-start",
        },
        {
          text: "Build JSON",
          link: "/guides/json/build-json",
        },
        {
          text: "Parse JSON",
          link: "/guides/json/parse-json",
        },
        {
          text: "Write JSON",
          link: "/guides/json/write-json",
        },
        {
          text: "Safe Access",
          link: "/guides/json/safe-access",
        },
        {
          text: "JPath",
          link: "/guides/json/jpath",
        },
        {
          text: "Simple Token",
          link: "/guides/json/simple-token",
        },
        {
          text: "JSON with HTTP",
          link: "/guides/json/http",
        },
      ],
    },
    {
      text: "Database",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/guides/database/",
        },
        {
          text: "Quick Start",
          link: "/guides/database/quick-start",
        },
        {
          text: "Configuration",
          link: "/guides/database/configuration",
        },
        {
          text: "SQLite",
          link: "/guides/database/sqlite",
        },
        {
          text: "MySQL",
          link: "/guides/database/mysql",
        },
        {
          text: "Queries",
          link: "/guides/database/queries",
        },
        {
          text: "Connection Pool",
          link: "/guides/database/connection-pool",
        },
        {
          text: "Transactions",
          link: "/guides/database/transactions",
        },
        {
          text: "Migrations",
          link: "/guides/database/migrations",
        },
        {
          text: "Schema Snapshots",
          link: "/guides/database/schema-snapshots",
        },
        {
          text: "CLI",
          link: "/guides/database/cli",
        },
      ],
    },
    {
      text: "ORM",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/guides/orm/",
        },
        {
          text: "Quick Start",
          link: "/guides/orm/quick-start",
        },
        {
          text: "Entities",
          link: "/guides/orm/entities",
        },
        {
          text: "Mappers",
          link: "/guides/orm/mappers",
        },
        {
          text: "Repositories",
          link: "/guides/orm/repositories",
        },
        {
          text: "Query Builder",
          link: "/guides/orm/query-builder",
        },
        {
          text: "Unit of Work",
          link: "/guides/orm/unit-of-work",
        },
        {
          text: "With vix::db",
          link: "/guides/orm/with-vix-db",
        },
      ],
    },
    {
      text: "Build Performance",
      collapsed: true,
      items: [
        {
          text: "Fast Target Builds",
          link: "/guides/fast-target-builds",
        },
        {
          text: "Object Cache",
          link: "/guides/object-cache",
        },
        {
          text: "Artifact Cache",
          link: "/guides/artifact-cache",
        },
      ],
    },
    {
      text: "Runtime Workflows",
      collapsed: true,
      items: [
        {
          text: "Replay a Run",
          link: "/guides/replay",
        },
        {
          text: "Runtime Arguments",
          link: "/guides/runtime-arguments",
        },
        {
          text: "Diagnostics",
          link: "/guides/diagnostics",
        },
      ],
    },
    {
      text: "Production",
      collapsed: true,
      items: [
        {
          text: "Nginx + systemd",
          link: "/guides/production-nginx-systemd",
        },
      ],
    },
  ],
};

const vixApp = {
  text: "vix.app",
  collapsed: true,
  items: [
    {
      text: "Overview",
      link: "/guides/vix-app/",
    },
    {
      text: "Getting Started",
      link: "/guides/vix-app/getting-started",
    },
    {
      text: "Manifest Reference",
      link: "/guides/vix-app/manifest-reference",
    },
    {
      text: "Examples",
      link: "/guides/vix-app/examples",
    },
    {
      text: "Packages and Links",
      link: "/guides/vix-app/packages-and-links",
    },
    {
      text: "Tests",
      link: "/guides/vix-app/tests",
    },
    {
      text: "Project Types",
      link: "/guides/vix-app/project-types",
    },
    {
      text: "Sources and Includes",
      link: "/guides/vix-app/sources-and-includes",
    },
    {
      text: "Compile Options",
      link: "/guides/vix-app/compile-options",
    },
    {
      text: "Resources",
      link: "/guides/vix-app/resources",
    },
    {
      text: "Output Directory",
      link: "/guides/vix-app/output-directory",
    },
    {
      text: "Libraries",
      link: "/guides/vix-app/libraries",
    },
    {
      text: "Migrating from CMake",
      link: "/guides/vix-app/migration-from-cmake",
    },
    {
      text: "CMake Fallback",
      link: "/guides/vix-app/cmake-fallback",
    },
    {
      text: "Troubleshooting",
      link: "/guides/vix-app/troubleshooting",
    },
    {
      text: "Best Practices",
      link: "/guides/vix-app/best-practices",
    },
  ],
};

const middleware = {
  text: "Middleware",
  collapsed: false,
  items: [
    {
      text: "Overview",
      link: "/modules/middleware/",
    },
    {
      text: "Quick Start",
      link: "/modules/middleware/quick-start",
    },
    {
      text: "App Integration",
      link: "/modules/middleware/app-integration",
    },
    {
      text: "Core Concepts",
      link: "/modules/middleware/concepts",
    },
    {
      text: "Basics",
      link: "/modules/middleware/basics",
    },
    {
      text: "Security",
      link: "/modules/middleware/security",
    },
    {
      text: "Authentication",
      link: "/modules/middleware/authentication",
    },
    {
      text: "Parsers",
      link: "/modules/middleware/parsers",
    },
    {
      text: "HTTP Cache",
      link: "/modules/middleware/http-cache",
    },
    {
      text: "Performance",
      link: "/modules/middleware/performance",
    },
    {
      text: "Observability",
      link: "/modules/middleware/observability",
    },
    {
      text: "API Reference",
      link: "/modules/middleware/api-reference",
    },
  ],
};

const cli = {
  text: "CLI",
  collapsed: true,
  items: [
    {
      text: "Overview",
      link: "/cli/",
    },
    {
      text: "All Commands",
      link: "/cli/commands",
    },
    {
      text: "Core Workflow",
      collapsed: true,
      items: [
        {
          text: "vix repl",
          link: "/cli/repl",
        },
        {
          text: "vix new",
          link: "/cli/new",
        },
        {
          text: "vix make",
          link: "/cli/make",
        },
        {
          text: "vix modules",
          link: "/cli/modules",
        },
        {
          text: "vix run",
          link: "/cli/run",
        },
        {
          text: "vix dev",
          link: "/cli/dev",
        },
        {
          text: "vix build",
          link: "/cli/build",
        },
        {
          text: "vix check",
          link: "/cli/check",
        },
        {
          text: "vix tests",
          link: "/cli/tests",
        },
        {
          text: "vix fmt",
          link: "/cli/fmt",
        },
      ],
    },
    {
      text: "Project State",
      collapsed: true,
      items: [
        {
          text: "vix clean",
          link: "/cli/clean",
        },
        {
          text: "vix reset",
          link: "/cli/reset",
        },
        {
          text: "vix replay",
          link: "/cli/replay",
        },
        {
          text: "vix task",
          link: "/cli/task",
        },
      ],
    },
    {
      text: "Dependencies",
      collapsed: true,
      items: [
        {
          text: "vix search",
          link: "/cli/search",
        },
        {
          text: "vix add",
          link: "/cli/add",
        },
        {
          text: "vix install",
          link: "/cli/install",
        },
        {
          text: "vix update",
          link: "/cli/update",
        },
        {
          text: "vix outdated",
          link: "/cli/outdated",
        },
        {
          text: "vix remove",
          link: "/cli/remove",
        },
        {
          text: "vix list",
          link: "/cli/list",
        },
      ],
    },
    {
      text: "Registry and Packages",
      collapsed: true,
      items: [
        {
          text: "vix registry",
          link: "/cli/registry",
        },
        {
          text: "vix store",
          link: "/cli/store",
        },
        {
          text: "vix pack",
          link: "/cli/pack",
        },
        {
          text: "vix verify",
          link: "/cli/verify",
        },
        {
          text: "vix cache",
          link: "/cli/cache",
        },
        {
          text: "vix publish",
          link: "/cli/publish",
        },
        {
          text: "vix unpublish",
          link: "/cli/unpublish",
        },
      ],
    },
    {
      text: "Runtime and Production",
      collapsed: true,
      items: [
        {
          text: "vix env",
          link: "/cli/env",
        },
        {
          text: "vix service",
          link: "/cli/service",
        },
        {
          text: "vix proxy",
          link: "/cli/proxy",
        },
        {
          text: "vix deploy",
          link: "/cli/deploy",
        },
        {
          text: "vix health",
          link: "/cli/health",
        },
        {
          text: "vix logs",
          link: "/cli/logs",
        },
        {
          text: "vix ws",
          link: "/cli/ws",
        },
      ],
    },
    {
      text: "Data",
      collapsed: true,
      items: [
        {
          text: "vix db",
          link: "/cli/db",
        },
        {
          text: "vix orm",
          link: "/cli/orm",
        },
      ],
    },
    {
      text: "Advanced Runtime",
      collapsed: true,
      items: [
        {
          text: "vix p2p",
          link: "/cli/p2p",
        },
        {
          text: "vix game",
          link: "/cli/game",
        },
        {
          text: "vix agent",
          link: "/cli/agent",
        },
      ],
    },
    {
      text: "System",
      collapsed: true,
      items: [
        {
          text: "vix info",
          link: "/cli/info",
        },
        {
          text: "vix doctor",
          link: "/cli/doctor",
        },
        {
          text: "vix upgrade",
          link: "/cli/upgrade",
        },
        {
          text: "vix uninstall",
          link: "/cli/uninstall",
        },
        {
          text: "vix completion",
          link: "/cli/completion",
        },
      ],
    },
  ],
};

const examples = {
  text: "Examples",
  collapsed: false,
  items: [
    {
      text: "Overview",
      link: "/examples/",
    },

    {
      text: "Getting Started",
      collapsed: false,
      items: [
        {
          text: "Hello App",
          link: "/examples/hello-app",
        },
        {
          text: "JSON API",
          link: "/examples/json-api",
        },
        {
          text: "Production Bootstrap",
          link: "/examples/production-bootstrap",
        },
      ],
    },

    {
      text: "Middleware",
      collapsed: false,
      items: [
        {
          text: "Middleware API",
          link: "/examples/middleware-api",
        },
        {
          text: "HTTP Cache",
          link: "/examples/http-cache",
        },
      ],
    },

    {
      text: "Request Parsing",
      collapsed: true,
      items: [
        {
          text: "Multipart Upload",
          link: "/examples/multipart-upload",
        },
        {
          text: "Form Parser",
          link: "/examples/form-parser",
        },
      ],
    },

    {
      text: "Sessions and Cookies",
      collapsed: true,
      items: [
        {
          text: "Cookies",
          link: "/examples/cookies",
        },
        {
          text: "Session Counter",
          link: "/examples/session-counter",
        },
      ],
    },

    {
      text: "Authentication",
      collapsed: true,
      items: [
        {
          text: "API Key Auth",
          link: "/examples/auth-api-key",
        },
        {
          text: "JWT Auth",
          link: "/examples/auth-jwt",
        },
        {
          text: "RBAC",
          link: "/examples/auth-rbac",
        },
      ],
    },

    {
      text: "Static Files",
      collapsed: false,
      items: [
        {
          text: "Static Site",
          link: "/examples/static-site",
        },
      ],
    },

    {
      text: "Realtime",
      collapsed: false,
      items: [
        {
          text: "WebSocket Chat",
          link: "/examples/websocket-chat",
        },
      ],
    },

    {
      text: "Database",
      collapsed: false,
      items: [
        {
          text: "SQLite API",
          link: "/examples/sqlite-api",
        },
      ],
    },

    {
      text: "Async",
      collapsed: false,
      items: [
        {
          text: "Background Task",
          link: "/examples/background-task",
        },
        {
          text: "Async App",
          link: "/examples/async-app",
        },
      ],
    },
  ],
};

const apiReference = {
  text: "API Reference",
  collapsed: true,
  items: [
    {
      text: "Overview",
      link: "/api/index",
    },
    {
      text: "Core",
      collapsed: true,
      items: [
        {
          text: "Print",
          link: "/api/core/print",
        },
        {
          text: "Format",
          link: "/api/core/format",
        },
        {
          text: "Console",
          link: "/api/core/console",
        },
        {
          text: "Inspect",
          link: "/api/core/inspect",
        },
        {
          text: "Input",
          link: "/api/core/input",
        },
      ],
    },
    {
      text: "Runtime",
      collapsed: true,
      items: [
        {
          text: "HTTP",
          link: "/api/http",
        },
        {
          text: "WebSocket",
          link: "/api/websocket",
        },
        {
          text: "Async",
          link: "/api/async",
        },
        {
          text: "P2P",
          link: "/api/p2p",
        },
      ],
    },
    {
      text: "Data",
      collapsed: true,
      items: [
        {
          text: "JSON",
          link: "/api/json",
        },
        {
          text: "KV",
          link: "/api/kv",
        },
      ],
    },
    {
      text: "System",
      collapsed: true,
      items: [
        {
          text: "ThreadPool",
          link: "/api/threadpool",
        },
        {
          text: "Middleware",
          link: "/api/middleware",
        },
        {
          text: "Config",
          link: "/api/config",
        },
      ],
    },
    {
      text: "Log",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/api/log",
        },
        {
          text: "Server Pretty Logs",
          link: "/api/log/server-pretty-logs",
        },
      ],
    },
  ],
};

const modules = {
  text: "Modules",
  collapsed: true,
  items: [
    {
      text: "Core Runtime",
      collapsed: true,
      items: [
        {
          text: "Core",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/modules/core/",
            },
            {
              text: "App",
              link: "/modules/core/app",
            },
            {
              text: "Architecture",
              link: "/modules/core/architecture",
            },
            {
              text: "Routing",
              link: "/modules/core/routing",
            },
            {
              text: "Handlers",
              link: "/modules/core/handlers",
            },
            {
              text: "Middleware",
              link: "/modules/core/middleware",
            },
            {
              text: "Request",
              link: "/modules/core/request",
            },
            {
              text: "Response",
              link: "/modules/core/response",
            },
            {
              text: "Static files",
              link: "/modules/core/static-files",
            },
            {
              text: "Templates",
              link: "/modules/core/templates",
            },
            {
              text: "HTTP server",
              link: "/modules/core/http-server",
            },
            {
              text: "Sessions",
              link: "/modules/core/sessions",
            },
            {
              text: "Transports",
              link: "/modules/core/transports",
            },
            {
              text: "TLS",
              link: "/modules/core/tls",
            },
            {
              text: "Runtime executor",
              link: "/modules/core/runtime-executor",
            },
            {
              text: "Async and runtime",
              link: "/modules/core/async-and-runtime",
            },
            {
              text: "Configuration",
              link: "/modules/core/configuration",
            },
            {
              text: "Print",
              link: "/modules/core/print",
            },
            {
              text: "Format",
              link: "/modules/core/format",
            },
            {
              text: "Console",
              link: "/modules/core/console",
            },
            {
              text: "Input",
              link: "/modules/core/input",
            },
            {
              text: "Inspect",
              link: "/modules/core/inspect",
            },
            {
              text: "OpenAPI",
              link: "/modules/core/openapi",
            },
            {
              text: "Attached runtime",
              link: "/modules/core/attached-runtime",
            },
            {
              text: "API Reference",
              link: "/modules/core/api-reference",
            },
          ],
        },
        {
          text: "Async",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/modules/async/",
            },
            {
              text: "io_context",
              link: "/modules/async/io-context",
            },
            {
              text: "Tasks",
              link: "/modules/async/tasks",
            },
            {
              text: "Spawn",
              link: "/modules/async/spawn",
            },
            {
              text: "Timers",
              link: "/modules/async/timers",
            },
            {
              text: "Cancellation",
              link: "/modules/async/cancellation",
            },
            {
              text: "Thread pool",
              link: "/modules/async/thread-pool",
            },
            {
              text: "when_all / when_any",
              link: "/modules/async/when",
            },
            {
              text: "Signals",
              link: "/modules/async/signals",
            },
            {
              text: "TCP",
              link: "/modules/async/tcp",
            },
            {
              text: "UDP",
              link: "/modules/async/udp",
            },
            {
              text: "DNS",
              link: "/modules/async/dns",
            },
            {
              text: "API Reference",
              link: "/modules/async/api-reference",
            },
          ],
        },
        {
          text: "ThreadPool",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/modules/threadpool/",
            },
            {
              text: "Quick Start",
              link: "/modules/threadpool/quick-start",
            },
            {
              text: "Installation",
              link: "/modules/threadpool/installation",
            },
            {
              text: "Concepts",
              link: "/modules/threadpool/concepts",
            },
            {
              text: "Tasks",
              link: "/modules/threadpool/tasks",
            },
            {
              text: "Futures",
              link: "/modules/threadpool/futures",
            },
            {
              text: "Cancellation",
              link: "/modules/threadpool/cancellation",
            },
            {
              text: "Timeouts",
              link: "/modules/threadpool/timeouts",
            },
            {
              text: "Priorities",
              link: "/modules/threadpool/priorities",
            },
            {
              text: "Task Groups",
              link: "/modules/threadpool/task-groups",
            },
            {
              text: "Shutdown",
              link: "/modules/threadpool/shutdown",
            },
            {
              text: "Metrics",
              link: "/modules/threadpool/metrics",
            },
            {
              text: "Periodic Tasks",
              link: "/modules/threadpool/periodic-tasks",
            },
            {
              text: "Parallel For",
              link: "/modules/threadpool/parallel-for",
            },
            {
              text: "Parallel Map",
              link: "/modules/threadpool/parallel-map",
            },
            {
              text: "Parallel Reduce",
              link: "/modules/threadpool/parallel-reduce",
            },
            {
              text: "Best Practices",
              link: "/modules/threadpool/best-practices",
            },
            {
              text: "API Reference",
              link: "/modules/threadpool/api-reference",
            },
          ],
        },
      ],
    },
    {
      text: "Networking",
      collapsed: true,
      items: [
        {
          text: "WebSocket",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/modules/websocket/",
            },
            {
              text: "Quick Start",
              link: "/modules/websocket/quick-start",
            },
            {
              text: "Concepts",
              link: "/modules/websocket/concepts",
            },
            {
              text: "Configuration",
              link: "/modules/websocket/configuration",
            },
            {
              text: "Server",
              link: "/modules/websocket/server",
            },
            {
              text: "Session",
              link: "/modules/websocket/session",
            },
            {
              text: "Router",
              link: "/modules/websocket/router",
            },
            {
              text: "Messages",
              link: "/modules/websocket/messages",
            },
            {
              text: "Client",
              link: "/modules/websocket/client",
            },
            {
              text: "Rooms and Broadcasting",
              link: "/modules/websocket/rooms-and-broadcasting",
            },
            {
              text: "Long polling",
              link: "/modules/websocket/long-polling",
            },
            {
              text: "HTTP API",
              link: "/modules/websocket/http-api",
            },
            {
              text: "Attached runtime",
              link: "/modules/websocket/attached-runtime",
            },
            {
              text: "Metrics",
              link: "/modules/websocket/metrics",
            },
            {
              text: "Message store",
              link: "/modules/websocket/message-store",
            },
            {
              text: "SQLite message store",
              link: "/modules/websocket/sqlite-message-store",
            },
            {
              text: "OpenAPI",
              link: "/modules/websocket/openapi",
            },
            {
              text: "Shutdown",
              link: "/modules/websocket/shutdown",
            },
            {
              text: "API Reference",
              link: "/modules/websocket/api-reference",
            },
          ],
        },
        {
          text: "P2P",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/modules/p2p/",
            },
            {
              text: "Node",
              link: "/modules/p2p/node",
            },
            {
              text: "Discovery",
              link: "/modules/p2p/discovery",
            },
            {
              text: "Bootstrap",
              link: "/modules/p2p/bootstrap",
            },
            {
              text: "Router",
              link: "/modules/p2p/router",
            },
            {
              text: "Protocol",
              link: "/modules/p2p/protocol",
            },
            {
              text: "WAL Replication",
              link: "/modules/p2p/wal-replication",
            },
            {
              text: "HTTP Control",
              link: "/modules/p2p/http-control",
            },
            {
              text: "API Reference",
              link: "/modules/p2p/api-reference",
            },
          ],
        },
      ],
    },
    {
      text: "Data and Reliability",
      collapsed: true,
      items: [
        {
          text: "KV",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/modules/kv/",
            },
            {
              text: "Opening a database",
              link: "/modules/kv/opening",
            },
            {
              text: "Keys",
              link: "/modules/kv/keys",
            },
            {
              text: "Values",
              link: "/modules/kv/values",
            },
            {
              text: "Persistence",
              link: "/modules/kv/persistence",
            },
            {
              text: "Recovery",
              link: "/modules/kv/recovery",
            },
            {
              text: "Stats",
              link: "/modules/kv/stats",
            },
            {
              text: "API Reference",
              link: "/modules/kv/api-reference",
            },
          ],
        },
        {
          text: "Sync",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/modules/sync/",
            },
            {
              text: "WAL",
              link: "/modules/sync/wal",
            },
            {
              text: "Outbox",
              link: "/modules/sync/outbox",
            },
            {
              text: "Retry Policy",
              link: "/modules/sync/retry-policy",
            },
            {
              text: "Offline-first Model",
              link: "/modules/sync/offline-first-model",
            },
            {
              text: "API Reference",
              link: "/modules/sync/api-reference",
            },
          ],
        },
      ],
    },
  ],
};

const community = {
  text: "Community",
  collapsed: true,
  items: [
    {
      text: "Contribution",
      link: "/contributing",
    },
    {
      text: "Pull Requests",
      link: "/pull-request",
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

const internals = {
  text: "Internals",
  collapsed: true,
  items: [
    {
      text: "Architecture",
      link: "/internals/architecture",
    },
    {
      text: "Runtime Model",
      link: "/internals/runtime-model",
    },
    {
      text: "Direct Compile",
      link: "/internals/direct-compile",
    },
    {
      text: "Cache System",
      link: "/internals/cache-system",
    },
    {
      text: "Error Diagnostics",
      link: "/internals/error-diagnostics",
    },
    {
      text: "Performance",
      link: "/internals/performance",
    },
    {
      text: "Design Decisions",
      link: "/internals/design-decisions",
    },
  ],
};

const sidebar = [
  gettingStarted,
  projectTemplates,
  vixBook,
  guides,
  vixApp,
  middleware,
  cli,
  examples,
  apiReference,
  modules,
  community,
  internals,
];

export default defineConfig({
  lang: "en-US",

  title: "Vix.cpp Documentation",
  description:
    "Vix.cpp is a modern C++ runtime and developer toolkit for building, running, testing, formatting, and packaging C++ applications.",

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
        content: "Vix.cpp Docs",
      },
    ],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Vix.cpp Documentation" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Learn how to build fast and reliable C++ applications with Vix.cpp.",
      },
    ],
    ["meta", { property: "og:site_name", content: "Vix.cpp Documentation" }],

    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Vix.cpp Documentation" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "Learn how to build fast and reliable C++ applications with Vix.cpp.",
      },
    ],

    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-1B67VYZMXF",
      },
    ],
    [
      "script",
      {},
      `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
gtag("config", "G-1B67VYZMXF");
gtag("config", "AW-17078961408");
gtag("event", "ads_conversion_Pr_sentation_1", {});
`,
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
    siteTitle: "Vix.cpp",
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
        link: "https://github.com/vixcpp/vix",
      },
      {
        icon: "x",
        link: "https://x.com/",
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
      pattern: "https://github.com/vixcpp/docs/edit/main/:path",
      text: "Edit this page on GitHub",
    },

    docFooter: {
      prev: "Previous page",
      next: "Next page",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Vix.cpp",
    },
  },
});
