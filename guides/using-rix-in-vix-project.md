# Using Rix in a Vix Project

This guide shows how to use Rix packages inside a Vix.cpp project.

Rix packages are installed through the Vix Registry and added to the `deps` section of `vix.app`.

Use this guide when you already have a Vix application or when you want to create one with `vix new`.

## The short version

Create a Vix app:

```bash id="g7v2ka"
vix new my-app --app
cd my-app
```

Add Rix:

```bash id="n9q5vx"
vix add rix/rix
vix install
```

Use Rix in code:

```cpp id="d2v8rc"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

Make sure `vix.app` contains:

```txt id="b5x9ma"
deps = [
  "rix/rix",
]
```

## What this guide covers

This guide explains:

```txt id="r4q8md"
how to add Rix to a Vix project
where Rix packages go in vix.app
how to use the unified facade
how to use independent packages
how to use Rix from an app template
how to use Rix from a simple file
common mistakes
```

## Create a new Vix app

Use:

```bash id="y7m2ka"
vix new rix-app --app
cd rix-app
```

This creates a Vix application project.

A Vix application has a manifest file:

```txt id="f7q3ma"
vix.app
```

The manifest describes sources, include directories, dependencies, packages, links, and resources.

## Add the unified Rix facade

For most applications, add the unified facade package:

```bash id="n9x2qc"
vix add rix/rix
vix install
```

This gives access to:

```cpp id="c5v8na"
#include <rix.hpp>
```

and:

```cpp id="m6q4rd"
rix.auth
rix.csv
rix.debug
rix.pdf
```

## Add Rix to `vix.app`

Rix packages are Vix Registry dependencies.

They belong in `deps`:

```txt id="v2k8xm"
deps = [
  "rix/rix",
]
```

Do not put Rix packages in `packages`.

Wrong:

```txt id="q9c5rd"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="k8m4xa"
deps = [
  "rix/rix",
]
```

`deps` is for packages installed by Vix.

`packages` is for CMake package discovery.

## Minimal `vix.app`

A minimal app using Rix can look like this:

```txt id="h5n7vc"
name = "rix-app"
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

defines = [
  "VIX_BACKEND_APP=1",
  "VIX_APP_NAME=rix-app",
]

compile_options = [
  "$<$<CXX_COMPILER_ID:MSVC>:/W4>",
  "$<$<CXX_COMPILER_ID:MSVC>:/permissive->",
  "$<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall>",
  "$<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wextra>",
  "$<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wpedantic>",
]

link_options = [
]

compile_features = [
  "cxx_std_20",
]

packages = [
  "vix",
]

links = [
  "vix::vix",
]

resources = [
]
```

The important Rix part is:

```txt id="x9q2va"
deps = [
  "rix/rix",
]
```

## Basic app code

Put this in:

```txt id="d6m8qc"
src/main.cpp
```

```cpp id="z4x7mq"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix inside a Vix project");

  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

Build and run:

```bash id="y8m3ka"
vix build
vix run
```

## Use Rix inside a Vix backend app

A Vix backend app can use both Vix and Rix.

Example:

```cpp id="s5v9qa"
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  app.get("/", [](vix::Request &, vix::Response &res) {
    res.text("Hello from Vix.cpp and Rix");
  });

  app.run();

  return 0;
}
```

In this model:

```txt id="p7n4xm"
Vix.cpp owns the app runtime
Rix provides optional libraries
```

## Use `rix.pdf` inside a Vix route

```cpp id="w3q8kc"
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  app.get("/report.pdf", [](vix::Request &, vix::Response &res) {
    auto doc = rix.pdf.document();

    auto &page = doc.add_page();

    page.text(
        page.x_left(),
        page.y_top(),
        "Hello from rix.pdf");

    auto bytes = rix.pdf.write(doc);

    if (bytes.failed())
    {
      res.status(500).json({
          "ok", false,
          "error", rix.pdf.error.to_string(bytes.error()),
          "message", bytes.error().message()});

      return;
    }

    res.header("Content-Type", "application/pdf");
    res.header("Content-Disposition", "inline; filename=\"report.pdf\"");
    res.send(bytes.value());
  });

  app.run();

  return 0;
}
```

Use `rix.pdf.write` in routes when the PDF should be sent as HTTP response bytes.

Use `rix.pdf.save` when the PDF should be written to disk.

