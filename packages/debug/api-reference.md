# Debug API Reference

This page summarizes the public API exposed by `rix/debug`.

The documentation examples use the unified Rix facade:

```cpp id="c7w9bm"
#include <rix.hpp>
```

and access Debug through:

```cpp id="q4rx91"
rix.debug
```

The lower-level debug helpers live under:

```cpp id="b8kt2v"
rixlib
rixlib::debug
```

Use the facade for application code and documentation examples.

## Facade entry point

The Debug module is mounted at:

```cpp id="o2n4wp"
rix.debug
```

Common usage:

```cpp id="w4qz6k"
rix.debug.print("Hello", "Rix");

const auto message =
    rix.debug.format("Package: {}", "rix/debug");

rix.debug.print(message);

rix.debug.inspect(message);
```

## Headers

Recommended public header:

```cpp id="w9kz12"
#include <rix.hpp>
```

Independent package header:

```cpp id="k7x2fn"
#include <rix/debug.hpp>
```

Use `<rix.hpp>` when you want the unified facade:

```cpp id="n6f2qa"
rix.csv
rix.debug
rix.auth
rix.pdf
```

Use `<rix/debug.hpp>` when you only need the independent debug package.

## Namespace

The object-style Debug API lives in:

```cpp id="a9p2me"
rixlib::debug
```

The simple free helpers live in:

```cpp id="h8q6tr"
rixlib
```

Common public names:

```cpp id="d3y0cl"
rixlib::debug::Debug
rixlib::debug::Format
rixlib::debug::Log
rixlib::debug::Inspect
rixlib::format_error
```

## `rix.debug`

`rix.debug` exposes the public debug facade.

It provides:

```cpp id="pyq1v8"
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.dprint(...)
rix.debug.sprint(...)

rix.debug.format(...)
rix.debug.format.append(...)
rix.debug.format.to(...)

rix.debug.log(...)
rix.debug.log.info(...)
rix.debug.log.warn(...)
rix.debug.log.error(...)

rix.debug.inspect(...)
```

Use it for examples, development-time output, quick diagnostics, and small tools.

For production application logs, prefer the Vix logging system.

## `print`

```cpp id="q8l3sd"
template <typename... Args>
void print(const Args &...args) const;
```

Prints values to stdout, separated by spaces, followed by a newline.

Example:

```cpp id="w5m3en"
rix.debug.print("Hello", "Rix");
rix.debug.print("rows:", 3);
rix.debug.print("ready:", true);
```

Output shape:

```txt id="u4r5qx"
Hello Rix
rows: 3
ready: true
```

Use `print` for simple development output and documentation examples.

## `eprint`

```cpp id="xy7l2a"
template <typename... Args>
void eprint(const Args &...args) const;
```

Prints values to stderr.

Example:

```cpp id="g2q7np"
rix.debug.eprint("error:", "something failed");
```

Use `eprint` for local error output in examples and small command-line tools.

## `dprint`

```cpp id="qk2f9z"
template <typename... Args>
void dprint(const Args &...args) const;
```

Writes debug-only output.

Example:

```cpp id="d8t9qm"
rix.debug.dprint("debug value:", 42);
```

Use it for messages that are only useful while developing.

## `sprint`

```cpp id="p7mx6w"
template <typename... Args>
std::string sprint(const Args &...args) const;
```

Returns the same value rendering style as `print`, but as a string.

Example:

```cpp id="mg0rx8"
const auto line =
    rix.debug.sprint("rows:", 3);

rix.debug.print(line);
```

Output:

```txt id="v0y5zh"
rows: 3
```

Use `sprint` when you want to build a line before printing, storing, or passing it to another API.

## `format`

```cpp id="h1y8at"
template <typename... Args>
std::string operator()(
    std::string_view fmt,
    const Args &...args) const;
```

Creates a formatted string using Rix placeholder syntax.

Example:

```cpp id="iv4p0w"
const auto message =
    rix.debug.format("Package: {}", "rix/debug");

rix.debug.print(message);
```

Output:

```txt id="lv1r3x"
Package: rix/debug
```

`format` returns a `std::string`.

It does not print by itself.

## Automatic placeholders

Use `{}` to consume arguments in order:

```cpp id="kq4rp7"
const auto message =
    rix.debug.format("{} uses {}", "Rix", "C++");
```

Output:

```txt id="t5m9dj"
Rix uses C++
```

Each `{}` uses the next argument.

## Explicit placeholders

Use `{0}`, `{1}`, and other numeric indexes when the position should be explicit:

```cpp id="r1qv3k"
const auto message =
    rix.debug.format("{0} + {0} = {1}", "C++", "Vix.cpp");
```

Output:

```txt id="e7v8sd"
C++ + C++ = Vix.cpp
```

Do not mix automatic placeholders and explicit placeholders in the same format string.

## Escaped braces

Use double opening braces and double closing braces when you need literal braces:

```cpp id="n3f6qa"
const auto message =
    rix.debug.format("{{ package }} = {}", "rix/debug");
```

Output:

```txt id="j6u3sn"
{ package } = rix/debug
```

## Unsupported format specifiers

