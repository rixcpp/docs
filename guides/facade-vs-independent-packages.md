# Facade vs Independent Packages

This guide explains the difference between using the unified Rix facade and using an independent Rix package directly.

Rix supports both styles.

Use the facade when you want the normal public Rix API:

```cpp id="b8x4qn"
#include <rix.hpp>
```

and:

```cpp id="n5q9vc"
rix.auth
rix.csv
rix.debug
rix.pdf
```

Use an independent package when you intentionally want only one package:

```cpp id="r7m2ka"
#include <rix/pdf.hpp>
```

and:

```cpp id="p9v5xd"
auto pdf = rixlib::pdf::module();
```

## The short version

Use `rix/rix` for application code and documentation examples.

Use `rix/name` directly when a project only needs one package and does not need the full facade.

```txt id="k4m8va"
Unified facade        -> rix/rix  -> <rix.hpp>      -> rix.*
Independent package   -> rix/pdf  -> <rix/pdf.hpp>  -> rixlib::pdf::module()
```

## Unified facade

The unified facade is the package:

```txt id="z6n8qc"
rix/rix
```

Install it with:

```bash id="a3v7md"
vix add rix/rix
vix install
```

Use it with:

```cpp id="c9q2mx"
#include <rix.hpp>
```

Then access packages through the global `rix` object:

```cpp id="h7n4qc"
rix.auth
rix.csv
rix.debug
rix.pdf
```

## Independent package

An independent package is a focused package such as:

```txt id="d3x8vp"
rix/auth
rix/csv
rix/debug
rix/pdf
```

Install one package directly:

```bash id="j2m9wa"
vix add rix/pdf
vix install
```

Use its header directly:

```cpp id="w8c5nr"
#include <rix/pdf.hpp>
```

Then create the package module:

```cpp id="k5v7ma"
auto pdf = rixlib::pdf::module();
```

## Facade example

```cpp id="r6q9xd"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf through the facade");

  auto saved = rix.pdf.save(doc, "facade.pdf");

  return saved.ok() ? 0 : 1;
}
```

This style is short and readable.

It is the preferred style for most Rix documentation.

## Independent package example

```cpp id="p2n8fc"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix/pdf directly");

  auto saved = pdf.save(doc, "independent.pdf");

  return saved.ok() ? 0 : 1;
}
```

This style is useful when the project only needs `rix/pdf`.

## Main difference

The difference is not the PDF feature itself.

The difference is the entry point.

Facade:

```cpp id="y4m6qv"
#include <rix.hpp>

rix.pdf.document()
```

Independent:

```cpp id="f9x3ka"
#include <rix/pdf.hpp>

auto pdf = rixlib::pdf::module();
pdf.document()
```

Both styles use the same package underneath.

## When to use the facade

Use the facade when:

```txt id="m7c5vx"
you are writing application code
you want one include
you use more than one Rix package
you want rix.auth, rix.csv, rix.debug, rix.pdf
you are writing documentation examples
you want the public Rix style
```

Example:

```cpp id="q3p8za"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");

  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  auto doc = rix.pdf.document();

  rix.debug.print("rows:", table.size());

  return 0;
}
```

## When to use an independent package

Use an independent package when:

```txt id="v8n2hr"
you only need one package
you want a smaller dependency scope
you are building a focused library
you do not need the global rix facade
you want direct package ownership in the file
```

Example:

```cpp id="a6q9mx"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  return pdf.save(doc, "output.pdf").ok() ? 0 : 1;
}
```

## Project dependency for facade usage

For facade usage, add:

```bash id="r4v8kb"
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="x9m2pd"
deps = [
  "rix/rix",
]
```

Then include:

```cpp id="c5w9qa"
#include <rix.hpp>
```

## Project dependency for independent usage

For independent usage, add only the package you need.

Example for PDF:

```bash id="z8q2vm"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="n7x4hd"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="d6k8rc"
#include <rix/pdf.hpp>
```

## Do not put Rix packages in `packages`

Rix packages belong in `deps`.

Wrong:

```txt id="g5m9xq"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="y3v8mb"
deps = [
  "rix/rix",
]
```

For independent usage:

