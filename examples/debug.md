# Debug Example

This page shows a small debug example using the public Rix facade.

The example uses:

```cpp id="vy6n4q"
#include <rix.hpp>
```

and accesses debug helpers through:

```cpp id="q4x8mc"
rix.debug
```

Use this example when you want simple printing, formatting, and inspection from a small C++ file.

For real Vix applications, prefer the Vix logging system for application logs.

## Create the file

```bash id="n5q8rz"
mkdir -p ~/rix-debug-example
cd ~/rix-debug-example
touch debug.cpp
```

Add:

```cpp id="t8p4xm"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");

  const std::string package = rix.debug.format(
      "Package: {}",
      "rix/rix");

  rix.debug.print(package);

  rix.debug.print("loaded debug APIs:", 4);
  rix.debug.eprint("warning:", "this is printed to stderr");

  rix.debug.inspect(package);

  return 0;
}
```

Run it:

```bash id="f6d9pa"
vix run debug.cpp
```

If Rix is not available yet for single-file usage:

```bash id="g2v7cw"
vix install -g rix/rix
vix run debug.cpp
```

Expected output shape:

```txt id="y4k9dm"
Hello Rix
Package: rix/rix
loaded debug APIs: 4
"Package: rix/rix"
```

The warning line is printed to stderr.

## What this example does

The example prints values with:

```cpp id="h8v2qc"
rix.debug.print("Hello", "Rix");
```

It formats a string with:

```cpp id="w3m6xr"
const std::string package = rix.debug.format(
    "Package: {}",
    "rix/rix");
```

It prints an error or warning-style message to stderr with:

```cpp id="v7r5kt"
rix.debug.eprint("warning:", "this is printed to stderr");
```

It inspects a value with:

```cpp id="p9x2hb"
rix.debug.inspect(package);
```

## Print values

Use `rix.debug.print` to print values separated by spaces:

```cpp id="c6m9vq"
rix.debug.print("Hello", "Rix");
```

Output:

```txt id="m4t7nx"
Hello Rix
```

You can pass several values:

```cpp id="x5b8ky"
rix.debug.print("name:", "Ada", "language:", "C++");
```

Output shape:

```txt id="q2c9dv"
name: Ada language: C++
```

## Print to stderr

Use `rix.debug.eprint` for stderr output:

```cpp id="z7n4pa"
rix.debug.eprint("error:", "something failed");
```

Use this for examples, small tools, and visible failure messages.

For real Vix application logs, prefer the Vix logging system.

## Debug-only print

Use `rix.debug.dprint` for debug-only printing:

```cpp id="k8f3ny"
rix.debug.dprint("debug value:", 42);
```

Use this when you want temporary debug output during development.

## Format strings

Use `rix.debug.format` to create a string from placeholders:

```cpp id="r2v6xb"
const auto message = rix.debug.format(
    "Hello, {}",
    "Rix");
```

Then:

```cpp id="f8q5wp"
rix.debug.print(message);
```

Output:

```txt id="n3m7kc"
Hello, Rix
```

## Automatic placeholders

Use `{}` for automatic argument order:

```cpp id="b9x4qd"
const auto message = rix.debug.format(
    "{} uses {}",
    "Rix",
    "C++");
```

Output:

```txt id="w6h8vt"
Rix uses C++
```

## Explicit placeholders

Use `{0}`, `{1}`, and other indexes for explicit argument positions:

```cpp id="p4q9xm"
const auto message = rix.debug.format(
    "{0} is built for {1}. {0} keeps examples simple.",
    "Rix",
    "C++");
```

Output:

```txt id="y8k2za"
Rix is built for C++. Rix keeps examples simple.
```

Do not mix automatic and explicit placeholders in the same format string.

## Escaped braces

Use double opening braces and double closing braces when you want literal braces:

````cpp
const auto message = rix.debug.format(
    "{{ package }} = {}",
    "rix/rix");
```
Output:

```txt id="d9v6np"
{ package } = rix/rix
````

## Unsupported format specifiers

The debug formatter intentionally stays small.

This is not supported:

```cpp id="v2b8ks"
rix.debug.format("{:.2f}", 3.14);
```

Use simple placeholders:

```cpp id="h5m9xr"
rix.debug.format("value: {}", 3.14);
```

## Format into an existing string

You can write formatted output into an existing string:

```cpp id="q8t3bd"
std::string out;

rix.debug.format.to(
    out,
    "Package: {}",
    "rix/rix");

rix.debug.print(out);
```

## Append formatted output

Use `append` when you want to add formatted text to an existing string:

```cpp id="z6r2fc"
std::string out = "Result: ";

rix.debug.format.append(
    out,
    "{}",
    "ok");

rix.debug.print(out);
```

Output:

```txt id="p7n5xa"
Result: ok
```

## Format complete example

