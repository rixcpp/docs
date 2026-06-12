# Getting Started

Welcome to Rix.

Rix is the unified userland library layer for Vix.cpp applications.

It gives Vix C++ projects optional packages and one clean facade API:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  auto auth = rix.auth.memory();

  return 0;
}
```

Rix does not replace Vix.cpp.

Vix.cpp provides the runtime, CLI, build workflow, registry integration, and core foundations.

Rix provides application-level packages built on top of Vix.cpp.

```txt
Vix.cpp -> runtime, CLI, build workflow, registry, core modules
Rix    -> optional userland packages and unified facade
```

## What you will learn

This getting started section shows how to:

- understand what Rix is
- install Rix in a Vix.cpp project
- use the unified `rix` facade
- run a first Rix example
- understand when to use the facade or an independent package

## The basic idea

Install the Rix facade package:

```bash
vix add @rix/rix
vix install
```

Include the main header:

```cpp
#include <rix.hpp>
```

Use the mounted package APIs through the global `rix` object:

```cpp
rix.debug.print("Hello", "Rix");
auto auth = rix.auth.memory();
```

## Current focus

This documentation starts with `rix/auth`.

`rix/auth` provides authentication helpers for Vix.cpp applications:

- user registration
- login
- password hashing
- sessions
- tokens
- logout
- explicit error handling

Example:

```cpp
#include <rix.hpp>

int main()
{
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

## Recommended path

Read these pages in order:

1. [What is Rix?](./what-is-rix)
2. [Installation](./installation)
3. [Quick Start](./quick-start)
4. [Use the Rix Facade](./use-the-facade)

Then continue with:

- [Auth Overview](/packages/auth/)
- [Auth Quick Start](/packages/auth/quick-start)
- [Register and Login](/packages/auth/register-login)

## What you should remember

Rix is used from normal C++ code.

```cpp
#include <rix.hpp>
```

The public API should prefer the facade:

```cpp
rix.auth
```

The lower-level `rixlib::...` namespaces are available for advanced usage, independent package usage, and implementation details.

Use Vix.cpp commands to work with the project:

```bash
vix add @rix/rix
vix install
vix build
vix run
vix tests
```

## Next step

Learn what Rix is and how it relates to Vix.cpp.

Next: [What is Rix?](./what-is-rix)
