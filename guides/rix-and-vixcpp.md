# Rix and Vix.cpp

This guide explains the relationship between Rix and Vix.cpp.

Rix is designed for Vix.cpp projects, but it does not replace Vix.cpp.

Vix.cpp is the runtime, framework layer, CLI, registry workflow, and application foundation.

Rix is the official package namespace for optional userland libraries used by Vix.cpp applications.

## The short version

Vix.cpp gives you the application platform.

Rix gives you optional application-level libraries.

In code, a Vix.cpp application can use Rix like this:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

For a Vix project, install Rix with:

```bash
vix add rix/rix
vix install
```

and keep it in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

## What Vix.cpp is

Vix.cpp is the main C++ backend toolkit.

It provides the foundation for building and running C++ applications.

Vix.cpp owns the project workflow:

```bash
vix new
vix add
vix install
vix build
vix run
vix tests
```

Vix.cpp also owns the backend runtime layer for applications.

That includes application structure, build integration, deployment workflow, HTTP/WebSocket runtime features, services, registry integration, and developer tooling.

## What Rix is

Rix is the official userland package layer for Vix.cpp.

It provides optional packages such as:

```txt
rix/auth
rix/csv
rix/debug
rix/pdf
```

The unified facade package is:

```txt
rix/rix
```

It gives one public object:

```cpp
rix
```

with mounted package APIs:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

## What Rix is not

Rix is not a replacement for Vix.cpp.

Rix is not a CLI.

Rix is not a runtime.

Rix is not the Vix package manager.

Rix is not Vix Core.

Rix is not a standard library built into Vix.cpp.

Rix is a package namespace and library collection installed through the Vix Registry.

## Why Rix exists

Without Rix, every application-level feature could become part of Vix.cpp itself.

That would make Vix.cpp heavier.

Rix avoids that.

Vix.cpp can stay focused on the runtime, CLI, project workflow, and core backend foundation.

Rix can provide optional libraries on top:

```txt
auth
csv
debug
pdf
future packages
```

This keeps the ecosystem clean.

## The main rule

Use Vix.cpp for the application foundation.

Use Rix for optional libraries.

For example:

```txt
Project creation        -> Vix.cpp
Dependency install      -> Vix.cpp
Build and run           -> Vix.cpp
Backend runtime         -> Vix.cpp
Optional auth helpers   -> Rix
CSV helpers             -> Rix
Debug helpers           -> Rix
PDF generation          -> Rix
```

## Install Rix in a Vix project

Create a Vix application:

```bash
vix new my-app --app
cd my-app
```

Add Rix:

```bash
vix add rix/rix
vix install
```

Then use:

```cpp
#include <rix.hpp>
```

and:

```cpp
rix.debug.print("Hello from Rix");
```

## Use `deps` in `vix.app`

Rix packages are Vix Registry dependencies.

They belong in `deps`:

```txt
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

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

## Do not put Rix in `packages`

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

`deps` is for packages installed from the Vix Registry.

`packages` is for CMake package discovery.

## The public Rix API

The public Rix API should normally be used through:

```cpp
#include <rix.hpp>
```

Then:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

Example:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");

  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

## Why the facade exists

The facade exists to give one clean entry point:

```cpp
rix.*
```

Instead of forcing every application to manually create package modules.

For application code, this is easier to read:

```cpp
rix.pdf.document()
rix.auth.memory()
rix.csv.parse(...)
rix.debug.print(...)
```

The goal is a stable public style.

## Package names

Rix packages follow a stable naming model.

Registry package:

```txt
rix/name
```

Header:

```cpp
#include <rix/name.hpp>
```

Facade access:

```cpp
rix.name
```

Examples:

| Registry package | Header            | Facade      |
| ---------------- | ----------------- | ----------- |
| `rix/auth`       | `<rix/auth.hpp>`  | `rix.auth`  |
| `rix/csv`        | `<rix/csv.hpp>`   | `rix.csv`   |
| `rix/debug`      | `<rix/debug.hpp>` | `rix.debug` |
| `rix/pdf`        | `<rix/pdf.hpp>`   | `rix.pdf`   |
| `rix/rix`        | `<rix.hpp>`       | `rix.*`     |

## Unified facade package

Use `rix/rix` when you want the unified public facade.

Install:

```bash
vix add rix/rix
vix install
```

Then:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

This is the recommended style for most documentation and application examples.

## Independent package usage

A package can also be used independently.

For example, PDF only:

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

Then:

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

Use independent packages when a project intentionally wants only one package.

Use `rix/rix` when a project wants the unified facade.

## Lightweight facade usage

The unified facade can be limited with feature macros.

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

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

Available macros include:

```txt
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

## Default facade behavior

If no feature macro is defined, the facade enables all currently mounted modules.

This keeps simple examples easy:

```cpp
#include <rix.hpp>
```

Then:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

This also keeps older code working.

## Use Rix from a single file

For small examples and experiments:

