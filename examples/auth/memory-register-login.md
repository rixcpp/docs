# Memory Register and Login

This example shows how to register a user, log in, and authenticate a session with `rix/auth`.

The example uses the public Rix facade:

```cpp id="q8m4xb"
#include <rix.hpp>
```

and accesses auth through:

```cpp id="v6n9rc"
rix.auth
```

It uses an in-memory auth store, so it is useful for examples, tests, and local development.

## Create the file

```bash id="a7p3kd"
mkdir -p ~/rix-auth-memory-example
cd ~/rix-auth-memory-example
touch memory_register_login.cpp
```

Add:

```cpp id="m9x5qa"
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth memory register and login ==");

  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "ada@example.com",
      "correct-password"});

  if (registered.failed())
  {
    const auto &error = registered.error();

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  rix.debug.print("registered user");
  rix.debug.print("id:", registered.value().id());
  rix.debug.print("email:", registered.value().email());

  auto login = auth.login({
      "ada@example.com",
      "correct-password"});

  if (login.failed())
  {
    const auto &error = login.error();

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  rix.debug.print("----------------------------------------");
  rix.debug.print("login successful");
  rix.debug.print("user:", login.value().user.email());
  rix.debug.print("session:", login.value().session.id());
  rix.debug.print("token issuer:", login.value().token.issuer());

  auto session = auth.authenticate_session(
      login.value().session.id());

  if (session.failed())
  {
    const auto &error = session.error();

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  rix.debug.print("----------------------------------------");
  rix.debug.print("OK:", "session authenticated");
  rix.debug.print("session user id:", session.value().user_id());

  return 0;
}
```

Run it:

```bash id="f4k8vp"
vix run memory_register_login.cpp
```

If Rix is not available yet for single-file usage:

```bash id="h6r2md"
vix install -g rix/rix
vix run memory_register_login.cpp
```

Expected output shape:

```txt id="x9q5bn"
== rix/auth memory register and login ==
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

## What this example does

The example creates an auth service with memory stores:

```cpp id="c7v3xa"
auto auth = rix.auth.memory();
```

It registers a user:

```cpp id="d9m6qr"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

It logs the user in:

```cpp id="s4p8vn"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

It authenticates the created session:

```cpp id="r2x9kc"
auto session = auth.authenticate_session(
    login.value().session.id());
```

## Memory auth

`rix.auth.memory()` creates an auth service backed by in-memory user and session stores.

```cpp id="p8n4qy"
auto auth = rix.auth.memory();
```

This is useful for:

```txt id="t6k9ma"
examples
tests
local development
small demos
temporary applications
```

Memory auth does not persist users or sessions after the process exits.

For real applications that need durable users and sessions, use a database-backed store.

## Register a user

Use:

```cpp id="y7q2hb"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

The first field is the email.

The second field is the plain-text password.

The password is hashed before storage.

The plain-text password should not be logged.

## Check registration errors

`register_user` returns a result.

Check the result before using the user:

```cpp id="b4m9kc"
if (registered.failed())
{
  const auto &error = registered.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());

  return 1;
}
```

Then access the created user:

```cpp id="v8r5px"
const auto &user = registered.value();
```

## Read the registered user

```cpp id="n2x7vm"
rix.debug.print("id:", registered.value().id());
rix.debug.print("email:", registered.value().email());
```

A user has:

```txt id="j5k3qa"
id
email
password hash
email verification state
active state
timestamps
```

Do not print the password hash in application output.

## Log in

Use:

```cpp id="w9q4hc"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

On success, login returns:

```txt id="z6r8vd"
user
session
token
```

Access them with:

```cpp id="a3m7kx"
login.value().user
login.value().session
login.value().token
```

## Check login errors

```cpp id="q5v8nf"
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

A login can fail when the user does not exist, the password is wrong, the user is disabled, or email verification is required by the configuration.

## Read login result

```cpp id="e8c2qy"
rix.debug.print("user:", login.value().user.email());
rix.debug.print("session:", login.value().session.id());
rix.debug.print("token issuer:", login.value().token.issuer());
```

The session id and token value are sensitive.

In production, do not log raw session ids or token values.

The example prints the session id only to make the flow visible.

## Authenticate a session

Use:

```cpp id="k6q9xb"
auto session = auth.authenticate_session(
    login.value().session.id());
```

If the session exists, is not revoked, and is not expired, the result succeeds.

```cpp id="m7c4rv"
if (session.ok())
{
  rix.debug.print("session user id:", session.value().user_id());
}
```

## Check session errors

```cpp id="x9v3md"
if (session.failed())
{
  const auto &error = session.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());

  return 1;
}
```

A session can fail authentication when it is missing, expired, revoked, or invalid.

## Complete flow

The normal memory auth flow is:

```txt id="d5n8qa"
create auth service
register user
login user
authenticate session
handle errors explicitly
```

In code:

```cpp id="r6t2wc"
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});

auto login = auth.login({
    "ada@example.com",
    "correct-password"});

auto session = auth.authenticate_session(
    login.value().session.id());
```

In real code, check each result before using `value()`.

## Error handling pattern

Use this pattern for auth operations:

