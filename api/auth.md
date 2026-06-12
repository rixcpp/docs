# Auth API

This page documents the public `rix/auth` API.

Use auth through the unified Rix facade:

```cpp id="h8q4ma"
#include <rix.hpp>
```

Then access auth with:

```cpp id="n5v9qc"
rix.auth
```

The auth API provides helpers for:

```txt id="k7x2ma"
registration
login
password hashing
sessions
tokens
configuration
memory stores
error handling
```

## Package

The auth package is:

```txt id="p9c5xr"
rix/auth
```

For facade usage, install:

```bash id="q4m8vb"
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="x2n7pd"
deps = [
  "rix/rix",
]
```

For independent package usage, install:

```bash id="t8q5hm"
vix add rix/auth
vix install
```

In `vix.app`:

```txt id="b6x3rd"
deps = [
  "rix/auth",
]
```

## Header

Facade usage:

```cpp id="z5v8ka"
#include <rix.hpp>
```

Independent usage:

```cpp id="c9q2mx"
#include <rix/auth.hpp>
```

Most application examples should use the facade.

## Facade member

The auth facade member is:

```cpp id="h7n4qc"
rix.auth
```

Example:

```cpp id="d3x8vp"
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

## Main modules

`rix.auth` exposes several helper areas:

```cpp id="j2m9wa"
rix.auth.memory()
rix.auth.password
rix.auth.config
rix.auth.error
```

Common usage:

```cpp id="w8c5nr"
auto auth = rix.auth.memory();

auto config = rix.auth.config.development();

auto hashed = rix.auth.password.hash("correct-password");

auto error_text = rix.auth.error.to_string(error);
```

## Create a memory auth service

Use:

```cpp id="k5v7ma"
auto auth = rix.auth.memory();
```

This creates an auth service backed by in-memory user and session stores.

Memory auth is useful for:

```txt id="r6q9xd"
examples
tests
local development
small demos
temporary applications
```

Memory auth does not persist users or sessions after the process exits.

## Create memory auth with config

```cpp id="p2n8fc"
auto config = rix.auth.config.development();

config.set_min_password_length(8);
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
config.set_token_ttl_seconds(60 * 15);

auto auth = rix.auth.memory(config);
```

Use configuration when you want to change password policy, token lifetime, session lifetime, or issuer.

## Register a user

Use:

```cpp id="y4m6qv"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

`register_user` returns an explicit result.

Check it before using the user:

```cpp id="f9x3ka"
if (registered.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(registered.error()),
      registered.error().message());

  return 1;
}
```

Then use:

```cpp id="m7c5vx"
const auto &user = registered.value();
```

## Register request

A register request contains:

```txt id="q3p8za"
email
password
```

Example:

```cpp id="v8n2hr"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

The plain-text password is hashed before storage.

Do not log the plain-text password.

## Login

Use:

```cpp id="a6q9mx"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

`login` returns an explicit result.

Check it:

```cpp id="r4v8kb"
if (login.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(login.error()),
      login.error().message());

  return 1;
}
```

Then use:

```cpp id="x9m2pd"
login.value().user
login.value().session
login.value().token
```

## Login result

A successful login contains:

```txt id="c5w9qa"
user
session
token
```

Example:

```cpp id="z8q2vm"
rix.debug.print("user:", login.value().user.email());
rix.debug.print("session:", login.value().session.id());
rix.debug.print("issuer:", login.value().token.issuer());
```

Session ids and token values are sensitive.

Do not print them in production logs.

## Authenticate a session

Use:

```cpp id="n7x4hd"
auto session = auth.authenticate_session(
    login.value().session.id());
```

Check the result:

```cpp id="d6k8rc"
if (session.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(session.error()),
      session.error().message());

  return 1;
}
```

Then:

```cpp id="g5m9xq"
rix.debug.print("session user id:", session.value().user_id());
```

A session is valid when it exists, is not expired, and is not revoked.

## Refresh a session

Use:

```cpp id="y3v8mb"
auto refreshed = auth.refresh_session(session_id);
```

Check it:

```cpp id="f4q7vd"
if (refreshed.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(refreshed.error()),
      refreshed.error().message());

  return 1;
}
```

Then:

```cpp id="w2x6qp"
rix.debug.print("new expires at:", refreshed.value().expires_at());
```

Refreshing a session extends its expiration according to the configured session lifetime.

## Logout

Use:

```cpp id="n6c9hd"
auto status = auth.logout(session_id);
```

Check it:

```cpp id="j8q5kc"
if (status.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(status.error()),
      status.error().message());

  return 1;
}
```

Logout revokes the session.

A revoked session can remain stored, but it cannot be used for authentication.

## Logout all sessions for a user

Use:

