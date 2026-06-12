# Feature Macros

Feature macros let you choose which Rix packages are mounted into the unified facade.

By default, this works:

```cpp
#include <rix.hpp>
```

and exposes the available facade modules:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

For smaller builds, define only the modules you want before including `rix.hpp`.

## Why feature macros exist

The unified facade is convenient because it gives one public entry point:

```cpp
#include <rix.hpp>
```

But not every application needs every Rix package.

For example, a small authentication example may only need:

```cpp
rix.auth
```

A CSV tool may only need:

```cpp
rix.csv
```

A PDF generator may only need:

```cpp
rix.pdf
```

Feature macros allow the project to keep the facade style while mounting fewer modules.

## Available macros

The current facade supports these macros:

```cpp
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

Each macro enables one module inside the `rix` object.

| Macro              | Mounted API |
| ------------------ | ----------- |
| `RIX_ENABLE_AUTH`  | `rix.auth`  |
| `RIX_ENABLE_CSV`   | `rix.csv`   |
| `RIX_ENABLE_DEBUG` | `rix.debug` |
| `RIX_ENABLE_PDF`   | `rix.pdf`   |

## Default behavior

If no `RIX_ENABLE_*` macro is defined, `rix.hpp` enables the available facade modules by default.

This keeps simple examples short:

```cpp
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();
  auto table = rix.csv.parse("name,lang\nAda,C++\n");

  rix.debug.print("rows:", table.size());

  auto doc = rix.pdf.document();

  return 0;
}
```

This behavior is also useful for backward compatibility.

Existing code that includes only:

```cpp
#include <rix.hpp>
```

continues to work without defining macros.

## Enable only Auth

To mount only Auth:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"ada@example.com","correct-password"});
  return registered.failed() ? 1 : 0;
}
```

In this mode, only `rix.auth` is available.

These will not be available:

```cpp
rix.csv
rix.debug
rix.pdf
```

unless their macros are also defined.

## Enable Auth and Debug

To mount Auth and Debug:

```cpp
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Auth example");

  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"ada@example.com","correct-password"});

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

This is useful for examples that need Auth plus debug output.

## Enable CSV only

To mount only CSV:

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

In this mode, the facade exposes:

```cpp
rix.csv
```

but not:

```cpp
rix.auth
rix.debug
rix.pdf
```

## Enable PDF only

To mount only PDF:

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

In this mode, the facade exposes:

```cpp
rix.pdf
```

## Enable PDF and Debug

PDF examples often use Debug to print errors:

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

## Macro order matters

Feature macros must be defined before including `rix.hpp`.

Correct:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

Wrong:

```cpp
#include <rix.hpp>
#define RIX_ENABLE_AUTH
```

Once `rix.hpp` has been included, the facade has already been configured.

Defining a macro after the include will not remount the module.

## Use macros per translation unit

Feature macros are preprocessor settings.

They affect the current translation unit.

For clarity, define them at the top of each `.cpp` file that uses a restricted facade:

```cpp
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

In larger projects, prefer a small project header if multiple files need the same facade shape:

```cpp
// include/app/rix.hpp
#pragma once

#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

Then application files can include:

```cpp
#include <app/rix.hpp>
```

This keeps the selected facade modules consistent across the project.

## Feature macros and `vix.app`

Feature macros control which modules are mounted in C++ code.

They do not install packages.

You still need to declare the package dependency in `vix.app`.

For the unified facade:

```txt
deps = [
  "rix/rix",
]
```

Then install dependencies:

```bash
vix install
```

If you use the facade package, the project can include:

```cpp
#include <rix.hpp>
```

If you use only an independent package such as Auth, declare that package instead:

```txt
deps = [
  "rix/auth",
]
```

But then your code should use the package-level API for that package instead of assuming the full facade package is available.

## Feature macros and package dependencies

Feature macros are not the same as dependencies.

This controls C++ facade mounting:

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

You usually need both when using a restricted facade in a project.

## When to use feature macros

Use feature macros when:

- you want the facade style
- you want to mount only selected modules
- you want smaller includes
- you want clearer compile boundaries
- you are writing examples for one package

Example for an Auth-only example:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

Example for an Auth example with debug output:

```cpp
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

## When not to use feature macros

Do not use feature macros when you want the simplest beginner path.

For documentation examples, this is often enough:

```cpp
#include <rix.hpp>
```

This keeps the first experience simple.

Use feature macros only when the page is teaching lightweight usage or when the example intentionally needs a smaller facade.

## Common mistakes

### Defining macros after including `rix.hpp`

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

### Expecting a module that was not enabled

This will fail if only `RIX_ENABLE_AUTH` was defined:

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

### Forgetting the dependency

This is not enough by itself:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

The project still needs the Rix dependency:

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

Default usage:

```cpp
#include <rix.hpp>
```

Restricted facade:

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

Feature macros must be defined before including `rix.hpp`.

Project dependencies still belong in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

## Next step

Learn how to use the facade in a lightweight way.

Next: [Lightweight Usage](./lightweight-usage)