```cpp id="m9q4vz"
#include <rix.hpp>

int main()
{
  const auto package = rix.debug.format(
      "Package: {}",
      "rix/debug");

  const auto api = rix.debug.format(
      "{0} exposes print, format, and inspect helpers.",
      "rix/debug");

  rix.debug.print(package);
  rix.debug.print(api);

  std::string out;

  rix.debug.format.to(
      out,
      "Status: {}",
      "ready");

  rix.debug.print(out);

  rix.debug.format.append(
      out,
      " / rows: {}",
      3);

  rix.debug.print(out);

  return 0;
}
```

Run:

```bash id="n6t9wp"
vix run debug.cpp
```

## Inspect values

Use `rix.debug.inspect` to inspect a value:

```cpp id="a4x8kd"
std::string package = "rix/rix";

rix.debug.inspect(package);
```

Inspection is useful when you want to see a value in a more debug-oriented form.

## Sprint values

Use `rix.debug.sprint` to create a string from printed values:

```cpp id="g8v2cq"
const auto message = rix.debug.sprint(
    "name:",
    "Ada",
    "language:",
    "C++");

rix.debug.print(message);
```

This is useful when you want `print`-style rendering but need the result as a string.

## Debug with CSV

```cpp id="k7p4mx"
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

Run:

```bash id="x3q5vr"
vix run debug.cpp
```

## Debug with auth

```cpp id="b6m8ky"
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
  rix.debug.print("user id:", registered.value().id());

  return 0;
}
```

Use debug output to make examples easier to understand.

Do not print passwords, session ids, or token values in production logs.

## Debug with PDF

```cpp id="v5c8rp"
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

## Use in a Vix project

Create a project:

```bash id="s9d4xf"
vix new rix-debug-example --app
cd rix-debug-example
```

Add Rix:

```bash id="a7n5qb"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="q3v9mx"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="c2k8vp"
name = "rix-debug-example"
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

Put the example code in:

```txt id="f5b7nd"
src/main.cpp
```

Build and run:

```bash id="p8r4ca"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="w8z2ht"
vix run debug.cpp
```

If needed:

```bash id="j6m3vx"
vix install -g rix/rix
vix run debug.cpp
```

For project usage, prefer:

```bash id="n9q5yb"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="h7c2qd"
deps = [
  "rix/rix",
]
```

## Use only debug with the facade

If you want the `rix.*` facade style but only want debug mounted, define the feature macro before including `rix.hpp`:

```cpp id="y2x9np"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from rix.debug");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="m4v8xq"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="x7n3ra"
deps = [
  "rix/debug",
]
```

Then include the debug package header directly:

```cpp id="z9k6hc"
#include <rix/debug.hpp>
```

Use this style when a project only needs debug and does not need the full unified Rix facade.

For most examples in this documentation, prefer:

```cpp id="p4h8vx"
#include <rix.hpp>
```

## About logging

`rix.debug` contains small debug helpers for examples and development output.

For real Vix applications, prefer the Vix logging system.

Use:

```cpp id="n7d5qw"
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.format(...)
rix.debug.inspect(...)
```

for documentation examples, quick experiments, and simple tools.

Use Vix logging for application logs, production diagnostics, and runtime logging.

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="q9r3vy"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="k5m8xa"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="g8v4qc"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="d2p7mr"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Mixing placeholder styles

Wrong:

```cpp id="r6c9xn"
rix.debug.format("{} uses {1}", "Rix", "C++");
```

Use automatic placeholders:

```cpp id="t3x8qd"
rix.debug.format("{} uses {}", "Rix", "C++");
```

or explicit placeholders:

```cpp id="w4p9ka"
rix.debug.format("{0} uses {1}", "Rix", "C++");
```

Do not mix both styles in one string.

### Using unsupported format specifiers

Wrong:

```cpp id="m8k2zb"
rix.debug.format("{:.2f}", 3.14);
```

Correct:

```cpp id="v5q7hd"
rix.debug.format("value: {}", 3.14);
```

### Printing sensitive values

Avoid printing passwords, raw tokens, and session ids in production.

For docs and examples, keep output simple and safe.

### Using debug output as production logging

For examples:

```cpp id="x8b6yc"
rix.debug.print(...)
```

For real Vix applications, prefer the Vix logging system.

## What you should remember

Use the facade:

```cpp id="f9x2rb"
#include <rix.hpp>
```

Print values:

```cpp id="a6q5vy"
rix.debug.print("Hello", "Rix");
```

Print to stderr:

```cpp id="h4n9zx"
rix.debug.eprint("error:", "failed");
```

Format strings:

```cpp id="p7c3km"
const auto text = rix.debug.format(
    "Package: {}",
    "rix/rix");
```

Inspect values:

```cpp id="r2v8mq"
rix.debug.inspect(text);
```

Run a simple file:

```bash id="c8m5qp"
vix run debug.cpp
```

For project usage:

```bash id="v6k4xn"
vix add rix/rix
vix install
```

and keep:

```txt id="b9t2wc"
deps = [
  "rix/rix",
]
```

## Next step

Continue with the PDF examples.

Next: [PDF example](./pdf/basic)
