# API Reference

This section documents the public Rix API.

Rix APIs are organized by package.

Most application code should use the unified facade:

```cpp
#include <rix.hpp>
```

Then access packages through:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

The direct package APIs are also available when you want to use a package independently.

## Public API model

Rix follows one stable model:

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

## Main API sections

| Section            | Package     | Description                                           |
| ------------------ | ----------- | ----------------------------------------------------- |
| [Facade](./facade) | `rix/rix`   | Unified public facade                                 |
| [Auth](./auth)     | `rix/auth`  | Authentication, passwords, sessions, tokens           |
| [CSV](./csv)       | `rix/csv`   | CSV parsing, writing, and options                     |
| [Debug](./debug)   | `rix/debug` | Printing, formatting, inspection helpers              |
| [PDF](./pdf)       | `rix/pdf`   | PDF documents, pages, text, tables, drawing, metadata |

## Facade API

The facade package is:

```txt
rix/rix
```

Install it with:

```bash
vix add rix/rix
vix install
```

Use:

```cpp
#include <rix.hpp>
```

The facade exposes:

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

  auto doc = rix.pdf.document();

  return 0;
}
```

## Independent package API

Every package can also be used independently.

Example with PDF:

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

  return 0;
}
```

Use independent packages when a project only needs one package.

Use the facade when a project wants the normal public Rix style.

## Dependency location

Rix packages are Vix Registry dependencies.

They belong in `deps`:

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

## Facade feature macros

The facade can be limited with feature macros.

Example:

```cpp
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  rix.debug.print("PDF module loaded");

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

If no feature macro is defined, all mounted modules are enabled.

If at least one feature macro is defined, only selected modules are mounted.

## Auth API overview

Use auth through the facade:

```cpp
auto auth = rix.auth.memory();
```

Common operations:

```cpp
auth.register_user(...)
auth.login(...)
auth.authenticate_session(...)
auth.refresh_session(...)
auth.logout(...)
auth.logout_user(...)
auth.issue_token(...)
```

Password helpers:

```cpp
rix.auth.password.hash(...)
rix.auth.password.verify(...)
rix.auth.password.accepts(...)
```

Error helpers:

```cpp
rix.auth.error.to_string(error)
rix.auth.error.is(error, code)
```

Basic example:

```cpp
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

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

  return 0;
}
```

## CSV API overview

Use CSV through the facade:

```cpp
const auto table = rix.csv.parse(input);
```

Common operations:

```cpp
rix.csv.parse(...)
rix.csv.write(...)
```

Basic example:

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

CSV table data can be iterated:

```cpp
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

## Debug API overview

Use debug through the facade:

```cpp
rix.debug.print(...)
```

Common operations:

```cpp
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.dprint(...)
rix.debug.sprint(...)
rix.debug.format(...)
rix.debug.format.to(...)
rix.debug.format.append(...)
rix.debug.inspect(...)
```

Basic example:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");

  const auto message = rix.debug.format(
      "Package: {}",
      "rix/debug");

  rix.debug.print(message);
  rix.debug.inspect(message);

  return 0;
}
```

`rix.debug` is useful for examples, small tools, formatting, and inspection.

For real Vix application logs, prefer the Vix logging system.

## PDF API overview

Use PDF through the facade:

```cpp
auto doc = rix.pdf.document();
```

Common operations:

```cpp
rix.pdf.document()
rix.pdf.save(...)
rix.pdf.write(...)
rix.pdf.make_text(...)
rix.pdf.image.load_jpeg(...)
rix.pdf.error.to_string(...)
```

Basic example:

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

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  return 0;
}
```

## Result and status pattern

Rix packages use explicit results for expected failures.

For operations that return a value:

```cpp
auto result = rix.pdf.write(doc);

if (result.failed())
{
  rix.debug.eprint(
      "error:",
      rix.pdf.error.to_string(result.error()),
      result.error().message());

  return 1;
}

const auto &value = result.value();
```

For operations that only succeed or fail:

```cpp
auto status = rix.pdf.save(doc, "output.pdf");

if (status.failed())
{
  rix.debug.eprint(
      "error:",
      rix.pdf.error.to_string(status.error()),
      status.error().message());

  return 1;
}
```