## Use `rix.auth` inside a Vix route

```cpp id="r6x2vd"
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  auto auth = rix.auth.memory();

  app.post("/register", [&](vix::Request &, vix::Response &res) {
    auto registered = auth.register_user({
        "ada@example.com",
        "correct-password"});

    if (registered.failed())
    {
      res.status(400).json({
          "ok", false,
          "error", rix.auth.error.to_string(registered.error()),
          "message", registered.error().message()});

      return;
    }

    res.json({
        "ok", true,
        "email", registered.value().email()});
  });

  app.run();

  return 0;
}
```

Use memory auth for examples, tests, and local development.

Use database-backed stores for durable applications.

## Use `rix.csv` in a Vix project

```cpp id="a8k5qx"
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

For real Vix application logs, prefer the Vix logging system.

For examples and small tools, `rix.debug.print` is fine.

## Use `rix.debug` in a Vix project

```cpp id="f2v7mc"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");

  const auto message = rix.debug.format(
      "Package: {}",
      "rix/rix");

  rix.debug.print(message);

  rix.debug.inspect(message);

  return 0;
}
```

`rix.debug` is for examples, formatting, printing, and inspection.

For production application logs, prefer Vix logging.

## Use independent packages

You do not always need the unified facade.

If the project only needs PDF, install only:

```bash id="c9m4vx"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="m8q2za"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="n5v8qc"
#include <rix/pdf.hpp>
```

Example:

```cpp id="q7x4ma"
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

## Facade vs independent package

Facade usage:

```txt id="h6q9vx"
Package  -> rix/rix
Header   -> <rix.hpp>
Access   -> rix.*
```

Independent usage:

```txt id="v8n3qb"
Package  -> rix/name
Header   -> <rix/name.hpp>
Access   -> rixlib::name::module()
```

Use the facade for normal apps.

Use independent packages when the project only needs one package.

## Use feature macros

The facade can be limited with feature macros.

Example:

```cpp id="k4m9xd"
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  rix.debug.print("PDF module loaded");

  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

Available macros include:

```txt id="x3m7qa"
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

## Default facade behavior

If no feature macro is defined, all currently mounted modules are enabled.

This means:

```cpp id="n9q5vx"
#include <rix.hpp>
```

gives access to:

```cpp id="d2v8rc"
rix.auth
rix.csv
rix.debug
rix.pdf
```

This keeps simple examples short.

## Add several independent packages

If you do not want `rix/rix`, you can add several independent packages manually:

```bash id="b5x9ma"
vix add rix/csv
vix add rix/debug
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="r4q8md"
deps = [
  "rix/csv",
  "rix/debug",
  "rix/pdf",
]
```

Then include package headers directly:

```cpp id="y7m2ka"
#include <rix/csv.hpp>
#include <rix/debug.hpp>
#include <rix/pdf.hpp>
```

For most applications, prefer `rix/rix` when using several packages.

## Use Rix from a simple file

You can also use Rix from a single file.

Create a folder:

```bash id="f7q3ma"
mkdir -p ~/rix-single-file
cd ~/rix-single-file
touch main.cpp
```

Add:

```cpp id="n9x2qc"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from a single file");
  return 0;
}
```

Run:

```bash id="c5v8na"
vix run main.cpp
```

If Rix is not available globally:

```bash id="m6q4rd"
vix install -g rix/rix
vix run main.cpp
```

## Single file with independent package

For PDF only:

```bash id="v2k8xm"
mkdir -p ~/rix-single-pdf
cd ~/rix-single-pdf
touch pdf.cpp
```

Add:

```cpp id="q9c5rd"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix/pdf");

  auto saved = pdf.save(doc, "single.pdf");

  return saved.ok() ? 0 : 1;
}
```

Run:

```bash id="k8m4xa"
vix run pdf.cpp
```

If needed:

```bash id="h5n7vc"
vix install -g rix/pdf
vix run pdf.cpp
```

## App template workflow

If you create an app with:

```bash id="x9q2va"
vix new my-app --app
```

then add Rix with:

```bash id="d6m8qc"
vix add rix/rix
vix install
```

The app should keep Rix in:

```txt id="z4x7mq"
deps = [
  "rix/rix",
]
```

Then use:

```cpp id="y8m3ka"
#include <rix.hpp>
```

inside `src/main.cpp` or any other source file included by the app.

