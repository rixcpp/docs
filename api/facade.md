# Facade API

This page documents the public Rix facade API.

The facade is provided by:

```cpp
#include <rix.hpp>
```

It exposes one public object:

```cpp
rix
```

and mounts Rix packages as members:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

Use this API for most Rix application code and documentation examples.

## Package

The facade package is:

```txt
rix/rix
```

Install it with:

```bash
vix add rix/rix
vix install
```

In `vix.app`, keep it in `deps`:

```txt
deps = [
  "rix/rix",
]
```

## Header

Use:

```cpp
#include <rix.hpp>
```

This header exposes the unified Rix facade.

## Object

The public facade object is:

```cpp
rix
```

Example:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

## Mounted modules

The facade can expose these modules:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

Each module belongs to a Rix package.

| Facade member | Package     | Purpose                                     |
| ------------- | ----------- | ------------------------------------------- |
| `rix.auth`    | `rix/auth`  | Authentication, passwords, sessions, tokens |
| `rix.csv`     | `rix/csv`   | CSV parsing and writing                     |
| `rix.debug`   | `rix/debug` | Printing, formatting, inspection helpers    |
| `rix.pdf`     | `rix/pdf`   | PDF document generation                     |

## Basic usage

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

## Facade naming model

The facade follows the Rix package model:

```txt
Registry package  -> rix/name
Header            -> <rix/name.hpp>
Facade access     -> rix.name
Namespace         -> rixlib::name
```

Examples:

```txt
rix/auth   -> rix.auth
rix/csv    -> rix.csv
rix/debug  -> rix.debug
rix/pdf    -> rix.pdf
```

The facade package itself is:

```txt
rix/rix -> <rix.hpp> -> rix.*
```

## Default behavior

If no feature macro is defined, the facade enables all mounted modules.

This means:

```cpp
#include <rix.hpp>
```

gives access to:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

This keeps simple examples short.

## Feature macros

You can limit the facade with feature macros.

If at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

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

## Enable only auth

```cpp
#define RIX_ENABLE_AUTH
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

## Enable only CSV

```cpp
#define RIX_ENABLE_CSV
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name\n"
      "Ada\n");

  return table.empty() ? 1 : 0;
}
```

## Enable CSV and debug

```cpp
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
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

## Enable only PDF

```cpp
#define RIX_ENABLE_PDF
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

## Enable PDF and debug

```cpp
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
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

  rix.debug.print("created:", "hello.pdf");
  return 0;
}
```

## `rix.auth`

`rix.auth` exposes the auth package API.

Common helpers:

```cpp
rix.auth.memory()
rix.auth.password.hash(...)
rix.auth.password.verify(...)
rix.auth.password.accepts(...)
rix.auth.config.development()
rix.auth.config.production()
rix.auth.error.to_string(...)
```

Example:

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

  rix.debug.print("registered:", registered.value().email());
  return 0;
}
```

## `rix.csv`

`rix.csv` exposes the CSV package API.

Common helpers:

```cpp
rix.csv.parse(...)
rix.csv.write(...)
```

Example:

```cpp
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n");

  rix.debug.print("rows:", table.size());

  for (const auto &row : table)
  {
    rix.debug.inspect(row);
  }

  return 0;
}
```

## `rix.debug`

`rix.debug` exposes the debug package API.

Common helpers:

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

Example:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");

  const auto message = rix.debug.format(
      "Package: {}",
      "rix/rix");

  rix.debug.print(message);
  rix.debug.inspect(message);

  return 0;
}
```

`rix.debug` is useful for examples, small tools, formatting, and inspection.

For real Vix application logs, prefer the Vix logging system.

## `rix.pdf`

`rix.pdf` exposes the PDF package API.

Common helpers:

```cpp
rix.pdf.document()
rix.pdf.save(...)
rix.pdf.write(...)
rix.pdf.make_text(...)
rix.pdf.image.load_jpeg(...)
rix.pdf.error.to_string(...)
```

Example:

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

  rix.debug.print("created:", "hello.pdf");
  return 0;
}
```

## Result handling

