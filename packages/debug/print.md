# Print

This page explains the printing helpers provided by `rix/debug`.

The examples use the public Rix facade:

```cpp id="r7x1wq"
#include <rix.hpp>
```

and access Debug through:

```cpp id="rxcfby"
rix.debug
```

Printing is useful for examples, quick checks, local diagnostics, small command-line tools, and development-time output.

For production application logs, prefer the Vix logging system.

## Basic example

Create a file:

```bash id="bayk17"
mkdir -p ~/rix-debug-print
cd ~/rix-debug-print
touch print.cpp
```

Add:

```cpp id="fexte1"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  rix.debug.print("rows:", 3);
  rix.debug.print("ready:", true);

  rix.debug.eprint("stderr:", "example error output");

  rix.debug.dprint("debug:", "only useful while developing");

  return 0;
}
```

Run it:

```bash id="wrgdy7"
vix run print.cpp
```

If Rix is not available yet for single-file usage:

```bash id="ltc39r"
vix install -g rix/rix
vix run print.cpp
```

## Expected output

Standard output should look like this:

```txt id="wa0l8r"
Hello Rix
rows: 3
ready: true
```

The `eprint` output is written to stderr.

The exact behavior of `dprint` depends on debug configuration and build mode.

## `rix.debug.print`

Use `print` for normal development output:

```cpp id="el6utx"
rix.debug.print("Hello", "Rix");
```

`print` writes values separated by spaces and adds a trailing newline.

Example:

```cpp id="itxrng"
rix.debug.print("package:", "rix/debug");
rix.debug.print("version:", rix.debug.version());
rix.debug.print("count:", 3);
```

This is the most common print helper.

## Print multiple values

You can pass several values:

```cpp id="n3d13t"
rix.debug.print("name:", "Ada", "language:", "C++");
```

Output:

```txt id="zew84r"
name: Ada language: C++
```

Each value is rendered and separated by a space.

## Print strings

```cpp id="nxdg81"
rix.debug.print("Hello from rix/debug");
```

Output:

```txt id="bpx3tx"
Hello from rix/debug
```

## Print numbers

```cpp id="p1ngdu"
rix.debug.print("rows:", 3);
rix.debug.print("port:", 8080);
```

Output:

```txt id="kb6ali"
rows: 3
port: 8080
```

## Print booleans

```cpp id="v8dba0"
rix.debug.print("ready:", true);
rix.debug.print("failed:", false);
```

Output shape:

```txt id="d7pk0c"
ready: true
failed: false
```

## Print mixed values

```cpp id="x8ef4l"
const std::string package = "rix/debug";

rix.debug.print("package:", package, "enabled:", true);
```

Output:

```txt id="r86dwh"
package: rix/debug enabled: true
```

## `rix.debug.eprint`

Use `eprint` for error-style output:

```cpp id="djhw1d"
rix.debug.eprint("error:", "something failed");
```

`eprint` writes to stderr.

This is useful for examples where an operation can fail:

```cpp id="fxemzm"
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
```

Use `eprint` for local diagnostics, not for production logging.

## `rix.debug.dprint`

Use `dprint` for debug-only output:

```cpp id="wwbc7a"
rix.debug.dprint("debug value:", 42);
```

Use it when the message is only useful while developing.

Example:

```cpp id="ckh2yz"
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n");

rix.debug.dprint("parsed rows:", table.size());
```

## `rix.debug.sprint`

Use `sprint` when you want the same rendering as `print`, but returned as a string.

```cpp id="orwjk6"
const auto line = rix.debug.sprint("rows:", 3);

rix.debug.print(line);
```

Output:

```txt id="zpu8r6"
rows: 3
```

This is useful when you want to build a message before printing it, storing it, or passing it to another API.

## `print` vs `format`

Use `print` when you want values separated by spaces:

```cpp id="zokog3"
rix.debug.print("rows:", 3);
```

Use `format` when you want placeholder-based text:

```cpp id="c3aurk"
const auto message =
    rix.debug.format("rows: {}", 3);

rix.debug.print(message);
```

Both are useful.

`print` is faster to write.

`format` gives you more control over the message shape.

## Complete print example