`rix.debug.format` intentionally supports a small placeholder syntax.

It does not support format specifiers such as:

```txt id="k9r2mw"
{:>10}
{:.2f}
{:04d}
```

Wrong:

```cpp id="ya9p8e"
rix.debug.format("{:.2f}", 3.14159);
```

Use:

```cpp id="b0r3nx"
rix.debug.format("value: {}", 3.14159);
```

For advanced formatting, use another formatting library or normal C++ formatting tools where appropriate.

## `format.append`

```cpp id="s7m0dz"
template <typename... Args>
void append(
    std::string &out,
    std::string_view fmt,
    const Args &...args) const;
```

Appends formatted output to an existing string.

Example:

```cpp id="hj5s8b"
std::string out = "Rix: ";

rix.debug.format.append(
    out,
    "{}",
    "debug");

rix.debug.print(out);
```

Output:

```txt id="fo8x3m"
Rix: debug
```

Use `append` when building a string in steps.

## `format.to`

```cpp id="i4z8bs"
template <typename... Args>
void to(
    std::string &out,
    std::string_view fmt,
    const Args &...args) const;
```

Replaces the destination string with formatted output.

Example:

```cpp id="r5ve9q"
std::string out = "old value";

rix.debug.format.to(
    out,
    "Package: {}",
    "rix/debug");

rix.debug.print(out);
```

Output:

```txt id="ul1h4v"
Package: rix/debug
```

The previous content of `out` is cleared.

## `format_error`

```cpp id="t2x5cn"
rixlib::format_error
```

`format_error` is thrown on invalid format strings or invalid argument access.

Invalid examples:

```cpp id="w1b7tz"
rix.debug.format("{", "Rix");
rix.debug.format("}", "Rix");
rix.debug.format("{2}", "Rix");
rix.debug.format("{} {0}", "Rix");
rix.debug.format("{:.2f}", 3.14);
```

Handle errors when the format string may come from outside your code:

```cpp id="q1n9vg"
try
{
  const auto message =
      rix.debug.format("{} {}", "Rix", "Debug");

  rix.debug.print(message);
}
catch (const rixlib::format_error &error)
{
  rix.debug.eprint("format error:", error.what());
  return 1;
}
```

## `log`

```cpp id="ts8p3j"
template <typename... Args>
void operator()(
    std::string_view fmt,
    const Args &...args) const;
```

Writes a debug-level formatted message.

Example:

```cpp id="nv7q4c"
rix.debug.log("loaded {} rows", 3);
```

Output:

```txt id="bg8d0h"
[debug] loaded 3 rows
```

`rix.debug.log` is a development helper.

For real application logging, prefer `vix::log`.

## `log.info`

```cpp id="wh5ey1"
template <typename... Args>
void info(
    std::string_view fmt,
    const Args &...args) const;
```

Writes an info-level message to stdout.

Example:

```cpp id="d9ltv3"
rix.debug.log.info("package {} is ready", "rix/debug");
```

Output:

```txt id="gs5m9e"
[info] package rix/debug is ready
```

## `log.warn`

```cpp id="o5y4hz"
template <typename... Args>
void warn(
    std::string_view fmt,
    const Args &...args) const;
```

Writes a warning-level message to stdout.

Example:

```cpp id="em6x0p"
rix.debug.log.warn("slow path: {}", "csv import");
```

Output:

```txt id="h8xn2s"
[warn] slow path: csv import
```

## `log.error`

```cpp id="yv2c7h"
template <typename... Args>
void error(
    std::string_view fmt,
    const Args &...args) const;
```

Writes an error-level message to stderr.

Example:

```cpp id="b3y8ak"
rix.debug.log.error("failed to open {}", "missing.csv");
```

Output shape:

```txt id="l8r9ed"
[error] failed to open missing.csv
```

## Logging recommendation

Use `rix.debug.log` for:

```txt id="q6z4wh"
examples
small command-line demos
local diagnostics
quick package tests
development-only output
```

Use Vix logging for:

```txt id="vq9x7j"
HTTP request logs
service startup logs
deployment diagnostics
production logs
structured application logs
runtime observability
```

Rule:

```txt id="uw7m2n"
rix.debug.log -> development helper
vix::log      -> application logging
```

## `inspect`

```cpp id="na7pm3"
rix.debug.inspect(value);
```

Inspects a value during development.

Example:

```cpp id="yt9h6m"
std::string package = "rix/debug";

rix.debug.inspect(package);
```

Inspection is useful when you want a clearer development-time view of a value.

For normal output, use `print`.

For formatted messages, use `format`.

## Complete API example

```cpp id="e8f5dq"
#include <rix.hpp>

#include <string>

int main()
{
  rix.debug.print("Hello", "Rix");
  rix.debug.eprint("stderr:", "example");

  const std::string package =
      rix.debug.format("Package: {}", "rix/debug");

  rix.debug.print(package);

  std::string line = "Rix: ";

  rix.debug.format.append(
      line,
      "{}",
      "debug");

  rix.debug.print(line);

  rix.debug.format.to(
      line,
      "module: {}",
      "debug");

  rix.debug.print(line);

  const auto printed =
      rix.debug.sprint("rows:", 3);

  rix.debug.inspect(printed);

  rix.debug.log.info("loaded {} APIs", 4);

  return 0;
}
```

