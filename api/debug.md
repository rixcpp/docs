# Debug API

This page documents the public `rix/debug` API.

Use debug through the unified Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

Then access debug helpers with:

```cpp id="n5v9qc"
rix.debug
```

The debug API provides helpers for:

```txt id="k7x2ma"
printing values
printing to stderr
debug-only printing
formatting strings
appending formatted strings
inspecting values
small example output
```

`rix/debug` is designed for examples, local development, quick checks, tests, and small tools.

For real Vix application logs, prefer the Vix logging system:

```cpp id="p9c5xr"
vix::log
```

## Package

The debug package is:

```txt id="q4m8vb"
rix/debug
```

For facade usage, install:

```bash id="x2n7pd"
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="t8q5hm"
deps = [
  "rix/rix",
]
```

For independent package usage, install:

```bash id="b6x3rd"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="z5v8ka"
deps = [
  "rix/debug",
]
```

## Header

Facade usage:

```cpp id="c9q2mx"
#include <rix.hpp>
```

Independent usage:

```cpp id="h7n4qc"
#include <rix/debug.hpp>
```

Most application examples should use the facade.

## Facade member

The debug facade member is:

```cpp id="d3x8vp"
rix.debug
```

Example:

```cpp id="j2m9wa"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  return 0;
}
```

## Main helpers

Common debug helpers are:

```cpp id="w8c5nr"
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.dprint(...)
rix.debug.sprint(...)
rix.debug.format(...)
rix.debug.format.append(...)
rix.debug.format.to(...)
rix.debug.inspect(...)
```

## Print values

Use:

```cpp id="k5v7ma"
rix.debug.print(...)
```

Example:

```cpp id="r6q9xd"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  rix.debug.print("count:", 3);
  return 0;
}
```

`print` writes values separated by spaces and adds a newline.

## Print to stderr

Use:

```cpp id="p2n8fc"
rix.debug.eprint(...)
```

Example:

```cpp id="y4m6qv"
#include <rix.hpp>

int main()
{
  rix.debug.eprint("error:", "something failed");
  return 0;
}
```

Use `eprint` for example errors, diagnostics, and test output.

For production logs in a Vix app, prefer:

```cpp id="f9x3ka"
vix::log
```

## Debug-only print

Use:

```cpp id="m7c5vx"
rix.debug.dprint(...)
```

Example:

```cpp id="q3p8za"
#include <rix.hpp>

int main()
{
  rix.debug.dprint("debug value:", 42);
  return 0;
}
```

Use `dprint` for temporary debug messages.

## Format values into a string

Use:

```cpp id="v8n2hr"
const auto text = rix.debug.format(
    "Package: {}",
    "rix/debug");
```

Example:

```cpp id="a6q9mx"
#include <rix.hpp>

int main()
{
  const auto text = rix.debug.format(
      "Package: {}, version: {}",
      "rix/debug",
      1);

  rix.debug.print(text);
  return 0;
}
```

## Placeholder syntax

The formatter supports simple placeholders.

Automatic indexing:

```cpp id="r4v8kb"
rix.debug.format("Hello, {}", "Rix");
```

Explicit positional indexing:

```cpp id="x9m2pd"
rix.debug.format("{0} uses {1}", "Rix", "C++");
```

Escaped braces:

```cpp id="c5w9qa"
rix.debug.format("{{ package }} = {}", "ready");
```

Supported placeholder forms:

```txt id="z8q2vm"
{}
{0}
{1}
{2}
{{
}}
```

Format specifiers are intentionally not supported:

```txt id="n7x4hd"
{:>10}
{:.2f}
{:04d}
```

The formatter is small on purpose.

## Automatic placeholders

```cpp id="d6k8rc"
const auto message = rix.debug.format(
    "Hello, {}",
    "Ada");
```

Output shape:

```txt id="g5m9xq"
Hello, Ada
```

## Explicit placeholders

```cpp id="y3v8mb"
const auto message = rix.debug.format(
    "{0} writes {1}",
    "Ada",
    "C++");
```

Output shape:

```txt id="f4q7vd"
Ada writes C++
```

Do not mix automatic and explicit indexing in the same format string.

Wrong:

```cpp id="w2x6qp"
rix.debug.format("{} {0}", "Ada");
```

Use one style:

```cpp id="n6c9hd"
rix.debug.format("{} {}", "Ada", "C++");
```

or:

```cpp id="j8q5kc"
rix.debug.format("{0} {1}", "Ada", "C++");
```

## Append formatted output

Use:

```cpp id="r7x3vm"
rix.debug.format.append(out, "Hello {}", "Rix");
```

Example:

```cpp id="p6m8xb"
#include <rix.hpp>

#include <string>

int main()
{
  std::string out = "message: ";

  rix.debug.format.append(
      out,
      "{}",
      "ready");

  rix.debug.print(out);
  return 0;
}
```

This appends formatted output to an existing string.

## Replace a string with formatted output

Use:

```cpp id="t9q2za"
rix.debug.format.to(out, "Package: {}", "rix/debug");
```

