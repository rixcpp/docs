# What is Rix?

Rix is the unified userland library layer for Vix.cpp applications.

It gives Vix C++ projects optional packages and one clean facade object:

```cpp id="lw2dy7"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  auto auth = rix.auth.memory();

  return 0;
}
```

Rix is not a runtime.

Rix is not a CLI.

Rix is not a package manager.

Rix does not replace Vix.cpp.

Vix.cpp provides the runtime, command-line workflow, build system integration, registry workflow, and core modules.

Rix provides optional application-level libraries that sit on top of Vix.cpp.

```txt id="0f5evl"
Vix.cpp
  runtime
  CLI
  build workflow
  registry integration
  core modules

Rix
  userland packages
  application helpers
  unified rix.* facade
```

## Why Rix exists

Vix.cpp gives C++ applications a modern workflow.

It helps developers create, build, run, test, format, package, and publish C++ projects with a consistent command surface.

But real applications often need higher-level libraries.

For example, an application may need:

- authentication
- CSV parsing
- debugging helpers
- PDF generation
- configuration helpers
- table utilities
- future application packages

These are useful application-level tools, but they should not all live inside the Vix.cpp core runtime.

Rix exists to keep that separation clean.

```txt id="h6wkok"
If it is a core primitive, it belongs in Vix.cpp.
If it is an application helper, it belongs in Rix.
```

## The basic idea

Rix packages can be used through one public facade:

```cpp id="3gxuon"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");

  return 0;
}
```

The global `rix` object groups the mounted Rix packages:

```cpp id="pstbge"
rix.auth
rix.debug
```

In this documentation, the public examples use the unified facade.

That means examples should prefer:

```cpp id="h28pqj"
rix.auth.memory()
```

instead of starting with lower-level package internals.

The lower-level `rixlib::...` namespaces are still available for advanced usage, independent package usage, and implementation-level code.

## Rix and Vix.cpp

Rix depends on the Vix.cpp workflow.

You still use Vix commands to manage the project:

```bash id="3ug8or"
vix add @rix/rix
vix install
vix build
vix run
vix tests
```

Rix only gives you the C++ library APIs.

Vix.cpp still handles the project lifecycle.

```txt id="x21e0d"
You install Rix with Vix.
You build Rix projects with Vix.
You run Rix examples with Vix.
You test Rix packages with Vix.
```

## Rix packages

A Rix package follows a stable model:

```txt id="d2h1lf"
Package  : @rix/name
Header   : <rix/name.hpp>
Namespace: rixlib::name
Facade   : rix.name
```

Example for Auth:

```txt id="u5gh78"
Package  : @rix/auth
Header   : <rix/auth.hpp>
Namespace: rixlib::auth
Facade   : rix.auth
```

When using the unified facade, include:

```cpp id="ejzg11"
#include <rix.hpp>
```

Then use:

```cpp id="8om7j6"
rix.auth
```

## The unified facade

The unified facade is the easiest way to use Rix.

Install:

```bash id="r3utjx"
vix add @rix/rix
vix install
```

Use:

```cpp id="x0qb8z"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  return 0;
}
```

The facade is useful when an application wants one clean object-style API.

It keeps public examples simple and consistent.

## Independent packages

Rix packages can also be used independently.

This is useful when an application only needs one package and does not want the full facade.

Example model:

```bash id="d97wkt"
vix add @rix/auth
vix install
```

Then the package can expose its own lower-level API.

However, this documentation starts with the unified facade because it is the recommended public path for Rix users.

## Current focus

This documentation currently starts with `rix/auth`.

Rix Auth provides authentication helpers for Vix.cpp applications:

- user registration
- login
- password hashing
- server-side sessions
- short-lived tokens
- logout
- session validation
- explicit errors

Example:

```cpp id="3m2rii"
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

## What Rix is not

Rix is not a replacement for Vix.cpp.

Rix is not a second standard library.

Rix is not a framework that owns your whole application.

Rix is not a new build system.

Rix is not a new language layer over C++.

Rix is a set of focused C++ packages for applications built with Vix.cpp.

## How to think about Rix

A useful way to understand Rix is:

```txt id="j8ymhi"
C++      -> language and native execution
Vix.cpp  -> runtime, CLI, build workflow, registry, core modules
Rix      -> optional userland libraries for application problems
```

For example:

```txt id="3rrr67"
Need to build and run the project? Use Vix.cpp.
Need to add an authentication library? Use Rix Auth.
Need one clean API for installed Rix packages? Use the Rix facade.
```

## What you should remember

Rix is the userland library layer for Vix.cpp applications.

Use the unified facade in public code:

```cpp id="k2xawz"
#include <rix.hpp>
```

Use mounted modules through:

```cpp id="52ay99"
rix.auth
rix.debug
```

Use Vix commands for the workflow:

```bash id="xjwj6t"
vix add @rix/rix
vix install
vix build
vix run
```

Rix adds application-level libraries on top of Vix.cpp.

It does not replace Vix.cpp.

## Next step

Install Rix in a Vix.cpp project.

Next: [Installation](./installation)
