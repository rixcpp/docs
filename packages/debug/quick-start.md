# Debug Quick Start

This page shows the fastest way to use `rix/debug`.

The examples use the public Rix facade:

```cpp id="h2qp4d"
#include <rix.hpp>
```

and access Debug through:

```cpp id="pd1w3y"
rix.debug
```

`rix/debug` is useful for examples, quick tools, local diagnostics, and development-time output.

For production application logs, prefer the Vix logging system.

## What you will build

You will create a small C++ file that:

```txt id="x1f7hb"
prints values
prints an error message
formats a string
stores printed output in a string
inspects a value
runs with vix run
```

## Create a working folder

Create a small folder in your home directory:

```bash id="d5ajh9"
mkdir -p ~/rix-debug-quick-start
cd ~/rix-debug-quick-start
touch debug.cpp
```

## Add the example

Open:

```txt id="jnld8r"
debug.cpp
```

Add:

```cpp id="u923zc"
#include <rix.hpp>

#include <string>

int main()
{
  rix.debug.print("== rix/debug quick start ==");

  rix.debug.print("Hello", "Rix");
  rix.debug.print("rows:", 3);
  rix.debug.print("ready:", true);

  const std::string package =
      rix.debug.format("Package: {}", "rix/debug");

  rix.debug.print(package);

  const std::string line =
      rix.debug.sprint("generated line:", package);

  rix.debug.print(line);

  rix.debug.eprint("stderr example:", "this is an error-style message");

  rix.debug.inspect(package);

  return 0;
}
```

## Run the file

Run:

```bash id="abwfxe"
vix run debug.cpp
```

If Rix is not available yet for single-file usage:

```bash id="wzc2ig"
vix install -g rix/rix
vix run debug.cpp
```

## Expected output

The output should look similar to this:

```txt id="wlyyb7"
== rix/debug quick start ==
Hello Rix
rows: 3
ready: true
Package: rix/debug
generated line: Package: rix/debug
```

The `eprint` output is written to stderr.

The exact `inspect` output depends on the inspected value.

## Print values

Use:

```cpp id="mfis66"
rix.debug.print(...)
```

Example:

```cpp id="cv226y"
rix.debug.print("Hello", "Rix");
rix.debug.print("count:", 3);
rix.debug.print("ok:", true);
```

`print` writes values separated by spaces and adds a newline.

This is the most common `rix/debug` helper.

## Print errors

Use:

```cpp id="o26m2g"
rix.debug.eprint(...)
```

Example:

```cpp id="r83abf"
rix.debug.eprint("error:", "something failed");
```

`eprint` writes to stderr.

Use it for examples, local diagnostics, and command-line tools.

## Debug-only print

Use:

```cpp id="jgc5ob"
rix.debug.dprint(...)
```

Example:

```cpp id="c6b10j"
rix.debug.dprint("debug value:", 42);
```

Use this when the message is only useful while debugging.

## Format a string

Use:

```cpp id="guz9y5"
rix.debug.format(...)
```

Example:

```cpp id="vny167"
const auto message =
    rix.debug.format("Package: {}", "rix/debug");

rix.debug.print(message);
```

Output:

```txt id="yh874r"
Package: rix/debug
```

## Automatic placeholders

Use `{}` to insert arguments in order:

```cpp id="ivx3go"
const auto message =
    rix.debug.format("{} uses {}", "Rix", "C++");
```

Result:

```txt id="g5ytou"
Rix uses C++
```

## Explicit placeholders

Use `{0}`, `{1}`, and other indexes when you want explicit argument positions:

```cpp id="rdnqip"
const auto message =
    rix.debug.format("{0} + {0} = {1}", "C++", "Vix.cpp");
```

Result:

```txt id="skdk6q"
C++ + C++ = Vix.cpp
```

Do not mix automatic placeholders and explicit placeholders in the same format string.

## Escape braces

Use double opening braces and double closing braces when you need literal braces:

```cpp
const auto message =
    rix.debug.format("{{ package }} = {}", "rix/debug");
```

Result:

```txt id="f1kfy4"
{ package } = rix/debug
```

## Unsupported format specifiers

`rix.debug.format` is intentionally small.

It does not support format specifiers such as:

```txt id="rdf7yc"
{:.2f}
{:>10}
{:04d}
```

Use simple placeholders.

For advanced formatting, use another formatting library or normal C++ formatting tools where appropriate.

## Append formatted output

You can append formatted text to an existing string:

```cpp id="o3wlqa"
std::string out = "Rix: ";

rix.debug.format.append(
    out,
    "{}",
    "debug");

rix.debug.print(out);
```

Expected output:

```txt id="edb66u"
Rix: debug
```

## Replace a string with formatted output

Use:

```cpp id="t5xsmm"
std::string out;

rix.debug.format.to(
    out,
    "Package: {}",
    "rix/debug");

rix.debug.print(out);
```

Expected output:

```txt id="qfs7gb"
Package: rix/debug
```

## Sprint values into a string

Use:

```cpp id="dhf2p5"
rix.debug.sprint(...)
```

when you want the same value rendering as `print`, but returned as a string.

Example:

```cpp id="u73svo"
const auto line =
    rix.debug.sprint("rows:", 3);

rix.debug.print(line);
```

This is useful when you want to build a message before printing it.

## Inspect a value

Use:

```cpp id="h2b3an"
rix.debug.inspect(value);
```