```txt id="f4q7vd"
deps = [
  "rix/pdf",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## Facade naming

The facade follows this model:

```txt id="w2x6qp"
Registry package  -> rix/rix
Header            -> <rix.hpp>
Access            -> rix.*
```

Examples:

```cpp id="n6c9hd"
rix.auth.memory()
rix.csv.parse(...)
rix.debug.print(...)
rix.pdf.document()
```

This is the normal public Rix style.

## Independent naming

Independent packages follow this model:

```txt id="j8q5kc"
Registry package  -> rix/name
Header            -> <rix/name.hpp>
Namespace         -> rixlib::name
Module helper     -> rixlib::name::module()
```

Example for PDF:

```txt id="r7x3vm"
Registry package  -> rix/pdf
Header            -> <rix/pdf.hpp>
Namespace         -> rixlib::pdf
Module helper     -> rixlib::pdf::module()
```

## Side-by-side comparison

| Need                     | Use         | Install    | Include          | Access                   |
| ------------------------ | ----------- | ---------- | ---------------- | ------------------------ |
| Normal app usage         | Facade      | `rix/rix`  | `<rix.hpp>`      | `rix.*`                  |
| Multiple packages        | Facade      | `rix/rix`  | `<rix.hpp>`      | `rix.auth`, `rix.pdf`    |
| Docs and examples        | Facade      | `rix/rix`  | `<rix.hpp>`      | `rix.*`                  |
| One focused package      | Independent | `rix/name` | `<rix/name.hpp>` | `rixlib::name::module()` |
| Smaller dependency scope | Independent | `rix/name` | `<rix/name.hpp>` | package module           |

## Facade with auth

```cpp id="p6m8xb"
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

Install:

```bash id="t9q2za"
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="x4v7nd"
deps = [
  "rix/rix",
]
```

## Facade with CSV

```cpp id="p4q8zb"
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

This uses both `rix.csv` and `rix.debug`, so the facade is a good fit.

## Facade with PDF

```cpp id="v2k9qc"
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

This is the preferred style for PDF examples in the Rix docs.

## Independent PDF

```cpp id="c8w5rp"
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

  auto saved = pdf.save(doc, "hello.pdf");

  return saved.ok() ? 0 : 1;
}
```

Install:

```bash id="z4v8qa"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="q8k5mv"
deps = [
  "rix/pdf",
]
```

## Independent debug

```cpp id="s6n4vm"
#include <rix/debug.hpp>

int main()
{
  auto debug = rixlib::debug::module();

  debug.print("Hello from rix/debug");

  return 0;
}
```

Use this style only when the independent package exposes a module helper.

For most examples, prefer:

```cpp id="v8q3md"
#include <rix.hpp>
```

and:

```cpp id="h5v8qp"
rix.debug.print(...)
```

## Lightweight facade

The facade can be reduced with feature macros.

Example:

```cpp id="d9m5qx"
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

This gives a middle path between full facade and fully independent package usage.

## Default facade behavior

If no feature macro is defined, all currently mounted modules are enabled.

This means:

```cpp id="m8x2vc"
#include <rix.hpp>
```

gives access to:

```cpp id="a2r7kb"
rix.auth
rix.csv
rix.debug
rix.pdf
```

This keeps simple examples short and backward-compatible.

## Feature macro examples

Only PDF:

```cpp id="c8n3vy"
#define RIX_ENABLE_PDF
#include <rix.hpp>
```

PDF and debug:

```cpp id="n6x9qa"
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

Auth only:

```cpp id="y5q2md"
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

CSV and debug:

```cpp id="b4v8qc"
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

Available macros include:

```txt id="p3x7rn"
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

## Which style should docs use?

Rix docs should start with the public facade.

Use:

```cpp id="h9n2ka"
#include <rix.hpp>
```

and:

```cpp id="q6v8mx"
rix.pdf.document()
rix.auth.memory()
rix.csv.parse(...)
rix.debug.print(...)
```

Then show independent package usage later as an alternative.

This keeps the docs consistent and teaches one public style first.

## Which style should applications use?

Most applications should use:

```bash id="t5c8vp"
vix add rix/rix
vix install
```

Then:

```cpp id="r8q5wc"
#include <rix.hpp>
```

This gives the cleanest application code.

Use independent packages only when the app has a clear reason to avoid the unified facade.

## Which style should libraries use?

A focused library can use an independent package when it only needs one Rix package.

Example:

```bash id="x4m9vd"
vix add rix/pdf
vix install
```

Then:

```cpp id="f7q3ma"
#include <rix/pdf.hpp>
```

This avoids depending on the full facade when the library only needs PDF types or PDF generation.

## Single-file usage with facade

Create a file:

```bash id="n9x2qc"
mkdir -p ~/rix-facade-example
cd ~/rix-facade-example
touch main.cpp
```

Add:

```cpp id="c5v8na"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

Run:

```bash id="m6q4rd"
vix run main.cpp
```

If Rix is not available globally:

```bash id="v2k8xm"
vix install -g rix/rix
vix run main.cpp
```

## Single-file usage with independent package

Create a file:

```bash id="q9c5rd"
mkdir -p ~/rix-independent-example
cd ~/rix-independent-example
touch main.cpp
```

Add:

```cpp id="k8m4xa"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto saved = pdf.save(doc, "independent.pdf");

  return saved.ok() ? 0 : 1;
}
```

Run:

```bash id="h5n7vc"
vix run main.cpp
```

