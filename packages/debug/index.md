# Debug

`rix/debug` is the Rix package for simple development-time output, formatting, printing, and inspection.

It is designed for examples, local diagnostics, learning, and small tools.

The examples on this page use the public Rix facade:

```cpp id="nqvxqk"
#include <rix.hpp>
```

and access Debug through:

```cpp id="d9mxpo"
rix.debug
```

## What `rix/debug` provides

`rix/debug` provides a small API for:

```txt id="h6cjtb"
printing values
printing errors
debug-only prints
formatting strings
formatting printed values into strings
inspecting values
simple local diagnostics
```

The goal is to keep examples and development code easy to read.

For production application logs, prefer the Vix logging system.

## Basic example

Create a file:

```bash id="s9pssq"
mkdir -p ~/rix-debug-example
cd ~/rix-debug-example
touch debug.cpp
```

Add:

```cpp id="ac7byr"
#include <rix.hpp>

#include <string>

int main()
{
  rix.debug.print("Hello", "Rix");

  const std::string package =
      rix.debug.format("Package: {}", "rix/rix");

  rix.debug.print(package);

  rix.debug.eprint("error output:", "example");

  rix.debug.inspect(package);

  return 0;
}
```

Run it:

```bash id="d1vngj"
vix run debug.cpp
```

If Rix is not available yet for single-file usage:

```bash id="r8gved"
vix install -g rix/rix
vix run debug.cpp
```

## Expected output

The output should look like this:

```txt id="om8pbt"
Hello Rix
Package: rix/rix
```

The `eprint` output is written to stderr.

The exact inspection output depends on the value being inspected.

## Install

For normal usage through the unified facade, install:

```bash id="otde51"
vix add rix/rix
vix install
```

In `vix.app`, declare:

```txt id="ga13eo"
deps = [
  "rix/rix",
]
```

If you want to use only the independent debug package, install:

```bash id="lgk8i9"
vix add rix/debug
vix install
```

and declare:

```txt id="xv3lu7"
deps = [
  "rix/debug",
]
```

For most documentation examples, prefer the facade package:

```cpp id="kzo6gd"
#include <rix.hpp>
```

## Print values

Use:

```cpp id="j1f7a3"
rix.debug.print(...)
```

Example:

```cpp id="x6lv32"
rix.debug.print("Hello", "Rix");
rix.debug.print("rows:", 3);
rix.debug.print("ready:", true);
```

`print` writes values separated by spaces and adds a trailing newline.

It is useful for examples and quick checks.

## Print errors

Use:

```cpp id="mp42ph"
rix.debug.eprint(...)
```

Example:

```cpp id="bb3ltw"
rix.debug.eprint("error:", "something failed");
```

`eprint` writes to stderr.

Use it for local error output in examples.

## Debug-only print

Use:

```cpp id="ja6m30"
rix.debug.dprint(...)
```

Example:

```cpp id="xqvbig"
rix.debug.dprint("debug value:", 42);
```

Use `dprint` for debug-only output.

The exact behavior depends on the debug package configuration.

## Format a string

Use:

```cpp id="kr5njy"
rix.debug.format(...)
```

Example:

```cpp id="eq6kn8"
const auto message =
    rix.debug.format("Package: {}", "rix/rix");

rix.debug.print(message);
```

Output:

```txt id="uwvdo5"
Package: rix/rix
```

## Formatting placeholders

`rix.debug.format` supports simple placeholders:

```txt id="qi2xlo"
{}      automatic argument indexing
{0}     explicit positional indexing
{{      escaped opening brace
}}      escaped closing brace
```

Examples:

```cpp id="b7lvwc"
auto a = rix.debug.format("Hello, {}", "Ada");

auto b = rix.debug.format(
    "Value = {0}, name = {1}",
    42,
    "Ada");

auto c = rix.debug.format(
    "{{ package }} = {}",
    "rix/rix");
```

## Automatic placeholders

Use `{}` for automatic argument order:

```cpp id="p28uq9"
auto message =
    rix.debug.format("{} uses {}", "Rix", "C++");
```

Result:

```txt id="sjdbew"
Rix uses C++
```

## Explicit placeholders

Use `{0}`, `{1}`, and other numeric indexes when the order should be explicit:

```cpp id="m8vnfa"
auto message =
    rix.debug.format("{0} + {0} = {1}", "C++", "Vix.cpp");
```

Result:

```txt id="kj3yci"
C++ + C++ = Vix.cpp
```

Do not mix automatic and explicit indexing in the same format string.

## Escaped braces

Use double opening braces and double closing braces when you need literal braces:

```cpp
auto message =
    rix.debug.format("{{ package }} = {}", "rix/debug");
```

Result:

```txt id="r57l7n"
{ package } = rix/debug
```

## Unsupported format specifiers

`rix.debug.format` intentionally keeps formatting small.

It does not support format specifiers such as:

```txt id="dq8zo2"
{:>10}
{:.2f}
{:04d}
```

Use simple placeholders for Rix debug formatting.

For advanced formatting, use another formatting library or normal C++ formatting tools where appropriate.

## Append formatted output

You can append formatted text to an existing string:

```cpp id="g8wxwl"
std::string out = "Rix: ";

rix.debug.format.append(
    out,
    "{}",
    "debug");

rix.debug.print(out);
```

Expected output:

```txt id="q6lhfv"
Rix: debug
```

## Replace a string with formatted output

Use:

```cpp id="vqxss8"
rix.debug.format.to(out, "Package: {}", "rix/debug");
```

