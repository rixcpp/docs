# Package Model

This guide explains the Rix package model.

Rix is organized as a collection of independent packages.

Each package can be used through the unified Rix facade or directly as an independent package.

The goal is simple:

```txt
install only what you need
use one stable naming model
keep Vix.cpp focused
keep Rix packages optional
```

## The short version

A Rix package follows this model:

```txt
Registry package  -> rix/name
Header            -> <rix/name.hpp>
Facade access     -> rix.name
Namespace         -> rixlib::name
```

Example:

```txt
Registry package  -> rix/pdf
Header            -> <rix/pdf.hpp>
Facade access     -> rix.pdf
Namespace         -> rixlib::pdf
```

The unified facade package is:

```txt
rix/rix
```

It provides:

```cpp
#include <rix.hpp>
```

and the global facade object:

```cpp
rix
```

## What a Rix package is

A Rix package is an optional library installed through the Vix Registry.

Examples:

```txt
rix/auth
rix/csv
rix/debug
rix/pdf
```

Each package owns a focused area.

For example:

```txt
rix/auth   -> authentication helpers
rix/csv    -> CSV parsing and writing
rix/debug  -> debug printing, formatting, inspection
rix/pdf    -> PDF document generation
```

Rix packages are userland libraries.

They are not built into Vix Core.

## What `rix/rix` is

`rix/rix` is the unified facade package.

It groups mounted Rix packages behind one public object:

```cpp
rix
```

Example:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");

  auto doc = rix.pdf.document();

  return 0;
}
```

The facade makes application code cleaner:

```cpp
rix.auth.memory()
rix.csv.parse(...)
rix.debug.print(...)
rix.pdf.document()
```

## Two ways to use a package

There are two supported usage styles.

Use the unified facade:

```cpp
#include <rix.hpp>
```

Then:

```cpp
rix.pdf.document()
```

Or use an independent package:

```cpp
#include <rix/pdf.hpp>
```

Then:

```cpp
auto pdf = rixlib::pdf::module();
```

For most documentation and application examples, prefer the unified facade.

## Facade usage

Install the unified package:

```bash
vix add rix/rix
vix install
```

In `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

Use:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

This is the normal Rix style.

## Independent package usage

Install only the package you need:

```bash
vix add rix/pdf
vix install
```

In `vix.app`:

```txt
deps = [
  "rix/pdf",
]
```

Use:

```cpp
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix/pdf");

  auto saved = pdf.save(doc, "hello.pdf");

  return saved.ok() ? 0 : 1;
}
```

Use this style when a project only needs one package and does not need the unified facade.

## Registry package names

Rix Registry packages use this pattern:

```txt
rix/name
```

Examples:

```txt
rix/auth
rix/csv
rix/debug
rix/pdf
rix/rix
```

The package name should be short, stable, and lowercase.

Use:

```bash
vix add rix/name
vix install
```

Example:

```bash
vix add rix/pdf
vix install
```

## Header names

Independent package headers use:

```cpp
#include <rix/name.hpp>
```

Examples:

```cpp
#include <rix/auth.hpp>
#include <rix/csv.hpp>
#include <rix/debug.hpp>
#include <rix/pdf.hpp>
```

The unified facade uses:

```cpp
#include <rix.hpp>
```

## Facade names

Facade access uses:

```cpp
rix.name
```

Examples:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

The facade should expose the public API that applications are expected to use.

## Namespace names

Rix package namespaces use:

```cpp
rixlib::name
```

Examples:

```cpp
rixlib::auth
rixlib::csv
rixlib::debug
rixlib::pdf
```

Types live in package namespaces.

Facade members expose package modules.

Example:

```cpp
rixlib::pdf::Table table;

auto doc = rix.pdf.document();
```

## Package naming table

| Package     | Header            | Facade      | Namespace       |
| ----------- | ----------------- | ----------- | --------------- |
| `rix/auth`  | `<rix/auth.hpp>`  | `rix.auth`  | `rixlib::auth`  |
| `rix/csv`   | `<rix/csv.hpp>`   | `rix.csv`   | `rixlib::csv`   |
| `rix/debug` | `<rix/debug.hpp>` | `rix.debug` | `rixlib::debug` |
| `rix/pdf`   | `<rix/pdf.hpp>`   | `rix.pdf`   | `rixlib::pdf`   |
| `rix/rix`   | `<rix.hpp>`       | `rix.*`     | `rixlib`        |

