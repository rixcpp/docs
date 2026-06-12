# Use the Rix Facade

The Rix facade is the public entry point for using Rix packages from one clean API.

Instead of including each package separately, you can include:

```cpp
#include <rix.hpp>
```

Then use the global `rix` object:

```cpp
rix.auth
rix.debug
```

The facade is the recommended public style for this documentation.

## Basic usage

Create a small file:

```bash
mkdir -p ~/rix-facade-example
cd ~/rix-facade-example
touch main.cpp
```

Add this code:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");

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

Run it:

```bash
vix run main.cpp
```

If Rix is not available yet, install the facade package:

```bash
vix install -g rix/rix
```

Then run again:

```bash
vix run main.cpp
```

## Facade model

The facade groups selected Rix packages under one object:

```cpp
rix.auth
rix.debug
```

This keeps application code simple.

For example, Auth is available through:

```cpp
rix.auth.memory()
rix.auth.password.hash(...)
rix.auth.config.production()
rix.auth.error.to_string(...)
```

Debug helpers are available through:

```cpp
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.log(...)
rix.debug.format(...)
```

## Why use the facade

The facade gives a stable, readable API for application code.

Instead of writing lower-level package setup first, public examples can start with:

```cpp
auto auth = rix.auth.memory();
```

That is easier to read than manually creating stores and wiring the lower-level auth service.

The lower-level API still exists for advanced usage, but the facade is the recommended starting point.

## Install the facade in a project

For a real Vix project, add the facade package:

```bash
vix add rix/rix
vix install
```

Then add it to `vix.app`:

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

resources = [
  ".env=.env",
]
```

Then build and run:

```bash
vix build
vix run
```

## Feature macros

By default, including `rix.hpp` enables the available facade modules.

```cpp
#include <rix.hpp>
```

For smaller builds, define only the modules you want before including `rix.hpp`.

For Auth only:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  return 0;
}
```

For Auth and Debug:

```cpp
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.print("Auth enabled");
  auto auth = rix.auth.memory();

  return 0;
}
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

## Public API and lower-level API

Public documentation should prefer:

```cpp
#include <rix.hpp>

auto auth = rix.auth.memory();
```

The lower-level namespace is still available:

```cpp
rixlib::auth
```

Use lower-level APIs when you need advanced integration, custom stores, independent package usage, or implementation-level control.

For normal application code, prefer:

```cpp
rix.auth
```

## Auth through the facade

Create memory auth:

```cpp
auto auth = rix.auth.memory();
```

Register a user:

```cpp
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

Login:

```cpp
auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

Authenticate a session:

```cpp
auto session = auth.authenticate_session(
    login.value().session.id());
```

Logout:

```cpp
auto status = auth.logout(
    login.value().session.id());
```

## Password helpers through the facade

Hash a password:

```cpp
auto hashed = rix.auth.password.hash("correct-password");
```

Verify a password:

```cpp
const bool valid = rix.auth.password.verify(
    "correct-password",
    hashed.value());
```

Check a wrong password:

```cpp
const bool invalid = rix.auth.password.verify(
    "wrong-password",
    hashed.value());
```

## Configuration through the facade

Use development configuration:

```cpp
auto config = rix.auth.config.development();

auto auth = rix.auth.memory(config);
```

Use production configuration:

```cpp
auto config = rix.auth.config.production();

config.set_min_password_length(12);
config.set_issuer("my-app");

auto auth = rix.auth.memory(config);
```

For durable applications, production configuration is usually used with database auth:

```cpp
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

## Error helpers through the facade

Rix Auth uses explicit result values.

When an operation fails, use the facade error helper:

```cpp
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

Use:

```cpp
rix.auth.error.to_string(error)
```

for stable error names.

Use:

```cpp
error.message()
```

for human-readable diagnostics.

## Store helpers through the facade

Most applications should use:

```cpp
auto auth = rix.auth.memory();
```

or:

```cpp
auto auth = rix.auth.database(db);
```

For custom managed stores, use:

```cpp
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto auth = rix.auth.managed(
    std::move(users),
    std::move(sessions));
```

The managed API owns the stores inside the returned auth service.

Use it when you need custom store creation but still want safe ownership.

## Advanced caller-owned stores

The facade also exposes an advanced `create` API:

```cpp
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto auth = rix.auth.create(
    *users,
    *sessions);
```

In this case, the caller owns the stores.

The stores must stay alive for as long as `auth` is used.

For public application code, prefer:

```cpp
auto auth = rix.auth.memory();
```

or:

```cpp
auto auth = rix.auth.database(db);
```

or:

```cpp
auto auth = rix.auth.managed(
    rix.auth.stores.memory_users(),
    rix.auth.stores.memory_sessions());
```

## Facade vs independent packages

Use the facade when you want one clean public API:

```cpp
#include <rix.hpp>

auto auth = rix.auth.memory();
```

Use an independent package when you only want one package and prefer direct package-level usage:

```cpp
#include <rix/auth.hpp>
```

The recommended path for these docs is:

```cpp
#include <rix.hpp>
```

and:

```cpp
rix.auth
```

## What you should remember

Use the Rix facade with:

```cpp
#include <rix.hpp>
```

Use mounted packages through:

```cpp
rix.auth
rix.debug
```

Install the facade in a project with:

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

Use feature macros before including `rix.hpp` when you want a smaller facade.

## Next step

Continue with the Auth package.

Next: [Auth Overview](/packages/auth/)