Run:

```bash id="uh1l7v"
vix run debug.cpp
```

## Use with CSV

```cpp id="r9k3ps"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n");

  rix.debug.print("rows:", table.size());
  rix.debug.log.info("loaded {} rows", table.size());

  for (const auto &row : table)
  {
    rix.debug.print("fields:", row.size());
  }

  return 0;
}
```

## Use with Auth errors

```cpp id="hw7t2n"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto login = auth.login({
      "ada@example.com",
      "wrong-password"});

  if (login.failed())
  {
    const auto &error = login.error();

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  return 0;
}
```

Do not print or log authentication secrets.

Avoid:

```txt id="x4e7ry"
plain-text passwords
password hashes
session ids
raw token values
private keys
API tokens
```

## Use with PDF errors

```cpp id="l3s0wq"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "example.pdf");

  return 0;
}
```

## Single-file usage

For quick examples:

```bash id="l0n5dy"
vix run debug.cpp
```

If Rix is not available yet for single-file usage:

```bash id="y4u8cz"
vix install -g rix/rix
vix run debug.cpp
```

## Project usage

For a Vix project, add Rix:

```bash id="v8q4np"
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="s9p6dm"
deps = [
  "rix/rix",
]
```

A small manifest can look like this:

```txt id="e3h6tw"
name = "debug-app"
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

Build and run:

```bash id="ud6r5y"
vix build
vix run
```

## Independent package usage

If the project only needs Debug, install:

```bash id="q3k8ve"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="g7a9ck"
deps = [
  "rix/debug",
]
```

Then include:

```cpp id="mn2q8k"
#include <rix/debug.hpp>
```

Use this style when you do not need the unified `rix.*` facade.

## Lightweight facade usage

If you want the unified facade but only want Debug mounted:

```cpp id="f8m0yd"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Common mistakes

### Expecting `print` to replace placeholders

Wrong:

```cpp id="f6t2nx"
rix.debug.print("Package: {}", "rix/debug");
```

Use `format`:

```cpp id="d2m0bs"
rix.debug.print(
    rix.debug.format("Package: {}", "rix/debug"));
```

or use the debug logger:

```cpp id="c6q9le"
rix.debug.log.info("Package: {}", "rix/debug");
```

### Mixing placeholder styles

Wrong:

```cpp id="rx7c4s"
rix.debug.format("{} {0}", "Rix");
```

Use automatic placeholders:

```cpp id="d8z4bn"
rix.debug.format("{} {}", "Rix", "Debug");
```

or explicit placeholders:

```cpp id="n5v9eq"
rix.debug.format("{0} {1}", "Rix", "Debug");
```

### Using unsupported format specifiers

Wrong:

```cpp id="dp1n6t"
rix.debug.format("{:.2f}", 3.14159);
```

Use simple placeholders:

```cpp id="x4r8jc"
rix.debug.format("value: {}", 3.14159);
```

### Using debug log as production logging

`rix.debug.log` is a small development helper.

For deployed Vix.cpp applications, prefer Vix logging.

### Printing secrets

Do not print, inspect, or log:

```txt id="y6j5uw"
plain-text passwords
password hashes
session ids
raw token values
private keys
API tokens
```

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Wrong:

```txt id="g3q7sd"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="t2m9fq"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## API summary

Main facade:

```cpp id="fr7t5s"
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.dprint(...)
rix.debug.sprint(...)

rix.debug.format(...)
rix.debug.format.append(...)
rix.debug.format.to(...)

rix.debug.log(...)
rix.debug.log.info(...)
rix.debug.log.warn(...)
rix.debug.log.error(...)

rix.debug.inspect(...)
```

Main types:

```cpp id="jn9t4z"
rixlib::debug::Debug
rixlib::debug::Format
rixlib::debug::Log
rixlib::debug::Inspect
rixlib::format_error
```

Recommended include:

```cpp id="dm2w0x"
#include <rix.hpp>
```

Independent include:

```cpp id="g8m6vz"
#include <rix/debug.hpp>
```

## What you should remember

Use `print` for simple output:

```cpp id="p9k8qd"
rix.debug.print("Hello", "Rix");
```

Use `eprint` for stderr:

```cpp id="j1p8bm"
rix.debug.eprint("error:", "message");
```

Use `format` for placeholders:

```cpp id="u6r2sq"
auto message = rix.debug.format("Package: {}", "rix/debug");
```

Use `sprint` for print-style strings:

```cpp id="p0l6fj"
auto line = rix.debug.sprint("rows:", 3);
```

Use `inspect` to examine values:

```cpp id="yh3g9m"
rix.debug.inspect(value);
```

Use `rix.debug.log` only as a development helper.

Prefer Vix logging for real application logs.

For a Vix project, install Rix:

```bash id="t9m8zd"
vix add rix/rix
vix install
```

and use:

```txt id="n3t4kx"
deps = [
  "rix/rix",
]
```

## Next step

Continue with the PDF package.

Next: [PDF](/packages/pdf/)