```cpp id="duouct"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string package = "rix/debug";

  rix.debug.print("== print example ==");
  rix.debug.print("package:", package);
  rix.debug.print("ready:", true);
  rix.debug.print("items:", 4);

  const auto line =
      rix.debug.sprint("generated:", package);

  rix.debug.print(line);

  rix.debug.eprint("stderr example:", "local diagnostic");

  return 0;
}
```

Run it:

```bash id="b52ve5"
vix run print.cpp
```

Expected standard output:

```txt id="p2c2no"
== print example ==
package: rix/debug
ready: true
items: 4
generated: rix/debug
```

## Print CSV rows

`rix.debug.print` is useful when working with `rix/csv`.

```cpp id="s9uxr7"
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
    rix.debug.print("fields:", row.size());
  }

  return 0;
}
```

Run:

```bash id="q6rd3d"
vix run print.cpp
```

## Print Auth errors

`eprint` is useful for Auth examples.

```cpp id="di3b80"
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

Do not print authentication secrets in production.

Avoid printing:

```txt id="v9dob7"
plain-text passwords
password hashes
session ids
raw token values
```

## Print PDF results

`eprint` is useful when a PDF operation fails.

```cpp id="b7843j"
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

## Use in a Vix project

Create a Vix application:

```bash id="k7zj3w"
vix new debug-print --app
cd debug-print
```

Add Rix:

```bash id="sv5y3h"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="evv4c5"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="e2usku"
name = "debug-print"
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

```cpp id="ti6oef"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  rix.debug.eprint("stderr:", "example");

  return 0;
}
```

Build and run:

```bash id="t58x3s"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="pdcfai"
vix run print.cpp
```

If Rix is installed globally for single-file usage:

```bash id="yqgz08"
vix install -g rix/rix
vix run print.cpp
```

For project usage, prefer:

```bash id="qv1nxn"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="caa9wk"
deps = [
  "rix/rix",
]
```

## Use only Debug with the facade

If you want the `rix.*` facade style but only want Debug mounted, define the feature macro before including `rix.hpp`:

```cpp id="gn5di0"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="zbmbd2"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="i6ui0d"
deps = [
  "rix/debug",
]
```

Then include the independent package header:

```cpp id="z11z3t"
#include <rix/debug.hpp>
```

Use this style when a project only needs Debug and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="a2plx1"
#include <rix.hpp>
```

## Logging note

Printing is not the same as production logging.

Use `rix.debug.print`, `rix.debug.eprint`, `rix.debug.dprint`, and `rix.debug.sprint` for:

```txt id="l44dl9"
examples
local diagnostics
small tools
tests
quick checks
documentation snippets
```

For real application logs, prefer the Vix logging system.

Use this rule:

```txt id="sw4f7r"
rix.debug -> simple development output
Vix logging -> production logs and runtime observability
```

## Common mistakes

### Using print as production logging

`rix.debug.print` is for development output and examples.

For services and deployed applications, use the Vix logging system.

### Printing secrets

Do not print:

```txt id="hfo6xo"
plain-text passwords
password hashes
session ids
raw token values
```

This matters especially when using `rix/auth`.

### Expecting `print` to format placeholders

`print` does not replace `{}` placeholders.

Wrong:

```cpp id="yd6va0"
rix.debug.print("Package: {}", "rix/debug");
```

This prints the values separated by spaces.

Use `format` when you want placeholder replacement:

```cpp id="w2n0l6"
rix.debug.print(
    rix.debug.format("Package: {}", "rix/debug"));
```

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="np1mfi"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Print values:

```cpp id="e2q0al"
rix.debug.print("Hello", "Rix");
```

Print to stderr:

```cpp id="ns8yvk"
rix.debug.eprint("error:", "message");
```

Debug-only print:

```cpp id="kr3mfl"
rix.debug.dprint("debug:", 42);
```

Build printed output as a string:

```cpp id="e2cjr9"
auto line = rix.debug.sprint("rows:", 3);
```

Use `format` when you need placeholders:

```cpp id="eq1g7r"
auto message = rix.debug.format("Package: {}", "rix/debug");
```

For a Vix project, install Rix:

```bash id="zl3wo5"
vix add rix/rix
vix install
```

and use:

```txt id="w26yc5"
deps = [
  "rix/rix",
]
```

Prefer Vix logging for real application logs.

## Next step

Learn formatting.

Next: [Formatting](./format)