```cpp id="r7x3vm"
auto status = auth.logout_user(user_id);
```

Example:

```cpp id="p6m8xb"
auto status = auth.logout_user(registered.value().id());

if (status.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(status.error()),
      status.error().message());

  return 1;
}
```

This revokes all sessions belonging to the user.

## Issue a token

Use:

```cpp id="t9q2za"
auto token = auth.issue_token(user_id);
```

Check it:

```cpp id="x4v7nd"
if (token.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(token.error()),
      token.error().message());

  return 1;
}
```

Then read token metadata:

```cpp id="p4q8zb"
rix.debug.print("user id:", token.value().user_id());
rix.debug.print("issuer:", token.value().issuer());
rix.debug.print("issued at:", token.value().issued_at());
rix.debug.print("expires at:", token.value().expires_at());
```

Do not log raw token values in production.

## Password API

Password helpers are available through:

```cpp id="v2k9qc"
rix.auth.password
```

Common helpers:

```cpp id="c8w5rp"
rix.auth.password.hash(...)
rix.auth.password.verify(...)
rix.auth.password.accepts(...)
rix.auth.password.hasher()
```

## Hash a password

Use:

```cpp id="z4v8qa"
auto hashed = rix.auth.password.hash("correct-password");
```

Check it:

```cpp id="q8k5mv"
if (hashed.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(hashed.error()),
      hashed.error().message());

  return 1;
}
```

Then store:

```cpp id="s6n4vm"
hashed.value()
```

Do not store plain-text passwords.

## Verify a password

Use:

```cpp id="v8q3md"
const bool ok = rix.auth.password.verify(
    "correct-password",
    hashed.value());
```

Wrong passwords return `false`:

```cpp id="h5v8qp"
const bool wrong = rix.auth.password.verify(
    "wrong-password",
    hashed.value());
```

Example:

```cpp id="d9m5qx"
if (ok && !wrong)
{
  rix.debug.print("password verification works");
}
```

## Check password policy

Use:

```cpp id="m8x2vc"
const bool accepted = rix.auth.password.accepts("correct-password");
```

Example:

```cpp id="a2r7kb"
if (!rix.auth.password.accepts("short"))
{
  rix.debug.eprint("password rejected by policy");
}
```

`hash` also checks the password policy.

## Create a password hasher

Use:

```cpp id="c8n3vy"
auto hasher = rix.auth.password.hasher();
```

Then:

```cpp id="n6x9qa"
auto hashed = hasher.hash("correct-password");

const bool ok = hasher.verify(
    "correct-password",
    hashed.value());
```

With configuration:

```cpp id="y5q2md"
auto config = rix.auth.config.production();

auto hasher = rix.auth.password.hasher(config);
```

For most application code, the facade helpers are enough.

## Configuration API

Configuration helpers are available through:

```cpp id="b4v8qc"
rix.auth.config
```

Common helpers:

```cpp id="p3x7rn"
rix.auth.config.development()
rix.auth.config.production()
```

## Development configuration

Use:

```cpp id="h9n2ka"
auto config = rix.auth.config.development();
```

Development configuration is useful for examples and local development.

It allows simple register and login flows.

Example:

```cpp id="q6v8mx"
auto auth = rix.auth.memory(
    rix.auth.config.development());
```

## Production configuration

Use:

```cpp id="t5c8vp"
auto config = rix.auth.config.production();
```

Production configuration is stricter.

It can require email verification before login.

Example:

```cpp id="r8q5wc"
auto auth = rix.auth.memory(
    rix.auth.config.production());
```

Use production configuration when building a real application flow.

## Configuration setters

Common configuration setters include:

```cpp id="x4m9vd"
config.set_min_password_length(...)
config.set_session_ttl_seconds(...)
config.set_token_ttl_seconds(...)
config.set_issuer(...)
config.set_password_hash_iterations(...)
config.set_password_salt_size(...)
config.set_password_hash_size(...)
```

Example:

```cpp id="f7q3ma"
auto config = rix.auth.config.development();

config.set_min_password_length(12);
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
config.set_token_ttl_seconds(60 * 15);
config.set_issuer("my-app");

auto auth = rix.auth.memory(config);
```

## Error API

Error helpers are available through:

```cpp id="n9x2qc"
rix.auth.error
```

Common helpers:

```cpp id="c5v8na"
rix.auth.error.to_string(error)
rix.auth.error.is(error, code)
```

Example:

```cpp id="m6q4rd"
if (registered.failed())
{
  const auto &error = registered.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());
}
```

## Auth error codes

Auth error codes include:

```cpp id="v2k8xm"
rixlib::auth::AuthErrorCode::InvalidInput
rixlib::auth::AuthErrorCode::InvalidEmail
rixlib::auth::AuthErrorCode::InvalidPassword
rixlib::auth::AuthErrorCode::UserNotFound
rixlib::auth::AuthErrorCode::UserAlreadyExists
rixlib::auth::AuthErrorCode::InvalidCredentials
rixlib::auth::AuthErrorCode::InvalidSession
rixlib::auth::AuthErrorCode::SessionExpired
rixlib::auth::AuthErrorCode::InvalidToken
rixlib::auth::AuthErrorCode::TokenExpired
rixlib::auth::AuthErrorCode::InvalidState
rixlib::auth::AuthErrorCode::StoreError
rixlib::auth::AuthErrorCode::Unknown
```

Use error codes for programmatic decisions.

Use messages for diagnostics.

## Check a specific error

```cpp id="q9c5rd"
if (rix.auth.error.is(
        login.error(),
        rixlib::auth::AuthErrorCode::InvalidCredentials))
{
  rix.debug.eprint("login failed:", "invalid credentials");
}
```

This lets your app react differently depending on the failure.

## Result pattern

Auth APIs use explicit results.

For operations that return a value:

```cpp id="k8m4xa"
auto result = auth.login({
    "ada@example.com",
    "correct-password"});

if (result.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(result.error()),
      result.error().message());

  return 1;
}

const auto &login = result.value();
```

Never call `value()` before checking success.

## Status pattern

Some operations return a status.

Example:

```cpp id="h5n7vc"
auto status = auth.logout(session_id);

if (status.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(status.error()),
      status.error().message());

  return 1;
}
```

Use:

```cpp id="x9q2va"
status.ok()
status.failed()
status.error()
```

## User API

A user value exposes user information.

Common methods include:

```cpp id="d6m8qc"
user.id()
user.email()
user.active()
user.email_verified()
```

Example:

```cpp id="z4x7mq"
const auto &user = registered.value();

rix.debug.print("id:", user.id());
rix.debug.print("email:", user.email());
```

Do not print password hashes in application output.

## Session API

A session value exposes session information.

Common methods include:

```cpp id="y8m3ka"
session.id()
session.user_id()
session.created_at()
session.expires_at()
session.revoked()
session.expired(...)
session.usable(...)
```

Example:

```cpp id="s5v9qa"
const auto &session = login.value().session;

rix.debug.print("user id:", session.user_id());
rix.debug.print("expires at:", session.expires_at());
```

Session ids are sensitive.

Avoid logging raw session ids in production.

## Token API

A token value exposes token information.

Common methods include:

```cpp id="p7n4xm"
token.value()
token.user_id()
token.issuer()
token.issued_at()
token.expires_at()
token.revoked()
token.revoke()
token.expired(...)
token.usable(...)
token.belongs_to(...)
token.issued_by(...)
```

Example:

```cpp id="w3q8kc"
const auto &token = login.value().token;

rix.debug.print("issuer:", token.issuer());
rix.debug.print("expires at:", token.expires_at());
```

The raw token value is sensitive.

Avoid logging:

```cpp id="r6x2vd"
token.value()
```

in production.

## Complete register and login example

```cpp id="a8k5qx"
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

  auto login = auth.login({
      "ada@example.com",
      "correct-password"});

  if (login.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(login.error()),
        login.error().message());

    return 1;
  }

  auto session = auth.authenticate_session(
      login.value().session.id());

  if (session.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(session.error()),
        session.error().message());

    return 1;
  }

  rix.debug.print("authenticated user id:", session.value().user_id());
  return 0;
}
```

Run:

```bash id="f2v7mc"
vix run auth.cpp
```

## Complete password hashing example

```cpp id="c9m4vx"
#include <rix.hpp>

int main()
{
  auto hashed = rix.auth.password.hash("correct-password");

  if (hashed.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(hashed.error()),
        hashed.error().message());

    return 1;
  }

  const bool valid = rix.auth.password.verify(
      "correct-password",
      hashed.value());

  const bool invalid = rix.auth.password.verify(
      "wrong-password",
      hashed.value());

  if (!valid || invalid)
  {
    return 1;
  }

  rix.debug.print("password verification successful");
  return 0;
}
```

## Complete session example

```cpp id="m8q2za"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "grace@example.com",
      "correct-password"});

  if (registered.failed())
  {
    return 1;
  }

  auto login = auth.login({
      "grace@example.com",
      "correct-password"});

  if (login.failed())
  {
    return 1;
  }

  const auto session_id = login.value().session.id();

  auto refreshed = auth.refresh_session(session_id);

  if (refreshed.failed())
  {
    return 1;
  }

  auto logout = auth.logout(session_id);

  if (logout.failed())
  {
    return 1;
  }

  auto after_logout = auth.authenticate_session(session_id);

  return after_logout.failed() ? 0 : 1;
}
```

