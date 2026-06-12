# Auth Quick Start

This page shows the shortest practical example for `rix/auth`.

The example uses the public Rix facade:

```cpp
#include <rix.hpp>
```

and the Auth API through:

```cpp
rix.auth
```

You will:

1. create a memory auth service
2. register a user
3. login
4. authenticate the session
5. handle errors explicitly

## Run as a single file

For the fastest test, create a small working folder:

```bash
mkdir -p ~/rix-auth-quick-start
cd ~/rix-auth-quick-start
```

Create the file:

```bash
touch auth.cpp
```

Add this code:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth quick start ==");

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

  auto login = auth.login({"ada@example.com", "correct-password"});

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

Run it:

```bash
vix run auth.cpp
```

If Rix is not available yet for single-file usage, install the facade globally:

```bash
vix install -g rix/rix
```

Then run again:

```bash
vix run auth.cpp
```

## Expected output

The output should look like this:

```txt
== rix/auth quick start ==
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

The exact user id and session id will be different.

Rix Auth generates secure ids for users, sessions, and tokens.

## Use inside a Vix project

Create an application:

```bash
vix new hello-auth --app
cd hello-auth
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

Add the facade dependency:

```txt
deps = [
  "rix/rix",
]
```

A small application manifest can look like this:

```txt
name = "hello-auth"
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

Put the example code in:

```txt
src/main.cpp
```

Build and run:

```bash
vix build
vix run
```

## Create the auth service

The quick start uses memory auth:

```cpp
auto auth = rix.auth.memory();
```

This creates an authentication service with memory-backed user and session stores.

Use memory auth for:

- examples
- tests
- local experiments
- temporary tools

Memory auth does not persist data.

When the process exits, users and sessions are lost.

## Register a user

Registration uses an email and a plain-text password:

```cpp
auto registered = auth.register_user({"ada@example.com","correct-password"});
```

A successful registration returns a user:

```cpp
registered.value().id()
registered.value().email()
registered.value().email_verified()
registered.value().active()
```

Always check the result before using `.value()`:

```cpp
if (registered.failed())
{
  const auto &error = registered.error();
  return 1;
}
```

## Login

Login uses the same email and password:

```cpp
auto login = auth.login({"ada@example.com","correct-password"});
```

A successful login returns three values:

```cpp
login.value().user
login.value().session
login.value().token
```

The user is the authenticated identity.

The session is server-side login state.

The token is a short-lived value attached to the user.

## Authenticate the session

After login, authenticate the session id:

```cpp
auto session = auth.authenticate_session(login.value().session.id());
```

A session is usable when it is:

```txt
valid
not revoked
not expired
```

If the result succeeds, the session contains the authenticated user id:

```cpp
session.value().user_id()
```

## Error handling

Rix Auth uses explicit results.

It does not use exceptions for normal authentication failures.

For operations that return data:

```cpp
auto result = auth.login({"ada@example.com", "wrong-password"});

if (result.failed())
{
  const auto &error = result.error();
}
```

For operations that only return success or failure:

```cpp
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
}
```

Use the facade error helper to print a stable error name:

```cpp
rix.auth.error.to_string(error)
```

Use the error message for diagnostics:

```cpp
error.message()
```

Example:

```cpp
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
```

## Try a failed login

Change the login password:

```cpp
auto login = auth.login({"ada@example.com", "wrong-password"});
```

Run again:

```bash
vix run auth.cpp
```

The login should fail.

This is expected.

Invalid credentials are normal authentication failures and are returned as explicit errors.

## Add logout

After authenticating the session, revoke it:

```cpp
auto logout = auth.logout(login.value().session.id());

if (logout.failed())
{
  const auto &error = logout.error();
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message()
  );

  return 1;
}
```

After logout, the same session should no longer authenticate:

```cpp
auto after_logout = auth.authenticate_session(login.value().session.id());

if (after_logout.ok())
{
  return 1;
}
```

Logout revokes the session instead of deleting the authenticated user.

## Use database auth later

For real applications, use database auth:

```cpp
auto auth = rix.auth.database(db);
```

With production configuration:

```cpp
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Memory auth is good for learning.

Database auth is the right direction when users and sessions must survive restarts.

## What you should remember

Use the facade:

```cpp
#include <rix.hpp>
```

Create memory auth:

```cpp
auto auth = rix.auth.memory();
```

Register:

```cpp
auto registered = auth.register_user({"ada@example.com", "correct-password"});
```

Login:

```cpp
auto login = auth.login({"ada@example.com", "correct-password"});
```

Authenticate the session:

```cpp
auto session = auth.authenticate_session(login.value().session.id());
```

Always check results before using `.value()`.

## Next step

Learn registration and login in more detail.

Next: [Register and Login](./register-login)