Example:

```cpp id="x4v7nd"
#include <rix.hpp>

#include <string>

int main()
{
  std::string out = "old value";

  rix.debug.format.to(
      out,
      "Package: {}",
      "rix/debug");

  rix.debug.print(out);
  return 0;
}
```

This clears the string and writes the formatted output into it.

## Format errors

Invalid format strings can throw `rixlib::format_error`.

Examples of invalid format strings:

```cpp id="p4q8zb"
rix.debug.format("{", "value");
rix.debug.format("}", "value");
rix.debug.format("{:>10}", "value");
```

Handle format errors when formatting user-controlled format strings.

```cpp id="v2k9qc"
#include <rix.hpp>

int main()
{
  try
  {
    const auto text = rix.debug.format("{", "value");
    rix.debug.print(text);
  }
  catch (const rixlib::format_error &error)
  {
    rix.debug.eprint("format error:", error.what());
    return 1;
  }

  return 0;
}
```

For fixed application format strings, this is usually not necessary.

## Inspect values

Use:

```cpp id="c8w5rp"
rix.debug.inspect(value);
```

Example:

```cpp id="z4v8qa"
#include <rix.hpp>

#include <string>
#include <vector>

int main()
{
  std::vector<std::string> values = {
      "Ada",
      "C++",
      "Rix"};

  rix.debug.inspect(values);

  return 0;
}
```

`inspect` is useful for examples, tests, and quick diagnostics.

## Sprint values into a string

Use:

```cpp id="q8k5mv"
const auto text = rix.debug.sprint("Hello", "Rix");
```

Example:

```cpp id="s6n4vm"
#include <rix.hpp>

int main()
{
  const auto text = rix.debug.sprint(
      "Hello",
      "Rix",
      2026);

  rix.debug.print(text);
  return 0;
}
```

`sprint` uses the debug rendering pipeline and returns a string.

## Complete debug example

```cpp id="v8q3md"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");

  const std::string package = rix.debug.format(
      "Package: {}",
      "rix/rix");

  rix.debug.print(package);

  rix.debug.eprint("stderr:", "diagnostic message");

  rix.debug.inspect(package);

  return 0;
}
```

Run:

```bash id="h5v8qp"
vix run debug.cpp
```

## CSV debug example

```cpp id="d9m5qx"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n");

  rix.debug.print("rows:", table.size());
  rix.debug.inspect(table);

  return 0;
}
```

This uses:

```txt id="m8x2vc"
rix.csv
rix.debug
```

so the unified facade is the right dependency.

## PDF debug example

```cpp id="a2r7kb"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  auto saved = rix.pdf.save(doc, "debug-pdf.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "debug-pdf.pdf");
  return 0;
}
```

## Auth debug example

```cpp id="c8n3vy"
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

Do not print passwords, password hashes, raw tokens, or session ids in production output.

## Logging note

`rix.debug` includes a small debug logging helper for simple development output.

Example shape:

```cpp id="n6x9qa"
rix.debug.log("loaded {} rows", table.size());
rix.debug.log.warn("slow path: {}", "csv parse");
rix.debug.log.error("failed: {}", "invalid input");
```

This is useful for examples and local tools.

For real Vix application logging, prefer:

```cpp id="y5q2md"
vix::log
```

Do not design production Vix apps around `rix.debug.log`.

## Production logging

In a Vix application, prefer Vix logging for application logs.

Use `rix.debug` for:

```txt id="b4v8qc"
examples
tests
small tools
temporary diagnostics
formatting helpers
inspection helpers
```

Use `vix::log` for:

```txt id="p3x7rn"
production logs
HTTP request logs
service logs
deployment diagnostics
runtime events
```

## Use in a Vix project

Create a Vix app:

```bash id="h9n2ka"
vix new rix-debug-api --app
cd rix-debug-api
```

Add Rix:

```bash id="q6v8mx"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="t5c8vp"
deps = [
  "rix/rix",
]
```

Use in `src/main.cpp`:

```cpp id="r8q5wc"
#include <rix.hpp>
```

Build and run:

```bash id="x4m9vd"
vix build
vix run
```

## Single-file usage

Create a file:

```bash id="f7q3ma"
mkdir -p ~/rix-debug-api
cd ~/rix-debug-api
touch debug.cpp
```

Add:

```cpp id="n9x2qc"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from rix.debug");
  return 0;
}
```

Run:

```bash id="c5v8na"
vix run debug.cpp
```

If Rix is not available globally:

```bash id="m6q4rd"
vix install -g rix/rix
vix run debug.cpp
```

## Independent usage

Install only debug:

```bash id="v2k8xm"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="q9c5rd"
deps = [
  "rix/debug",
]
```

Then include:

```cpp id="k8m4xa"
#include <rix/debug.hpp>
```

Example:

```cpp id="h5n7vc"
#include <rix/debug.hpp>