## Complete token example

```cpp id="n5v8qc"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "linus@example.com",
      "correct-password"});

  if (registered.failed())
  {
    return 1;
  }

  auto token = auth.issue_token(
      registered.value().id());

  if (token.failed())
  {
    return 1;
  }

  rix.debug.print("issuer:", token.value().issuer());
  rix.debug.print("expires at:", token.value().expires_at());

  return 0;
}
```

## Use in a Vix route

```cpp id="q7x4ma"
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

For durable applications, use database-backed stores instead of memory stores.

## Use in a Vix project

Create a Vix app:

```bash id="h6q9vx"
vix new rix-auth-api --app
cd rix-auth-api
```

Add Rix:

```bash id="v8n3qb"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="k4m9xd"
deps = [
  "rix/rix",
]
```

Use in `src/main.cpp`:

```cpp id="x3m7qa"
#include <rix.hpp>
```

Build and run:

```bash id="n9q5vx"
vix build
vix run
```

## Single-file usage

Create a file:

```bash id="d2v8rc"
mkdir -p ~/rix-auth-api
cd ~/rix-auth-api
touch auth.cpp
```

Add:

```cpp id="b5x9ma"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();
  return 0;
}
```

Run:

```bash id="r4q8md"
vix run auth.cpp
```

If Rix is not available globally:

```bash id="y7m2ka"
vix install -g rix/rix
vix run auth.cpp
```

## Independent usage

Install only auth:

```bash id="f7q3ma"
vix add rix/auth
vix install
```

In `vix.app`:

```txt id="n9x2qc"
deps = [
  "rix/auth",
]
```

Then include:

```cpp id="c5v8na"
#include <rix/auth.hpp>
```

Use independent package APIs when you intentionally do not want the unified facade.

For most documentation and application examples, prefer:

```cpp id="m6q4rd"
#include <rix.hpp>
```

and:

```cpp id="v2k8xm"
rix.auth
```

## Security notes

Do not log:

```txt id="q9c5rd"
plain-text passwords
password hashes
raw token values
session ids
```

Use HTTPS in production.

Use durable stores for real user accounts.

Use stricter configuration for production.

Keep token lifetimes short.

Keep session lifetimes intentional.

Require email verification when your application needs it.

## Common mistakes

### Forgetting to install Rix

If your code uses:

```cpp id="k8m4xa"
#include <rix.hpp>
```

install:

```bash id="h5n7vc"
vix add rix/rix
vix install
```

### Putting Rix in `packages`

Wrong:

```txt id="x9q2va"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="d6m8qc"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Calling `value()` before checking success

Wrong:

```cpp id="z4x7mq"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

rix.debug.print(login.value().user.email());
```

Correct:

```cpp id="y8m3ka"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

if (login.failed())
{
  return 1;
}

rix.debug.print(login.value().user.email());
```

### Printing sensitive values

Avoid printing:

```txt id="s5v9qa"
passwords
password hashes
tokens
session ids
```

### Expecting memory auth to persist

Memory auth is not durable.

When the process exits, users and sessions are gone.

Use database-backed stores for real applications.

### Using production config without email verification flow

Production config can require email verification before login.

For simple examples, use:

```cpp id="p7n4xm"
auto auth = rix.auth.memory();
```

or:

```cpp id="w3q8kc"
auto auth = rix.auth.memory(
    rix.auth.config.development());
```

### Treating tokens and sessions as the same thing

A session is server-side authentication state.

A token is a short-lived value issued for a user.

They have separate lifetimes:

```cpp id="r6x2vd"
config.set_session_ttl_seconds(...);
config.set_token_ttl_seconds(...);
```

## What you should remember

Create auth:

```cpp id="a8k5qx"
auto auth = rix.auth.memory();
```

Register:

```cpp id="f2v7mc"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

Login:

```cpp id="c9m4vx"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

Authenticate session:

```cpp id="m8q2za"
auto session = auth.authenticate_session(
    login.value().session.id());
```

Hash password:

```cpp id="n5v8qc"
auto hashed = rix.auth.password.hash("correct-password");
```

Verify password:

```cpp id="q7x4ma"
const bool ok = rix.auth.password.verify(
    "correct-password",
    hashed.value());
```

Issue token:

```cpp id="h6q9vx"
auto token = auth.issue_token(user_id);
```

Always check `failed()` before using `value()`.

For project usage:

```bash id="v8n3qb"
vix add rix/rix
vix install
```

and keep:

```txt id="k4m9xd"
deps = [
  "rix/rix",
]
```

## Next step

Continue with the CSV API.

Next: [CSV API](./csv)