Example:

```cpp id="qcic6t"
std::string out;

rix.debug.format.to(
    out,
    "Package: {}",
    "rix/debug");

rix.debug.print(out);
```

## Sprint

Use:

```cpp id="wtx74k"
rix.debug.sprint(...)
```

when you want the same value rendering as `print`, but returned as a string.

Example:

```cpp id="ga2abx"
const auto line = rix.debug.sprint("rows:", 3);

rix.debug.print(line);
```

This is useful when you want to build a message before printing or storing it.

## Inspect values

Use:

```cpp id="odm96h"
rix.debug.inspect(value);
```

Example:

```cpp id="gdfcc0"
std::string package = "rix/rix";

rix.debug.inspect(package);
```

Inspection is useful during development when you want to see a value clearly.

## Local debug output

`rix/debug` is useful in documentation examples because it keeps output simple:

```cpp id="to47jr"
rix.debug.print("registered user");
rix.debug.print("id:", user.id());
rix.debug.print("email:", user.email());
```

It is also useful when testing other Rix packages:

```cpp id="u8khj2"
const auto table = rix.csv.parse(input);

rix.debug.print("rows:", table.size());
```

## Logging note

`rix.debug.log` exists as a simple debug package component, but for real application logging prefer the Vix logging system.

Use `rix.debug` for:

```txt id="ac3fnz"
examples
small tools
local diagnostics
quick prints
tests
documentation snippets
```

Use Vix logging for:

```txt id="ctkfh2"
production logs
structured application logs
request logs
service logs
deployment diagnostics
runtime observability
```

In other words:

```txt id="j1xch3"
rix.debug -> simple development output
Vix logging -> real application logging
```

## Use in a Vix project

Create an application:

```bash id="pjuv3w"
vix new debug-app --app
cd debug-app
```

Add Rix:

```bash id="k1mtwr"
vix add rix/rix
vix install
```

In `vix.app`, add:

```txt id="mhb1ux"
deps = [
  "rix/rix",
]
```

A small manifest can look like this:

```txt id="v3s6lz"
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

```cpp id="smfye6"
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

```bash id="il4sjr"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="m9sa4g"
vix run debug.cpp
```

If Rix is installed globally for single-file usage:

```bash id="m3ck2q"
vix install -g rix/rix
vix run debug.cpp
```

For project usage, prefer:

```bash id="gxwht0"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="kjoam7"
deps = [
  "rix/rix",
]
```

## Facade usage

The recommended documentation style is:

```cpp id="myxaj8"
#include <rix.hpp>
```

Then:

```cpp id="lr433q"
rix.debug.print("Hello", "Rix");
```

This keeps Debug available through the same public object as the other Rix packages:

```cpp id="pk35qn"
rix.csv
rix.debug
rix.auth
rix.pdf
```

## Independent package usage

If your project only needs Debug, install:

```bash id="dkm776"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="rbm7eu"
deps = [
  "rix/debug",
]
```

Then include:

```cpp id="q2vyrs"
#include <rix/debug.hpp>
```

Use this style when you do not need the unified `rix.*` facade.

For most application documentation, prefer:

```cpp id="qjpanc"
#include <rix.hpp>
```

## Lightweight facade usage

If you want the `rix.*` facade style but only want Debug mounted, define the feature macro before including `rix.hpp`:

```cpp id="x72j0b"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

This keeps the facade style while reducing what gets included.

## Debug with CSV

Debug is useful for printing parsed CSV data:

```cpp id="qx8vuz"
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

Debug is useful for documentation examples:

```cpp id="r54wb0"
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
```

Do not print authentication secrets in production.

Avoid logging:

```txt id="jn3wh0"
plain-text passwords
password hashes
session ids
raw token values
```

## Debug with PDF

Debug is useful when checking PDF generation:

```cpp id="qwk8zu"
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

## Common mistakes

### Using debug output as production logging

`rix.debug` is for simple development output.

For real application logs, prefer Vix logging.

### Printing secrets

Do not print:

```txt id="r5860s"
plain-text passwords
password hashes
session ids
raw token values
```

This matters especially when using `rix/auth`.

### Mixing automatic and explicit format indexes

Wrong:

```cpp id="bijatr"
rix.debug.format("{} {0}", "Rix");
```

Use either automatic:

```cpp id="e6o35m"
rix.debug.format("{} {}", "Rix", "Debug");
```

or explicit:

```cpp id="ezf83n"
rix.debug.format("{0} {1}", "Rix", "Debug");
```

### Expecting advanced format specifiers

This is not supported:

```cpp id="ss1cr2"
rix.debug.format("{:.2f}", 3.14159);
```

Use simple placeholders.

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="oe26jr"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Use the facade:

```cpp id="cum85m"
#include <rix.hpp>
```

Print values:

```cpp id="x12uug"
rix.debug.print("Hello", "Rix");
```

Print errors:

```cpp id="md50hr"
rix.debug.eprint("error:", "message");
```

Format strings:

```cpp id="d9huir"
auto message = rix.debug.format("Package: {}", "rix/debug");
```

Inspect values:

```cpp id="b4e5f7"
rix.debug.inspect(message);
```

Use `rix.debug` for development output and examples.

Prefer Vix logging for real application logs.

For a Vix project, install Rix:

```bash id="khnwm4"
vix add rix/rix
vix install
```

and use:

```txt id="fwp6a1"
deps = [
  "rix/rix",
]
```

## Next step

Learn formatting.

Next: [Formatting](./format)