```cpp id="h9p5vx"
auto result = auth.login({
    "ada@example.com",
    "correct-password"});

if (result.failed())
{
  const auto &error = result.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());

  return 1;
}
```

Then use:

```cpp id="g3m7nc"
result.value()
```

Only after checking success.

## Duplicate registration example

This example shows a failed registration when the same email is used twice.

```cpp id="p4q8zb"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto first = auth.register_user({
      "ada@example.com",
      "correct-password"});

  if (first.failed())
  {
    return 1;
  }

  auto second = auth.register_user({
      "ada@example.com",
      "correct-password"});

  if (second.failed())
  {
    rix.debug.eprint(
        "expected auth error:",
        rix.auth.error.to_string(second.error()),
        second.error().message());

    return 0;
  }

  return 1;
}
```

Run:

```bash id="n6y2kd"
vix run memory_register_login.cpp
```

The second registration should fail because the user already exists.

## Wrong password example

```cpp id="v2k9qc"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "ada@example.com",
      "correct-password"});

  if (registered.failed())
  {
    return 1;
  }

  auto login = auth.login({
      "ada@example.com",
      "wrong-password"});

  if (login.failed())
  {
    rix.debug.eprint(
        "expected auth error:",
        rix.auth.error.to_string(login.error()),
        login.error().message());

    return 0;
  }

  return 1;
}
```

This should fail with an invalid credentials error.

## Use a custom memory configuration

You can pass an auth configuration to `memory`.

```cpp id="c8w5rp"
auto config = rix.auth.config.development();

config.set_min_password_length(8);
config.set_token_ttl_seconds(60 * 15);
config.set_session_ttl_seconds(60 * 60 * 24 * 7);

auto auth = rix.auth.memory(config);
```

Use this when the default behavior needs to be changed for an example or application.

## Production-like memory config

For stricter rules:

```cpp id="z4v8qa"
auto config = rix.auth.config.production();

auto auth = rix.auth.memory(config);
```

Production configuration requires email verification before login.

For this example, development configuration is simpler because it allows login immediately after registration.

## Use in a Vix project

Create a project:

```bash id="m3k6hn"
vix new rix-auth-memory --app
cd rix-auth-memory
```

Add Rix:

```bash id="q7x2vb"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="w9d5rc"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="s8p4ky"
name = "rix-auth-memory"
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

```txt id="x2q9mf"
src/main.cpp
```

Build and run:

```bash id="b9v7na"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="d4h8qc"
vix run memory_register_login.cpp
```

If needed:

```bash id="r5n9vk"
vix install -g rix/rix
vix run memory_register_login.cpp
```

For project usage, prefer:

```bash id="a6x3pd"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="k8m2zc"
deps = [
  "rix/rix",
]
```

## Use only auth with the facade

If you want the `rix.*` facade style but only want auth mounted, define the feature macro before including `rix.hpp`:

```cpp id="e7q6rn"
#define RIX_ENABLE_AUTH
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "ada@example.com",
      "correct-password"});

  return registered.ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp id="f9c4xp"
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
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
  return 0;
}
```

## Use the independent package

For independent usage, install:

```bash id="y8v3qx"
vix add rix/auth
vix install
```

In `vix.app`:

```txt id="c6r7mn"
deps = [
  "rix/auth",
]
```

Then include auth package headers directly.

The examples in this documentation prefer the public facade:

```cpp id="p2m8ka"
#include <rix.hpp>
```

and:

```cpp id="h4x9qd"
rix.auth
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="z9b5rq"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="q3m6vx"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="n8c4xm"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="v5q2zd"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Calling `value()` before checking success

Wrong:

```cpp id="x8d6wp"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

rix.debug.print(login.value().user.email());
```

Correct:

```cpp id="m4f7kc"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

if (login.failed())
{
  return 1;
}

rix.debug.print(login.value().user.email());
```

### Using production config without verifying email

This can fail:

```cpp id="t9q5xb"
auto auth = rix.auth.memory(
    rix.auth.config.production());

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});

auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

Production config requires email verification before login.

For the simple memory example, use:

```cpp id="w3y8pd"
auto auth = rix.auth.memory();
```

### Printing sensitive values in production

Avoid printing:

```txt id="r6x2nv"
plain-text passwords
password hashes
raw tokens
session ids
```

The example prints the session id only to make the flow understandable.

In production, avoid logging it.

### Expecting memory auth to persist data

Memory auth is not durable.

When the process exits, users and sessions are gone.

Use database-backed stores for real applications.

## What you should remember

Create a memory auth service:

```cpp id="a2k9hm"
auto auth = rix.auth.memory();
```

Register:

```cpp id="c8n4vq"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

Login:

```cpp id="d7q5mx"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

Authenticate a session:

```cpp id="v8m2na"
auto session = auth.authenticate_session(
    login.value().session.id());
```

Check errors before using values:

```cpp id="p9x7kr"
if (login.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(login.error()),
      login.error().message());

  return 1;
}
```

For project usage:

```bash id="j4r8qc"
vix add rix/rix
vix install
```

and keep:

```txt id="g6m3wy"
deps = [
  "rix/rix",
]
```

## Next step

Continue with password hashing.

Next: [Password hashing](./password-hash)