Example:

```cpp id="p941x2"
std::string package = "rix/debug";

rix.debug.inspect(package);
```

Inspection is useful when you want a clearer development-time view of a value.

## Complete formatting example

```cpp id="ky8jdv"
#include <rix.hpp>

#include <string>

int main()
{
  const auto one =
      rix.debug.format("Hello, {}", "Ada");

  const auto two =
      rix.debug.format("{0} builds on {1}", "Rix", "Vix.cpp");

  const auto three =
      rix.debug.format("{{ module }} = {}", "debug");

  rix.debug.print(one);
  rix.debug.print(two);
  rix.debug.print(three);

  return 0;
}
```

Run:

```bash id="mr4lfd"
vix run debug.cpp
```

Expected output:

```txt id="c7u79r"
Hello, Ada
Rix builds on Vix.cpp
{ module } = debug
```

## Use in a Vix project

Create a Vix application:

```bash id="c8z9pm"
vix new debug-app --app
cd debug-app
```

Add Rix:

```bash id="xv53it"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="l58pdp"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="wi9c6v"
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

Then use Debug in `src/main.cpp`:

```cpp id="l3kqj9"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");

  const auto message =
      rix.debug.format("Package: {}", "rix/debug");

  rix.debug.print(message);

  return 0;
}
```

Build and run:

```bash id="n44hgn"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments, use:

```bash id="dtxs6i"
vix run debug.cpp
```

If Rix is installed globally for single-file usage:

```bash id="sd88m3"
vix install -g rix/rix
vix run debug.cpp
```

For project usage, prefer:

```bash id="b3g93m"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="ji3r2v"
deps = [
  "rix/rix",
]
```

## Use only Debug with the facade

If you want the `rix.*` facade style but only want Debug mounted, define the feature macro before including `rix.hpp`:

```cpp id="o9jd73"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

This is useful for lighter builds.

## Use the independent package

For independent usage, install:

```bash id="qcxfr2"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="o9pcmx"
deps = [
  "rix/debug",
]
```

Then include the independent package header:

```cpp id="xqkkiw"
#include <rix/debug.hpp>
```

Use this style when a project only needs Debug and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="rpqhu4"
#include <rix.hpp>
```

## Debug with CSV

Debug is useful for printing parsed CSV data:

```cpp id="ukczja"
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n");

rix.debug.print("rows:", table.size());

for (const auto &row : table)
{
  rix.debug.print("fields:", row.size());
}
```

## Debug with Auth

Debug is useful for examples that show Auth results:

```cpp id="wvwgng"
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});

if (registered.failed())
{
  const auto &error = registered.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());

  return 1;
}

rix.debug.print("registered:", registered.value().email());
```

Do not print authentication secrets in production.

Avoid printing:

```txt id="hneops"
plain-text passwords
password hashes
session ids
raw token values
```

## Debug with PDF

Debug is useful for checking whether a PDF was created:

```cpp id="fa6agg"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");

auto saved = rix.pdf.save(doc, "example.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}

rix.debug.print("created:", "example.pdf");
```

## Logging note

`rix/debug` is not the main production logging API.

Use `rix.debug.print`, `rix.debug.eprint`, `rix.debug.dprint`, `rix.debug.format`, and `rix.debug.inspect` for development output and documentation examples.

For real application logs, prefer the Vix logging system.

Use this rule:

```txt id="ufao6f"
rix.debug -> examples, local diagnostics, quick tools
Vix logging -> production logs, service logs, request logs
```

## Common mistakes

### Using debug output as production logging

`rix.debug` is for simple development output.

For real application logs, use the Vix logging system.

### Printing secrets

Do not print:

```txt id="alkhh9"
plain-text passwords
password hashes
session ids
raw token values
```

This matters especially when using `rix/auth`.

### Mixing placeholder styles

Wrong:

```cpp id="fx8q4x"
rix.debug.format("{} {0}", "Rix");
```

Use automatic placeholders:

```cpp id="jidxhm"
rix.debug.format("{} {}", "Rix", "Debug");
```

or explicit placeholders:

```cpp id="c4azl1"
rix.debug.format("{0} {1}", "Rix", "Debug");
```

### Expecting advanced format specifiers

Wrong:

```cpp id="m7kc1h"
rix.debug.format("{:.2f}", 3.14159);
```

Use simple placeholders:

```cpp id="dq76z8"
rix.debug.format("value: {}", 3.14159);
```

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="qrn4ac"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Use the facade:

```cpp id="rr1yvg"
#include <rix.hpp>
```

Print values:

```cpp id="ph1daj"
rix.debug.print("Hello", "Rix");
```

Print to stderr:

```cpp id="kb0dvc"
rix.debug.eprint("error:", "message");
```

Format strings:

```cpp id="ahr9zt"
auto message = rix.debug.format("Package: {}", "rix/debug");
```

Build printed output as a string:

```cpp id="ivb9oe"
auto line = rix.debug.sprint("rows:", 3);
```

Inspect values:

```cpp id="pkn606"
rix.debug.inspect(message);
```

For a Vix project, install Rix:

```bash id="z41l32"
vix add rix/rix
vix install
```

and use:

```txt id="ojrg13"
deps = [
  "rix/rix",
]
```

Use `rix.debug` for examples and development output.

Prefer Vix logging for real application logs.

## Next step

Learn the printing helpers.

Next: [Printing](./print)