int main()
{
  auto debug = rixlib::debug::module();

  debug.print("Hello from independent rix/debug");

  const auto text = debug.format(
      "Package: {}",
      "rix/debug");

  debug.print(text);

  return 0;
}
```

Use independent package APIs when you intentionally do not want the unified facade.

For most documentation and application examples, prefer:

```cpp id="x9q2va"
#include <rix.hpp>
```

and:

```cpp id="d6m8qc"
rix.debug
```

## Enable only debug in the facade

Use feature macros when you want the facade style but only want debug mounted:

```cpp id="z4x7mq"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from debug-only facade");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Enable debug with another package

CSV and debug:

```cpp id="y8m3ka"
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name\n"
      "Ada\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

PDF and debug:

```cpp id="s5v9qa"
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

Auth and debug:

```cpp id="p7n4xm"
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  rix.debug.print("auth ready");

  return 0;
}
```

## Format API reference

`rix.debug.format` supports:

```cpp id="w3q8kc"
operator()(std::string_view fmt, const Args &...args)
append(std::string &out, std::string_view fmt, const Args &...args)
to(std::string &out, std::string_view fmt, const Args &...args)
```

Usage:

```cpp id="r6x2vd"
const auto text = rix.debug.format("Hello {}", "Rix");

std::string out;

rix.debug.format.append(out, "A {}", "B");

rix.debug.format.to(out, "C {}", "D");
```

## Debug facade API reference

`rix.debug` exposes:

```cpp id="a8k5qx"
format
log
inspect
print(...)
eprint(...)
dprint(...)
sprint(...)
```

Use:

```cpp id="f2v7mc"
rix.debug.print("Hello", "Rix");
rix.debug.eprint("error:", "failed");
rix.debug.dprint("debug:", 42);
auto text = rix.debug.sprint("Hello", "Rix");
```

## Common mistakes

### Forgetting to install Rix

If your code uses:

```cpp id="c9m4vx"
#include <rix.hpp>
```

install:

```bash id="m8q2za"
vix add rix/rix
vix install
```

If your code uses:

```cpp id="n5v8qc"
#include <rix/debug.hpp>
```

install:

```bash id="q7x4ma"
vix add rix/debug
vix install
```

### Putting Rix in `packages`

Wrong:

```txt id="h6q9vx"
packages = [
  "rix/debug",
]
```

Correct:

```txt id="v8n3qb"
deps = [
  "rix/debug",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Installing `rix/debug` but including `<rix.hpp>`

If your code uses:

```cpp id="k4m9xd"
#include <rix.hpp>
```

then install:

```bash id="x3m7qa"
vix add rix/rix
vix install
```

If your code uses:

```cpp id="n9q5vx"
#include <rix/debug.hpp>
```

then install:

```bash id="d2v8rc"
vix add rix/debug
vix install
```

### Using format specifiers

This is not supported:

```cpp id="b5x9ma"
rix.debug.format("{:.2f}", 3.14);
```

Use simple placeholders:

```cpp id="r4q8md"
rix.debug.format("value: {}", 3.14);
```

### Mixing automatic and explicit indexes

Wrong:

```cpp id="y7m2ka"
rix.debug.format("{} {0}", "Ada");
```

Correct:

```cpp id="f7q3ma"
rix.debug.format("{} {}", "Ada", "C++");
```

or:

```cpp id="n9x2qc"
rix.debug.format("{0} {1}", "Ada", "C++");
```

### Using `rix.debug.log` for production logs

`rix.debug.log` is a small development helper.

For Vix application logs, prefer:

```cpp id="c5v8na"
vix::log
```

### Printing sensitive values

Avoid printing:

```txt id="m6q4rd"
passwords
password hashes
raw tokens
session ids
private keys
secrets
```

This matters especially when using `rix.auth`.

### Mixing facade and independent usage

Avoid this without a clear reason:

```cpp id="v2k8xm"
#include <rix.hpp>
#include <rix/debug.hpp>
```

Use one style per file.

Facade:

```cpp id="q9c5rd"
#include <rix.hpp>
```

Independent:

```cpp id="k8m4xa"
#include <rix/debug.hpp>
```

## What you should remember

Print:

```cpp id="h5n7vc"
rix.debug.print("Hello", "Rix");
```

Print errors:

```cpp id="x9q2va"
rix.debug.eprint("error:", "failed");
```

Format:

```cpp id="d6m8qc"
const auto text = rix.debug.format(
    "Package: {}",
    "rix/debug");
```

Inspect:

```cpp id="z4x7mq"
rix.debug.inspect(value);
```

Use the facade for most examples:

```cpp id="y8m3ka"
#include <rix.hpp>
```

and:

```cpp id="s5v9qa"
rix.debug
```

For project usage:

```bash id="p7n4xm"
vix add rix/rix
vix install
```

and keep:

```txt id="w3q8kc"
deps = [
  "rix/rix",
]
```

For production Vix application logs, prefer:

```cpp id="r6x2vd"
vix::log
```

## Next step

Continue with the PDF API.

Next: [PDF API](./pdf)
