# Installation

This page shows how to install Rix in a Vix.cpp project.

Rix is installed through the Vix Registry and declared in your project manifest.

You do not install Rix with a separate Rix CLI.

You use the normal Vix workflow:

```bash
vix registry sync
vix add rix/rix
vix install
```

Then you declare the dependency in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

## Requirements

Before using Rix, make sure you have a Vix.cpp project.

A simple application project can be created with:

```bash
vix new hello --app
cd hello
```

A reusable library project can be created with:

```bash
vix new mylib --lib
cd mylib
```

Rix can be used in both.

Use it in an application when you want to build a runnable program.

Use it in a library when your reusable C++ package depends on Rix APIs.

## Install the unified Rix facade

For normal public usage, install the unified facade package:

```bash
vix registry sync
vix add rix/rix
vix install
```

This gives your project the main Rix header:

```cpp
#include <rix.hpp>
```

and the public facade object:

```cpp
rix
```

Example:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  auto auth = rix.auth.memory();

  return 0;
}
```

## Add Rix to `vix.app`

If your project uses `vix.app`, add Rix to the `deps` array.

```txt
deps = [
  "rix/rix",
]
```

A minimal application manifest can look like this:

```txt
name = "hello"
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

The important part is:

```txt
deps = [
  "rix/rix",
]
```

`deps` is for packages installed from the Vix Registry.

`packages` is for CMake packages resolved with `find_package`.

`links` is for CMake targets linked into the application.

## Application project example

For an application created with:

```bash
vix new hello --app
```

add Rix to `vix.app`:

```txt
name = "hello"
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

resources = [
  ".env=.env",
]
```

Then install dependencies:

```bash
vix install
```

Build:

```bash
vix build
```

Run:

```bash
vix run
```

## Library project example

Rix can also be used inside a reusable C++ library.

For a library created with:

```bash
vix new mylib --lib
```

add the dependency to the project metadata with:

```bash
vix add rix/rix
vix install
```

If the library uses a `vix.app` manifest for examples or small targets, declare Rix in `deps`:

```txt
deps = [
  "rix/rix",
]
```

Then include Rix from your library or examples:

```cpp
#include <rix.hpp>
```

Example:

```cpp
#include <rix.hpp>

namespace mylib
{
  inline void hello()
  {
    rix.debug.print("Hello from mylib");
  }
}
```

Use this when your library intentionally depends on the Rix facade.

If your library only needs one package, prefer the independent package dependency instead.

For example, for Auth only:

```txt
deps = [
  "rix/auth",
]
```

## Installing only Auth

This documentation starts with Auth.

If your project only needs Auth and does not need the full facade package, you can install:

```bash
vix add rix/auth
vix install
```

Then declare it in `vix.app`:

```txt
deps = [
  "rix/auth",
]
```

However, the public documentation examples use the unified facade:

```cpp
#include <rix.hpp>
```

and:

```cpp
rix.auth
```

So for following these docs, prefer:

```txt
deps = [
  "rix/rix",
]
```

## Multiple Rix packages

A project can depend on the facade and independent packages if needed.

Example:

```txt
deps = [
  "rix/rix",
  "rix/auth",
  "rix/debug",
]
```

Use this only when the project really needs those packages directly.

For most public examples, start with:

```txt
deps = [
  "rix/rix",
]
```

## Verify the installation

Create or edit `src/main.cpp`:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Rix is installed");

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

Build and run:

```bash
vix build
vix run
```

Expected output shape:

```txt
Rix is installed
registered: ada@example.com
```

## Dependency fields

Use the correct field for each kind of dependency.

| Field      | Purpose               | Example      |
| ---------- | --------------------- | ------------ |
| `deps`     | Vix Registry packages | `"rix/rix"`  |
| `packages` | CMake packages        | `"vix"`      |
| `links`    | CMake targets         | `"vix::vix"` |
| `modules`  | Internal app modules  | `"auth"`     |

For Rix packages, use:

```txt
deps = [
  "rix/rix",
]
```

Do not put Rix Registry packages in `packages`.

## Common mistakes

### Forgetting `deps`

If you include:

```cpp
#include <rix.hpp>
```

but your `vix.app` does not contain:

```txt
deps = [
  "rix/rix",
]
```

the project may fail to build because the generated build does not know that the project depends on Rix.

### Confusing `deps` and `packages`

Wrong:

```txt
packages = [
  "rix/rix",
]
```

Correct:

```txt
deps = [
  "rix/rix",
]
```

`deps` is for registry packages.

`packages` is for CMake packages.

### Forgetting `vix install`

After adding a dependency, run:

```bash
vix install
```

This installs the dependency state used by the build.

### Using the facade without the facade package

If your code uses:

```cpp
#include <rix.hpp>
```

install and declare:

```txt
deps = [
  "rix/rix",
]
```

If your project installs only:

```txt
deps = [
  "rix/auth",
]
```

then it should use the independent package API instead of assuming the unified facade is available.

## What you should remember

Install Rix with Vix:

```bash
vix add rix/rix
vix install
```

Declare Rix in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

Use the public facade:

```cpp
#include <rix.hpp>
```

Use Auth through:

```cpp
rix.auth
```

Build and run with Vix:

```bash
vix build
vix run
```

## Next step

Create your first Rix example.

Next: [Quick Start](./quick-start)
