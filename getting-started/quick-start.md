# Quick Start

This page shows the fastest ways to try Rix Auth with Vix.cpp.

You can use Rix in two ways:

```txt
1. Run a single C++ file with vix run
2. Use Rix inside a Vix project with vix.app
```

Use the single-file workflow when you want to test Rix quickly.

Use the project workflow when you want a real application, library, tests, dependencies, and a reproducible build.

## Option 1: Run a single file

Create a small working folder:

```bash
mkdir -p ~/rix-auth-quick-start
cd ~/rix-auth-quick-start
```

Create a file:

```bash
touch auth.cpp
```

Add this code:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("== Rix Auth quick start ==");

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

  rix.debug.print("registered user");
  rix.debug.print("id:", registered.value().id());
  rix.debug.print("email:", registered.value().email());

  auto login = auth.login({"ada@example.com","correct-password"});

  if (login.failed())
  {
    const auto &error = login.error();
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message()
    );

    return 1;
  }

  rix.debug.print("----------------------------------------");
  rix.debug.print("login successful");
  rix.debug.print("user:", login.value().user.email());
  rix.debug.print("session:", login.value().session.id());
  rix.debug.print("token issuer:", login.value().token.issuer());

  auto session = auth.authenticate_session(login.value().session.id());

  if (session.failed())
  {
    const auto &error = session.error();
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message()
    );

    return 1;
  }

  rix.debug.print("----------------------------------------");
  rix.debug.print("OK:", "session authenticated");
  rix.debug.print("session user id:", session.value().user_id());

  return 0;
}
```

Run the file:

```bash
vix run auth.cpp
```

If Rix is already available in your Vix setup, this is enough.

## Install Rix for single-file usage

If the header is not found, install the Rix facade globally:

```bash
vix install -g rix/rix
```

Then run again:

```bash
vix run auth.cpp
```

Global installation is useful for quick local experiments.

For real projects, prefer project dependencies with `vix add` and `vix install`.

## Expected output

The output should look like this:

```txt
== Rix Auth quick start ==
registered user
id: user_...
email: ada@example.com
----------------------------------------
login successful
user: ada@example.com
session: session_...
token issuer: rix/auth
----------------------------------------
OK: session authenticated
session user id: user_...
```

The exact user id and session id will be different each time.

Rix Auth generates secure random ids.

## Option 2: Use a Vix project

Create a Vix application:

```bash
vix new hello-rix --app
cd hello-rix
```

If the project has `.env.example`, create your local `.env` file:

```bash
cp .env.example .env
```

Add Rix:

```bash
vix add rix/rix
vix install
```

Open:

```txt
vix.app
```

Add Rix to the `deps` array:

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

The important part is:

```txt
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

Do not put Rix packages in `packages`.

## Add the code

Open:

```txt
src/main.cpp
```

Use the same code from the single-file example.

Then build:

```bash
vix build
```

Run:

```bash
vix run
```

## Option 3: Use Rix inside a library

Rix can also be used inside a reusable C++ library.

Create a library:

```bash
vix new mylib --lib
cd mylib
```

Add Rix:

```bash
vix add rix/rix
vix install
```

If the library has a `vix.app` target for an example, demo, or test executable, declare Rix in `deps`:

```txt
deps = [
  "rix/rix",
]
```

Then include the facade:

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

Use this only when your library intentionally depends on the Rix facade.

If your library needs only one Rix package, prefer the independent package.

For Auth only:

```txt
deps = [
  "rix/auth",
]
```

## What the code does

The example includes the unified Rix facade:

```cpp
#include <rix.hpp>
```

Then it creates a memory-backed authentication service:

```cpp
auto auth = rix.auth.memory();
```

Memory auth is useful for examples, tests, and local development.

It stores users and sessions in memory.

Data is lost when the process exits.

## Register a user

This creates a user:

```cpp
auto registered = auth.register_user({"ada@example.com","correct-password"});
```

Registration validates the email, checks the password policy, hashes the password, creates a user id, and stores the user.

Always check the result:

```cpp
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
```

## Login

This authenticates the user:

```cpp
auto login = auth.login({"ada@example.com","correct-password"});
```

A successful login returns:

```cpp
login.value().user
login.value().session
login.value().token
```

The user contains the authenticated identity.

The session represents server-side login state.

The token is a short-lived value attached to the user.

## Authenticate the session

After login, the session can be checked:

```cpp
auto session = auth.authenticate_session(login.value().session.id());
```

A usable session must be:

```txt
valid
not revoked
not expired
```

If the session is valid, the application can trust the attached user id:

```cpp
session.value().user_id()
```

## Error handling

Rix Auth uses explicit results.

Operations that return values use result objects:

```cpp
auto result = auth.login(...);

if (result.failed())
{
  const auto &error = result.error();
}
```

Operations that only return success or failure use status objects:

```cpp
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
}
```

Use:

```cpp
rix.auth.error.to_string(error)
```

to convert an auth error to a stable string.

Use:

```cpp
error.message()
```

for a human-readable diagnostic message.

## Try a failed login

Change the login password:

```cpp
auto login = auth.login({"ada@example.com","wrong-password"});
```

Run the file again:

```bash
vix run auth.cpp
```

Or, inside a project:

```bash
vix run
```

The login should fail with an authentication error.

This is normal.

Invalid credentials are returned as explicit errors.

## Use database auth later

The quick start uses memory auth:

```cpp
auto auth = rix.auth.memory();
```

For a real application, use database-backed auth:

```cpp
auto db = vix::db::Database::sqlite("storage/app.db");

auto auth = rix.auth.database(db);
```

Memory auth is for temporary storage.

Database auth is for durable users and sessions.

## What you should remember

For the fastest experiment, create a file and run it:

```bash
mkdir -p ~/rix-auth-quick-start
cd ~/rix-auth-quick-start
touch auth.cpp
vix run auth.cpp
```

If Rix is not available yet, install it globally:

```bash
vix install -g rix/rix
```

For a real project, add Rix locally:

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

Use the public facade:

```cpp
#include <rix.hpp>
```

Create memory auth:

```cpp
auto auth = rix.auth.memory();
```

Register and login:

```cpp
auth.register_user(...);
auth.login(...);
```

Always check results before using values.

## Next step

Learn how to use the Rix facade clearly.

Next: [Use the Rix Facade](./use-the-facade)