## Library project workflow

If you are building a C++ library and only need one Rix package, use the independent package.

Example:

```bash id="s5v9qa"
vix add rix/pdf
vix install
```

In `vix.app` or the project manifest:

```txt id="p7n4xm"
deps = [
  "rix/pdf",
]
```

Then:

```cpp id="w3q8kc"
#include <rix/pdf.hpp>
```

Use this when the library should not depend on the full facade.

## Build and run

After changing dependencies, run:

```bash id="r6x2vd"
vix install
vix build
vix run
```

If you only changed source code:

```bash id="a8k5qx"
vix build
vix run
```

Use Vix commands for Vix projects.

## Tests

If your project has tests, use:

```bash id="f2v7mc"
vix tests
```

Keep Rix dependencies in `deps` so tests and application builds resolve them consistently.

## Updating Rix packages

To update dependencies, use the Vix workflow:

```bash id="c9m4vx"
vix install
```

If your registry index needs refresh:

```bash id="m8q2za"
vix registry sync
vix install
```

Use this when a package was recently released or the local registry data is stale.

## Removing a Rix package

Use:

```bash id="n5v8qc"
vix remove rix/pdf
vix install
```

Then remove it from your source code includes and usage.

If you remove `rix/rix`, replace:

```cpp id="q7x4ma"
#include <rix.hpp>
```

with the independent headers you still need.

## Common project layout

A small Vix project with Rix can look like this:

```txt id="h6q9vx"
my-app/
  vix.app
  src/
    main.cpp
  include/
  public/
  views/
  storage/
```

`vix.app` owns the build inputs.

`deps` owns Vix Registry dependencies.

Source files include Rix headers.

## Common mistakes

### Putting Rix in `packages`

Wrong:

```txt id="v8n3qb"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="k4m9xd"
deps = [
  "rix/rix",
]
```

### Forgetting `vix install`

After adding a package, run:

```bash id="x3m7qa"
vix install
```

Without it, generated dependency files may not be updated.

### Installing `rix/pdf` but including `<rix.hpp>`

If your code uses:

```cpp id="n9q5vx"
#include <rix.hpp>
```

then use:

```bash id="d2v8rc"
vix add rix/rix
vix install
```

If your code uses:

```cpp id="b5x9ma"
#include <rix/pdf.hpp>
```

then use:

```bash id="r4q8md"
vix add rix/pdf
vix install
```

### Mixing facade and independent styles

Avoid this without a reason:

```cpp id="y7m2ka"
#include <rix.hpp>
#include <rix/pdf.hpp>
```

Prefer one style per file.

Facade:

```cpp id="f7q3ma"
#include <rix.hpp>
```

Independent:

```cpp id="n9x2qc"
#include <rix/pdf.hpp>
```

### Expecting Rix to replace Vix.cpp

Rix does not replace Vix.cpp.

Vix.cpp still owns:

```txt id="c5v8na"
project creation
build workflow
run workflow
runtime
HTTP and WebSocket layer
services
deployment workflow
registry commands
```

Rix provides optional libraries.

### Using `rix.debug` as production logging

`rix.debug` is useful for examples and small tools.

For real Vix application logs, prefer the Vix logging system.

### Calling `value()` before checking results

Many Rix APIs return explicit results.

Wrong:

```cpp id="m6q4rd"
auto bytes = rix.pdf.write(doc);

res.send(bytes.value());
```

Correct:

```cpp id="v2k8xm"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  return;
}

res.send(bytes.value());
```

## What you should remember

For most Vix applications, use:

```bash id="q9c5rd"
vix add rix/rix
vix install
```

Then:

```cpp id="k8m4xa"
#include <rix.hpp>
```

and:

```cpp id="h5n7vc"
rix.auth
rix.csv
rix.debug
rix.pdf
```

In `vix.app`, use:

```txt id="x9q2va"
deps = [
  "rix/rix",
]
```

For independent package usage, use:

```bash id="d6m8qc"
vix add rix/pdf
vix install
```

Then:

```cpp id="z4x7mq"
#include <rix/pdf.hpp>
```

and:

```txt id="y8m3ka"
deps = [
  "rix/pdf",
]
```

Vix.cpp owns the project and runtime.

Rix provides optional userland packages.

## Next step

Continue with configuration.

Next: [Configuration](../getting-started/installation)