If the package is not available globally:

```bash id="x9q2va"
vix install -g rix/pdf
vix run main.cpp
```

## Project usage with facade

```bash id="d6m8qc"
vix new facade-app --app
cd facade-app
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="z4x7mq"
deps = [
  "rix/rix",
]
```

In `src/main.cpp`:

```cpp id="y8m3ka"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from facade app");
  return 0;
}
```

Build and run:

```bash id="s5v9qa"
vix build
vix run
```

## Project usage with independent package

```bash id="p7n4xm"
vix new independent-pdf-app --app
cd independent-pdf-app
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="w3q8kc"
deps = [
  "rix/pdf",
]
```

In `src/main.cpp`:

```cpp id="r6x2vd"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto saved = pdf.save(doc, "independent.pdf");

  return saved.ok() ? 0 : 1;
}
```

Build and run:

```bash id="a8k5qx"
vix build
vix run
```

## Migration from independent package to facade

Before:

```cpp id="f2v7mc"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto saved = pdf.save(doc, "hello.pdf");

  return saved.ok() ? 0 : 1;
}
```

After:

```cpp id="c9m4vx"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto saved = rix.pdf.save(doc, "hello.pdf");

  return saved.ok() ? 0 : 1;
}
```

Update `vix.app`:

```txt id="m8q2za"
deps = [
  "rix/rix",
]
```

instead of:

```txt id="n5v8qc"
deps = [
  "rix/pdf",
]
```

## Migration from facade to independent package

Before:

```cpp id="q7x4ma"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto saved = rix.pdf.save(doc, "hello.pdf");

  return saved.ok() ? 0 : 1;
}
```

After:

```cpp id="h6q9vx"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto saved = pdf.save(doc, "hello.pdf");

  return saved.ok() ? 0 : 1;
}
```

Update `vix.app`:

```txt id="v8n3qb"
deps = [
  "rix/pdf",
]
```

instead of:

```txt id="k4m9xd"
deps = [
  "rix/rix",
]
```

## Avoid mixing styles without a reason

This is usually unnecessary:

```cpp id="x3m7qa"
#include <rix.hpp>
#include <rix/pdf.hpp>
```

If you use the facade, prefer:

```cpp id="n9q5vx"
#include <rix.hpp>
```

and:

```cpp id="d2v8rc"
rix.pdf
```

If you use the independent package, prefer:

```cpp id="b5x9ma"
#include <rix/pdf.hpp>
```

and:

```cpp id="r4q8md"
auto pdf = rixlib::pdf::module();
```

Keep one style per file unless there is a clear reason.

## Common mistakes

### Using the independent include but writing facade code

Wrong:

```cpp id="y7m2ka"
#include <rix/pdf.hpp>

int main()
{
  auto doc = rix.pdf.document();
  return 0;
}
```

Correct independent usage:

```cpp id="f7q3ma"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  return 0;
}
```

Or use the facade:

```cpp id="n9x2qc"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  return 0;
}
```

### Installing `rix/pdf` but including `<rix.hpp>`

If the project uses:

```cpp id="c5v8na"
#include <rix.hpp>
```

then install the facade package:

```bash id="m6q4rd"
vix add rix/rix
vix install
```

and keep:

```txt id="v2k8xm"
deps = [
  "rix/rix",
]
```

### Installing `rix/rix` but expecting only one package

`rix/rix` is the unified facade.

If you want only PDF, use:

```bash id="q9c5rd"
vix add rix/pdf
vix install
```

or use the lightweight facade macros with `rix/rix`.

### Putting Rix packages in `packages`

Wrong:

```txt id="k8m4xa"
packages = [
  "rix/pdf",
]
```

Correct:

```txt id="h5n7vc"
deps = [
  "rix/pdf",
]
```

### Using `rix.debug.log` as production logging

`rix.debug` is useful for examples and development output.

For real Vix applications, prefer the Vix logging system.

## What you should remember

Facade style:

```bash id="x9q2va"
vix add rix/rix
vix install
```

```cpp id="d6m8qc"
#include <rix.hpp>

rix.pdf.document()
```

Independent style:

```bash id="z4x7mq"
vix add rix/pdf
vix install
```

```cpp id="y8m3ka"
#include <rix/pdf.hpp>

auto pdf = rixlib::pdf::module();
```

Use `deps` in `vix.app`:

```txt id="s5v9qa"
deps = [
  "rix/rix",
]
```

or:

```txt id="p7n4xm"
deps = [
  "rix/pdf",
]
```

For most Rix docs and application examples, prefer:

```cpp id="w3q8kc"
#include <rix.hpp>
```

and:

```cpp id="r6x2vd"
rix.*
```

## Next step

Continue with feature macros.

Next: [Feature macros](../facade/feature-macros)