## Dependency location in `vix.app`

Rix packages are Vix Registry dependencies.

They go in `deps`:

```txt
deps = [
  "rix/rix",
]
```

Do not put Rix packages in `packages`.

Wrong:

```txt
packages = [
  "rix/rix",
]
```

Correct:

```txt
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## Minimal Vix app with Rix

```txt
name = "my-app"
type = "executable"
standard = "c++20"
output_dir = "bin"

sources = [
  "src/main.cpp",
]

include_dirs = [
  "include",
  "src",
]

deps = [
  "rix/rix",
]

packages = [
  "vix",
]

links = [
  "vix::vix",
]
```

Then in `src/main.cpp`:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

Build and run:

```bash
vix build
vix run
```

## Package independence

Each Rix package should be usable independently.

For example, `rix/pdf` should be usable without pulling the full facade:

```cpp
#include <rix/pdf.hpp>
```

This keeps packages focused and reusable.

The facade package `rix/rix` should mount those independent packages for convenient application usage.

## Facade mounting

The unified facade mounts available packages as members.

Example shape:

```cpp
class Rix
{
public:
  rixlib::csv::Csv csv{};
  rixlib::debug::Debug debug{};
  rixlib::auth::AuthModule auth{};
  rixlib::pdf::PdfModule pdf{};
};
```

Then:

```cpp
inline constexpr rixlib::Rix rix{};
```

Application code uses:

```cpp
rix.csv
rix.debug
rix.auth
rix.pdf
```

## Feature macros

The facade can be made lighter with feature macros.

If no `RIX_ENABLE_*` macro is defined, the facade enables all mounted modules by default.

This keeps simple code working:

```cpp
#include <rix.hpp>
```

If at least one macro is defined, only selected modules are mounted.

Example:

```cpp
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  rix.debug.print("PDF ready");

  return 0;
}
```

Available macros include:

```txt
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

## When to use `rix/rix`

Use `rix/rix` when:

```txt
you want the public facade
you want one include
you use several Rix packages
you are writing application code
you are writing documentation examples
you want rix.auth, rix.csv, rix.debug, rix.pdf
```

Install:

```bash
vix add rix/rix
vix install
```

Use:

```cpp
#include <rix.hpp>
```

## When to use an independent package

Use an independent package when:

```txt
you only need one package
you are building a focused library
you want smaller dependency scope
you do not need the global rix facade
```

Example:

```bash
vix add rix/pdf
vix install
```

Then:

```cpp
#include <rix/pdf.hpp>
```

## Package API design

A Rix package should expose a simple public module.

For example, `rix/pdf` exposes:

```cpp
rix.pdf.document()
rix.pdf.save(...)
rix.pdf.write(...)
rix.pdf.make_text(...)
rix.pdf.error.to_string(...)
```

The public module should keep common workflows short.

More detailed types can stay in the package namespace:

```cpp
rixlib::pdf::Document
rixlib::pdf::Page
rixlib::pdf::Table
rixlib::pdf::Color
rixlib::pdf::TextStyle
```

This keeps the facade simple while still allowing advanced control.

## Result and status pattern

Packages that can fail should prefer explicit results.

Example from `rix/pdf`:

```cpp
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

Example from `rix/auth`:

```cpp
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});

