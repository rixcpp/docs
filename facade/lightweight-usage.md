# Lightweight Usage

Lightweight usage means using the Rix facade while enabling only the packages you need.

The normal facade include is:

```cpp
#include <rix.hpp>
```

By default, this exposes the available mounted modules:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

For many applications, that is the simplest choice.

When you want a smaller facade, define feature macros before including `rix.hpp`.

## Basic idea

Feature macros control which packages are mounted into the global `rix` object.

Example with Auth only:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  return 0;
}
```

In this file, the facade exposes:

```cpp
rix.auth
```

It does not expose:

```cpp
rix.csv
rix.debug
rix.pdf
```

unless those modules are enabled too.

## Why use lightweight mode

Use lightweight mode when:

- one example only needs one package
- a small tool does not need the full facade
- a library wants clearer compile boundaries
- a project wants to avoid unnecessary includes
- you want to make package usage explicit

The public API still stays clean:

```cpp
rix.auth.memory()
```

The difference is that only selected modules are mounted.

## Available macros

The current facade supports:

```cpp
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

| Macro              | Mounted API |
| ------------------ | ----------- |
| `RIX_ENABLE_AUTH`  | `rix.auth`  |
| `RIX_ENABLE_CSV`   | `rix.csv`   |
| `RIX_ENABLE_DEBUG` | `rix.debug` |
| `RIX_ENABLE_PDF`   | `rix.pdf`   |

## Auth-only example

Create a small file:

```bash
mkdir -p ~/rix-lightweight-auth
cd ~/rix-lightweight-auth
touch auth.cpp
```

Add:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"ada@example.com","correct-password"});

  if (registered.failed())
  {
    return 1;
  }

  auto login = auth.login({"ada@example.com", "correct-password"});

  return login.failed() ? 1 : 0;
}
```

Run it:

```bash
vix run auth.cpp
```

If Rix is not available yet for single-file usage, install the facade globally:

```bash
vix install -g rix/rix
```

Then run again:

```bash
vix run auth.cpp
```

## Auth with Debug

Many examples need Auth plus debug output.

Enable both modules:

```cpp
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Rix Auth lightweight example");

  auto auth = rix.auth.memory();
  auto registered = auth.register_user({
      "ada@example.com",
      "correct-password"
  });

  if (registered.failed())
  {
    const auto &error = registered.error();
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message()
    );
    return 1;
  }

  rix.debug.print("registered:", registered.value().email());

  return 0;
}
```

Use `rix.debug` for lightweight debug output, formatting, printing, and inspection.

For application logging, prefer the Vix logging system.

## CSV-only example

Enable only CSV:

```cpp
#define RIX_ENABLE_CSV
#include <rix.hpp>

int main()
{
  auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix.cpp\n"
  );

  auto output = rix.csv.write(table);

  return output.empty() ? 1 : 0;
}
```

This exposes:

```cpp
rix.csv
```

but not:

```cpp
rix.auth
rix.debug
rix.pdf
```

## CSV with Debug

For examples that print the parsed result:

```cpp
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix.cpp\n"
  );

  rix.debug.print("rows:", table.size());

  return 0;
}
```

## PDF-only example

Enable only PDF:

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
      "Hello from rix.pdf"
  );

  auto saved = rix.pdf.save(doc, "hello.pdf");

  return saved.failed() ? 1 : 0;
}
```

This exposes:

```cpp
rix.pdf
```

## PDF with Debug

PDF examples often need debug output for errors:

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
      "Hello from rix.pdf"
  );
  auto saved = rix.pdf.save(doc, "hello.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message()
    );
    return 1;
  }

  rix.debug.print("created:", "hello.pdf");

  return 0;
}
```

## Use lightweight mode in a project

Inside a Vix project, add the facade package:

```bash
vix add rix/rix
vix install
```

Then declare it in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

Use feature macros in your C++ files:

```cpp
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

Build and run:

```bash
vix build
vix run
```

## Use a shared project header

If several files need the same lightweight facade shape, create a small project header.

Example:

```txt
include/app/rix.hpp
```

```cpp
#pragma once

#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

Then use it from application code:

```cpp
#include <app/rix.hpp>

int main()
{
  rix.debug.print("App Rix facade ready");
  auto auth = rix.auth.memory();

  return 0;
}
```

This keeps the selected modules consistent across the project.

## Lightweight mode and dependencies

Feature macros do not install packages.

They only control what is mounted into the `rix` object.

This controls facade mounting:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

This controls project dependencies:

```txt
deps = [
  "rix/rix",
]
```

You need the dependency installed and available before the code can compile.

## Lightweight facade vs independent packages

Lightweight facade usage still uses:

```cpp
#include <rix.hpp>
```

and:

```cpp
rix.auth
```

Independent package usage uses a package header instead:

```cpp
#include <rix/auth.hpp>
```

and lower-level package APIs.

Use lightweight facade when you still want the `rix.*` public style.

Use independent packages when you want direct package-level control and do not need the unified facade.

## Common mistakes

### Defining macros after the include

Wrong:

```cpp
#include <rix.hpp>
#define RIX_ENABLE_AUTH
```

Correct:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

Feature macros must be defined before including `rix.hpp`.

### Using a module that was not enabled

This will not work:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>

int main()
{
  rix.debug.print("hello");
}
```

Enable Debug too:

```cpp
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

### Forgetting the project dependency

This is not enough:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

In a `vix.app` project, declare the facade dependency:

```txt
deps = [
  "rix/rix",
]
```

Then run:

```bash
vix install
```

## What you should remember

Default facade:

```cpp
#include <rix.hpp>
```

Lightweight facade:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

Available macros:

```cpp
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

Feature macros must come before `#include <rix.hpp>`.

Project dependencies still go in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

## Next step

Continue with the facade API overview.

Next: [Facade API](./api)