Never call `value()` before checking success.

## Error API pattern

Packages with domain errors expose error helpers.

Examples:

```cpp
rix.auth.error.to_string(error)
rix.auth.error.is(error, code)

rix.pdf.error.to_string(error)
rix.pdf.error.is(error, code)
```

Use `to_string` for stable error code text.

Use `message()` for human-readable diagnostics.

Example:

```cpp
if (saved.failed())
{
  const auto &error = saved.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

## Version API pattern

Packages can expose version helpers.

Example:

```cpp
rix.pdf.version()
rix.pdf.version_major()
rix.pdf.version_minor()
rix.pdf.version_patch()
rix.pdf.version_number()
```

Use version helpers for diagnostics, tests, and compatibility checks.

## API naming rules

Rix APIs should prefer stable, readable names.

Good:

```cpp
rix.pdf.document()
rix.pdf.save(...)
rix.auth.memory()
rix.csv.parse(...)
rix.debug.print(...)
```

Avoid exposing low-level internals as the first user-facing API.

Low-level types can exist, but the common workflow should stay short.

## Public namespaces

Package types live in package namespaces.

Examples:

```cpp
rixlib::auth
rixlib::csv
rixlib::debug
rixlib::pdf
```

PDF example:

```cpp
rixlib::pdf::Table table;
rixlib::pdf::TextStyle style;
rixlib::pdf::Color color;
```

The facade exposes module access:

```cpp
rix.pdf
```

The namespace exposes package types:

```cpp
rixlib::pdf
```

## API examples by package

### Auth

```cpp
auto auth = rix.auth.memory();

auto login = auth.login({
    "ada@example.com",
    "correct-password"});

if (login.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(login.error()),
      login.error().message());

  return 1;
}
```

### CSV

```cpp
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n");

for (const auto &row : table)
{
  rix.debug.inspect(row);
}
```

### Debug

```cpp
rix.debug.print("Hello", "Rix");

const auto text = rix.debug.format(
    "Package: {}",
    "rix/rix");

rix.debug.inspect(text);
```

### PDF

```cpp
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");

auto saved = rix.pdf.save(doc, "hello.pdf");
```

## Use in a Vix project

Create a project:

```bash
vix new api-example --app
cd api-example
```

Add Rix:

```bash
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt
deps = [
  "rix/rix",
]
```

Use:

```cpp
#include <rix.hpp>
```

Build and run:

```bash
vix build
vix run
```

## Single-file usage

For small examples:

```bash
mkdir -p ~/rix-api-example
cd ~/rix-api-example
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

## Common mistakes

### Putting Rix in `packages`

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

### Installing an independent package but including the facade

If you use:

```cpp
#include <rix.hpp>
```

install:

```bash
vix add rix/rix
vix install
```

If you use:

```cpp
#include <rix/pdf.hpp>
```

install:

```bash
vix add rix/pdf
vix install
```

### Calling `value()` before checking success

Wrong:

```cpp
auto bytes = rix.pdf.write(doc);

rix.debug.print(bytes.value().size());
```

Correct:

```cpp
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  return 1;
}

rix.debug.print(bytes.value().size());
```

### Using debug output as production logging

For examples:

```cpp
rix.debug.print(...)
```

For real Vix application logs, prefer the Vix logging system.

### Mixing facade and independent usage without a reason

Avoid:

```cpp
#include <rix.hpp>
#include <rix/pdf.hpp>
```

Prefer one style per file.

Facade:

```cpp
#include <rix.hpp>
```

Independent:

```cpp
#include <rix/pdf.hpp>
```

## What you should remember

Use the public facade for most application code:

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

Install the facade with:

```bash
vix add rix/rix
vix install
```

Keep it in `deps`:

```txt
deps = [
  "rix/rix",
]
```

Use independent packages when needed:

```cpp
#include <rix/pdf.hpp>
```

and install:

```bash
vix add rix/pdf
vix install
```

Never call `value()` before checking `ok()` or `failed()`.

## Next step

Start with the facade API.

Next: [Facade API](./facade)