if (registered.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(registered.error()),
      registered.error().message());

  return 1;
}
```

This keeps expected failures visible and avoids hiding normal errors behind exceptions.

## Error module pattern

Packages with domain errors should expose error helpers through the package module.

Examples:

```cpp
rix.auth.error.to_string(error)
rix.pdf.error.to_string(error)
```

This gives applications one stable place to convert errors to readable strings.

## Version helpers

Packages can expose version helpers.

Example:

```cpp
rix.pdf.version()
rix.pdf.version_major()
rix.pdf.version_minor()
rix.pdf.version_patch()
```

Version helpers are useful for diagnostics, examples, and compatibility checks.

## Debug package rule

`rix/debug` is useful for examples, formatting, printing, and inspection.

For real Vix application logs, prefer the Vix logging system.

Use:

```cpp
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.format(...)
rix.debug.inspect(...)
```

for documentation examples and small tools.

Use Vix logging for production application logs.

## Package docs style

Documentation should normally show the public facade first:

```cpp
#include <rix.hpp>
```

Then:

```cpp
rix.pdf.document()
rix.auth.memory()
rix.csv.parse(...)
rix.debug.print(...)
```

Independent package usage can be shown later as an alternative:

```cpp
#include <rix/pdf.hpp>
```

Then:

```cpp
auto pdf = rixlib::pdf::module();
```

This keeps documentation consistent.

## Single-file usage

For small experiments:

```bash
mkdir -p ~/rix-package-model
cd ~/rix-package-model
touch main.cpp
```

Add:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

Run:

```bash
vix run main.cpp
```

If Rix is not available globally:

```bash
vix install -g rix/rix
vix run main.cpp
```

## Project usage

For real projects:

```bash
vix new my-app --app
cd my-app
vix add rix/rix
vix install
```

Then use:

```cpp
#include <rix.hpp>
```

and keep:

```txt
deps = [
  "rix/rix",
]
```

Build and run:

```bash
vix build
vix run
```

## Adding a new Rix package

A new Rix package should follow the same model.

For a package named `json`, the expected shape would be:

```txt
Registry package  -> rix/json
Header            -> <rix/json.hpp>
Facade access     -> rix.json
Namespace         -> rixlib::json
```

The independent package should be usable alone:

```cpp
#include <rix/json.hpp>
```

The facade package can mount it later:

```cpp
rix.json
```

The package should remain optional.

## New package checklist

Before adding a package, check:

```txt
Is the package optional?
Is the name short and stable?
Does it fit the rix/name model?
Can it be used independently?
Can it be mounted into rix/rix?
Does it expose a simple public module?
Does it keep internals hidden?
Does it return explicit results for expected failures?
Does it belong in userland instead of Vix Core?
```

If the answer is yes, it fits the Rix package model.

## What belongs in Vix.cpp

Vix.cpp should own:

```txt
CLI workflow
project creation
build and run workflow
registry install workflow
runtime foundation
HTTP and WebSocket runtime
service and deployment workflow
core backend infrastructure
```

Example commands:

```bash
vix new
vix add
vix install
vix build
vix run
vix tests
```

## What belongs in Rix

Rix should own optional application-level libraries:

```txt
auth
csv
debug helpers
pdf generation
future userland packages
```

Rix packages should help applications without making Vix.cpp heavier.

## Common mistakes

### Calling Rix a package manager

Rix is not the package manager.

Vix owns the package workflow:

```bash
vix add rix/rix
vix install
```

### Calling Rix a runtime

Rix is not the runtime.

Vix.cpp owns the runtime.

Rix packages are libraries used inside the application.

### Putting Rix in `packages`

Wrong:

```txt
packages = [
  "rix/pdf",
]
```

Correct:

```txt
deps = [
  "rix/pdf",
]
```

### Using different naming models per package

Avoid:

```txt
@rix/name
rix_name
RixName
vix/name
```

Use the stable model:

```txt
rix/name
<rix/name.hpp>
rix.name
rixlib::name
```

### Making every package part of `rix/rix` too early

Independent packages should work first.

Mount into the facade when the public API is stable enough.

### Exposing internals first

Application docs should not start from writer internals or low-level implementation details.

Start from the facade:

```cpp
rix.pdf.document()
```

Then document advanced types later.

## What you should remember

Rix packages use one model:

```txt
Registry package  -> rix/name
Header            -> <rix/name.hpp>
Facade access     -> rix.name
Namespace         -> rixlib::name
```

Use `rix/rix` for the unified facade:

```bash
vix add rix/rix
vix install
```

Use:

```cpp
#include <rix.hpp>
```

and:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

Use independent packages when needed:

```bash
vix add rix/pdf
vix install
```

and:

```cpp
#include <rix/pdf.hpp>
```

Always put Rix packages in `deps`:

```txt
deps = [
  "rix/rix",
]
```

## Next step

Continue with package rules.

Next: [Package rules](./writing-a-rix-package)