Some Rix APIs return explicit results or statuses.

Check them before reading values.

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
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());

  return 1;
}

rix.debug.print(bytes.value().size());
```

## Status handling

Operations such as saving a PDF can return a status:

```cpp
auto saved = rix.pdf.save(doc, "hello.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

Use:

```cpp
status.ok()
status.failed()
status.error()
```

## Value result handling

Operations that return a value use result objects.

Example:

```cpp
auto bytes = rix.pdf.write(doc);
```

Use:

```cpp
result.ok()
result.failed()
result.value()
result.error()
```

Only call `value()` after checking success.

## Error helpers

Packages with domain errors expose error helpers.

Examples:

```cpp
rix.auth.error.to_string(error)
rix.auth.error.is(error, code)

rix.pdf.error.to_string(error)
rix.pdf.error.is(error, code)
```

Use `to_string` for stable error code text.

Use `message()` for human-readable details.

Example:

```cpp
const auto &error = saved.error();

rix.debug.eprint(
    "pdf error:",
    rix.pdf.error.to_string(error),
    error.message());
```

## Use the facade in a Vix project

Create a Vix app:

```bash
vix new rix-facade-app --app
cd rix-facade-app
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

Use in `src/main.cpp`:

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

## Minimal `vix.app`

```txt
name = "rix-facade-app"
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

The important part is:

```txt
deps = [
  "rix/rix",
]
```

## Use the facade from a single file

Create a file:

```bash
mkdir -p ~/rix-facade-example
cd ~/rix-facade-example
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

## Facade vs independent package

Facade usage:

```cpp
#include <rix.hpp>

rix.pdf.document()
```

Independent package usage:

```cpp
#include <rix/pdf.hpp>

auto pdf = rixlib::pdf::module();
pdf.document()
```

Use the facade for most application code.

Use independent packages when a project only needs one package and does not need `rix.*`.

## Independent PDF example

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
      "Hello from independent rix/pdf");

  auto saved = pdf.save(doc, "independent.pdf");

  return saved.ok() ? 0 : 1;
}
```

Install independent PDF with:

```bash
vix add rix/pdf
vix install
```

and keep:

```txt
deps = [
  "rix/pdf",
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

For independent packages:

```txt
deps = [
  "rix/pdf",
]
```

`deps` is for Vix Registry dependencies.

`packages` is for CMake package discovery.

## Common mistakes

### Forgetting to install the facade package

If your code uses:

```cpp
#include <rix.hpp>
```

then install:

```bash
vix add rix/rix
vix install
```

### Installing one package but using the facade

If you install only:

```bash
vix add rix/pdf
```

then use:

```cpp
#include <rix/pdf.hpp>
```

If you want:

```cpp
#include <rix.hpp>
```

install:

```bash
vix add rix/rix
```

### Calling `value()` before checking success

Wrong:

```cpp
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

rix.debug.print(login.value().user.email());
```

Correct:

```cpp
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

if (login.failed())
{
  return 1;
}

rix.debug.print(login.value().user.email());
```

### Using `rix.debug` as production logging

`rix.debug` is useful for examples and small tools.

For real Vix application logs, prefer the Vix logging system.

### Mixing facade and independent usage

Avoid this without a clear reason:

```cpp
#include <rix.hpp>
#include <rix/pdf.hpp>
```

Use one style per file.

Facade:

```cpp
#include <rix.hpp>
```

Independent:

```cpp
#include <rix/pdf.hpp>
```

### Forgetting feature macro behavior

If no feature macro is defined:

```cpp
#include <rix.hpp>
```

all mounted modules are available.

If one or more feature macros are defined, only selected modules are mounted.

Example:

```cpp
#define RIX_ENABLE_PDF
#include <rix.hpp>
```

Only `rix.pdf` is expected to be available.

## What you should remember

Use the facade package:

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

Include:

```cpp
#include <rix.hpp>
```

Use:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

Check results before calling `value()`.

Use feature macros when you want a smaller facade.

For independent package usage, include the package header directly.

## Next step

Continue with the auth API.

Next: [Auth API](./auth)
