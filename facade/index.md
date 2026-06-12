# Rix Facade

The Rix facade is the unified public API for Rix packages.

It gives Vix.cpp applications one clean entry point:

```cpp
#include <rix.hpp>
```

Then you use the global `rix` object:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

The facade is the recommended style for public Rix examples.

## What the facade solves

Each Rix package can be used independently.

That is useful when a project only needs one package.

But applications often use several userland libraries together.

The facade gives them one clean object-style API:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");

  auto auth = rix.auth.memory();
  auto table = rix.csv.parse("name,lang\nAda,C++\n");
  auto doc = rix.pdf.document();

  return 0;
}
```

The model is simple:

```txt
rix.<package>
```

Examples:

```txt
rix.auth
rix.csv
rix.debug
rix.pdf
```

## Install the facade

For a project, install the facade package:

```bash
vix add rix/rix
vix install
```

If the project uses `vix.app`, declare the dependency in `deps`:

```txt
deps = [
  "rix/rix",
]
```

`deps` is for packages from the Vix Registry.

Do not put Rix packages in `packages`.

## Single-file usage

For quick experiments, you can write one file and run it with Vix.

Create a small folder:

```bash
mkdir -p ~/rix-facade-example
cd ~/rix-facade-example
```

Create a file:

```bash
touch main.cpp
```

Add:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from the Rix facade");

  auto auth = rix.auth.memory();
  auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

Run it:

```bash
vix run main.cpp
```

If Rix is not available yet, install the facade globally:

```bash
vix install -g rix/rix
```

Then run again:

```bash
vix run main.cpp
```

Global installation is useful for quick local experiments.

For real projects, prefer project dependencies with `vix add`, `vix install`, and `deps` in `vix.app`.

## Project usage

Inside a Vix project, use project dependencies:

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

A small `vix.app` can look like this:

```txt
name = "hello-rix"
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

Then use the facade in C++:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  auto auth = rix.auth.memory();

  return 0;
}
```

Build and run:

```bash
vix build
vix run
```

## Package model

A Rix package follows a stable model:

```txt
Package  : rix/name
Header   : <rix/name.hpp>
Namespace: rixlib::name
Facade   : rix.name
```

For Auth:

```txt
Package  : rix/auth
Header   : <rix/auth.hpp>
Namespace: rixlib::auth
Facade   : rix.auth
```

For CSV:

```txt
Package  : rix/csv
Header   : <rix/csv.hpp>
Namespace: rixlib::csv
Facade   : rix.csv
```

For Debug:

```txt
Package  : rix/debug
Header   : <rix/debug.hpp>
Namespace: rixlib::debug
Facade   : rix.debug
```

For PDF:

```txt
Package  : rix/pdf
Header   : <rix/pdf.hpp>
Namespace: rixlib::pdf
Facade   : rix.pdf
```

For the unified facade:

```txt
Package  : rix/rix
Header   : <rix.hpp>
Facade   : rix
```

## Current facade modules

The facade can mount the current Rix packages:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

### Auth

Auth is available through:

```cpp
rix.auth
```

Common APIs:

```cpp
rix.auth.memory()
rix.auth.database(db)
rix.auth.password.hash(...)
rix.auth.password.verify(...)
rix.auth.config.development()
rix.auth.config.production()
rix.auth.error.to_string(...)
```

Example:

```cpp
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

### CSV

CSV is available through:

```cpp
rix.csv
```

Common APIs:

```cpp
rix.csv.parse(...)
rix.csv.write(...)
rix.csv.write_row(...)
rix.csv.write_to(...)
rix.csv.load(...)
rix.csv.save(...)
rix.csv.version()
```

Example:

```cpp
auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n");

auto output = rix.csv.write(table);
```

### Debug

Debug is available through:

```cpp
rix.debug
```

Common APIs:

```cpp
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.dprint(...)
rix.debug.sprint(...)
rix.debug.format(...)
rix.debug.inspect(...)
```

Example:

```cpp
rix.debug.print("Hello", "Rix");
auto text = rix.debug.format("Package: {}", "rix/rix");

rix.debug.inspect(text);
```

For application logging, prefer the Vix logging system.

Use `rix.debug` for lightweight debug output, formatting, printing, and inspection.

### PDF

PDF is available through:

```cpp
rix.pdf
```

Common APIs:

```cpp
rix.pdf.document()
rix.pdf.write(...)
rix.pdf.save(...)
rix.pdf.make_text(...)
rix.pdf.image.load_jpeg(...)
rix.pdf.error.to_string(...)
```

Example:

```cpp
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf"
);

auto saved = rix.pdf.save(doc, "hello.pdf");
```

## Facade and lower-level APIs

The facade is the public application API:

```cpp
rix.auth.memory()
rix.csv.parse(...)
rix.debug.print(...)
rix.pdf.document()
```

The lower-level namespaces are still available:

```cpp
rixlib::auth
rixlib::csv
rixlib::debug
rixlib::pdf
```

Use lower-level APIs when you need advanced control, direct package usage, custom integrations, or implementation-level access.

For normal documentation and application examples, prefer:

```cpp
#include <rix.hpp>
```

and:

```cpp
rix.<package>
```

## Feature macros

By default, including `rix.hpp` enables the available facade modules.

```cpp
#include <rix.hpp>
```

For lighter builds, define only the modules you want before including `rix.hpp`.

Auth only:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

Auth and Debug:

```cpp
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

CSV only:

```cpp
#define RIX_ENABLE_CSV
#include <rix.hpp>
```

PDF only:

```cpp
#define RIX_ENABLE_PDF
#include <rix.hpp>
```

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

## When to use the facade

Use the facade when:

- you want the public Rix style
- you want one clean include
- you want one object-style API
- you are writing application code
- you are following the Rix documentation
- your project uses several Rix packages together

Example:

```cpp
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  rix.debug.print("auth ready");

  return 0;
}
```

## When to use an independent package

Use an independent package when:

- you only need one package
- you do not want the full facade
- you are writing lower-level integration code
- you want direct package-level control
- your library should depend on a smaller package

Example:

```cpp
#include <rix/auth.hpp>
```

The facade remains the recommended path for public examples.

## What you should remember

Use the facade with:

```cpp
#include <rix.hpp>
```

Install it with:

```bash
vix add rix/rix
vix install
```

Declare it in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

Use packages through:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

Use `rixlib::...` only when you need lower-level or advanced access.

## Next step

Learn how to enable only selected facade modules.

Next: [Feature Macros](./feature-macros)