```bash
mkdir -p ~/rix-example
cd ~/rix-example
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

If Rix is not available globally yet:

```bash
vix install -g rix/rix
vix run main.cpp
```

## Use Rix from an application project

For real projects, prefer project dependencies:

```bash
vix add rix/rix
vix install
```

Then keep:

```txt
deps = [
  "rix/rix",
]
```

This makes the dependency explicit and repeatable.

## Vix.cpp remains the owner of application runtime

Rix should not own the application runtime.

A Vix backend application still starts with Vix.cpp concepts.

Example:

```cpp
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  app.get("/", [](vix::Request &, vix::Response &res) {
    res.text("Hello from Vix.cpp and Rix");
  });

  app.run();

  return 0;
}
```

Rix can help inside the application.

Vix.cpp still owns the runtime.

## Example: Rix PDF inside a Vix route

```cpp
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  app.get("/report.pdf", [](vix::Request &, vix::Response &res) {
    auto doc = rix.pdf.document();

    auto &page = doc.add_page();

    page.text(
        page.x_left(),
        page.y_top(),
        "Hello from rix.pdf");

    auto bytes = rix.pdf.write(doc);

    if (bytes.failed())
    {
      res.status(500).json({
          "ok", false,
          "error", rix.pdf.error.to_string(bytes.error()),
          "message", bytes.error().message()});

      return;
    }

    res.header("Content-Type", "application/pdf");
    res.header("Content-Disposition", "inline; filename=\"report.pdf\"");
    res.send(bytes.value());
  });

  app.run();

  return 0;
}
```

In this example:

```txt
Vix.cpp owns the HTTP route
Rix generates the PDF
Vix.cpp sends the response
```

## Example: Rix auth inside a Vix route

```cpp
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  auto auth = rix.auth.memory();

  app.post("/register", [&](vix::Request &, vix::Response &res) {
    auto user = auth.register_user({
        "ada@example.com",
        "correct-password"});

    if (user.failed())
    {
      res.status(400).json({
          "ok", false,
          "error", rix.auth.error.to_string(user.error()),
          "message", user.error().message()});

      return;
    }

    res.json({
        "ok", true,
        "email", user.value().email()});
  });

  app.run();

  return 0;
}
```

In this example:

```txt
Vix.cpp owns the route
Rix handles auth logic
Vix.cpp sends the HTTP response
```

## Why not put everything in Vix.cpp?

If every application feature goes into Vix.cpp, the core becomes heavy.

That makes the main toolkit harder to maintain and harder to understand.

Rix keeps optional features separate.

This makes the ecosystem more modular:

```txt
Vix.cpp stays focused
Rix packages grow independently
Applications install only what they need
```

## Why Rix still belongs to the Vix.cpp ecosystem

Rix exists for Vix.cpp projects.

It follows Vix naming, Vix Registry workflow, and Vix project integration.

It is separate from Vix Core, but it belongs to the same ecosystem.

That is why packages use:

```txt
rix/auth
rix/csv
rix/debug
rix/pdf
```

and are installed with:

```bash
vix add ...
vix install
```

## Common project setup

A normal Vix project using Rix looks like this:

```bash
vix new my-app --app
cd my-app
vix add rix/rix
vix install
vix build
vix run
```

The code uses:

```cpp
#include <rix.hpp>
```

and the manifest contains:

```txt
deps = [
  "rix/rix",
]
```

## When to use `rix/rix`

Use `rix/rix` when:

```txt
you want the public facade
you want several Rix packages
you are writing docs or examples
you want one include
you want rix.auth, rix.csv, rix.debug, rix.pdf
```

Example:

```cpp
#include <rix.hpp>
```

## When to use an independent package

Use an independent package when:

```txt
you only need one package
you want a smaller dependency
you do not need the unified facade
you are building a focused library
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

## Rix package examples

### Auth

```cpp
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "ada@example.com",
      "correct-password"});

  return registered.ok() ? 0 : 1;
}
```

### CSV

```cpp
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

### Debug

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");

  const auto message = rix.debug.format(
      "Package: {}",
      "rix/rix");

  rix.debug.print(message);

  return 0;
}
```

For real Vix application logs, prefer the Vix logging system.

### PDF

```cpp
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  auto saved = rix.pdf.save(doc, "hello.pdf");

  return saved.ok() ? 0 : 1;
}
```

## Common mistakes

### Thinking Rix replaces Vix.cpp

Rix does not replace Vix.cpp.

Rix is installed and used inside Vix.cpp projects.

Vix.cpp still owns the project, runtime, CLI, and build workflow.

### Thinking Rix is a CLI

There is no separate Rix CLI.

Use Vix commands:

```bash
vix add rix/rix
vix install
vix build
vix run
```

### Putting Rix packages in `packages`

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

### Using direct package APIs when the facade is expected

For the docs, prefer:

```cpp
#include <rix.hpp>
```

and:

```cpp
rix.pdf.document()
rix.auth.memory()
rix.csv.parse(...)
rix.debug.print(...)
```

Use direct package headers only when intentionally documenting independent package usage.

### Calling Rix a standard library

Rix is not built into Vix Core.

It is an official optional package layer.

Users install Rix packages through the Vix Registry.

### Expecting debug helpers to replace production logging

`rix.debug` is useful for examples, small tools, formatting, and inspection.

For real Vix application logs, prefer the Vix logging system.

## What you should remember

Vix.cpp is the foundation:

```txt
runtime
CLI
project workflow
build workflow
registry workflow
application infrastructure
```

Rix is the optional userland package layer:

```txt
auth
csv
debug
pdf
future libraries
```

Install Rix with Vix:

```bash
vix add rix/rix
vix install
```

Use `deps`:

```txt
deps = [
  "rix/rix",
]
```

Use the public facade:

```cpp
#include <rix.hpp>
```

Then:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

## Next step

Learn the package naming rules.

Next: [Package rules](./package-model)
