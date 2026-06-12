# Auth

`rix/auth` provides authentication helpers for Vix.cpp applications.

It gives applications a simple public API for:

- user registration
- login
- password hashing
- server-side sessions
- session refresh
- logout
- logout all sessions for a user
- short-lived tokens
- memory-backed stores
- database-backed stores
- explicit error handling

The recommended public API is through the Rix facade:

```cpp id="z9bmn2"
#include <rix.hpp>
```

Then use:

```cpp id="q2w6nk"
rix.auth
```

## Basic example

```cpp id="7dq4os"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"ada@example.com", "correct-password"});

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

  auto session = auth.authenticate_session(login.value().session.id());

  if (session.failed())
  {
    return 1;
  }

  rix.debug.print("authenticated:", session.value().user_id());

  return 0;
}
```

## Install

For the facade API, install:

```bash id="s0as5e"
vix add rix/rix
vix install
```

If the project uses `vix.app`, declare the dependency in `deps`:

```txt id="b3s7zh"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

Do not put Rix packages in `packages`.

## Auth-only dependency

If a project or library only needs Auth, it can depend on the independent package:

```bash id="gyznfp"
vix add rix/auth
vix install
```

Then declare:

```txt id="g1ow4l"
deps = [
  "rix/auth",
]
```

However, the documentation examples use the unified facade:

```cpp id="m4gfd3"
#include <rix.hpp>
```

and:

```cpp id="goz19i"
rix.auth
```

So when following these docs, prefer:

```txt id="r91qoh"
deps = [
  "rix/rix",
]
```

## Single-file usage

For a quick test, create one file:

```bash id="q95wmo"
mkdir -p ~/rix-auth-example
cd ~/rix-auth-example
touch auth.cpp
```

Add:

```cpp id="pmvprt"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"ada@example.com","correct-password"});

  return registered.failed() ? 1 : 0;
}
```

Run:

```bash id="k97tpk"
vix run auth.cpp
```

If Rix is not available yet for single-file usage, install the facade globally:

```bash id="yoaswh"
vix install -g rix/rix
```

Then run again:

```bash id="yw6n08"
vix run auth.cpp
```

## Memory auth

The easiest way to start is:

```cpp id="a0hvqk"
auto auth = rix.auth.memory();
```

Memory auth creates an authentication service backed by in-memory user and session stores.

Use it for:

- examples
- tests
- local experiments
- small temporary tools

Memory auth does not persist data.

When the process stops, users and sessions are lost.

## Database auth

For real applications, use database-backed auth:

```cpp id="yy2zt0"
auto auth = rix.auth.database(db);
```

With production configuration:

```cpp id="ey6dr6"
auto config = rix.auth.config.production();
auto auth = rix.auth.database(db, config);
```

Database auth stores users and sessions through Vix database storage.

Use it when authentication data must survive process restarts.

## Main operations

### Register a user

```cpp id="lt4m4a"
auto registered = auth.register_user({"ada@example.com","correct-password"});
```

A successful registration returns a `User`.

```cpp id="o400ng"
registered.value().id()
registered.value().email()
registered.value().email_verified()
registered.value().active()
```

### Login

```cpp id="dbgfiz"
auto login = auth.login({"ada@example.com","correct-password"});
```

A successful login returns:

```cpp id="ke4vw4"
login.value().user
login.value().session
login.value().token
```

The user contains the authenticated identity.

The session represents server-side login state.

The token is a short-lived value attached to the user.

### Authenticate a session

```cpp id="m1yn80"
auto session = auth.authenticate_session(session_id);
```

A session is usable when it is:

```txt id="nqoja6"
valid
not revoked
not expired
```

### Refresh a session

```cpp id="huzyr1"
auto refreshed = auth.refresh_session(session_id);
```

Refreshing updates the session expiration and last-seen time.

### Logout

```cpp id="e9tlsc"
auto status = auth.logout(session_id);
```

Logout revokes the session.

A revoked session remains stored but can no longer be used.

### Logout all sessions for a user

```cpp id="c170xz"
auto status = auth.logout_user(user_id);
```

Use this when a user changes password, signs out from all devices, or an account must be immediately disconnected.

### Issue a token

```cpp id="j0a9oz"
auto token = auth.issue_token(user_id);
```

A token contains:

```cpp id="s9ue81"
token.value().value()
token.value().user_id()
token.value().issuer()
token.value().issued_at()
token.value().expires_at()
```

The token value is sensitive.

Do not log raw token values in production.

## Password hashing

`rix/auth` exposes password helpers through:

```cpp id="fjqakd"
rix.auth.password
```

Hash a password:

```cpp id="d6ivh2"
auto hashed = rix.auth.password.hash("correct-password");
```

Verify a password:

```cpp id="oyp9xo"
bool valid = rix.auth.password.verify("correct-password",hashed.value());
```

Check a wrong password:

```cpp id="tp93cj"
bool invalid = rix.auth.password.verify("wrong-password",hashed.value());
```

Check whether a password is accepted by the policy:

```cpp id="hh71ge"
bool accepted = rix.auth.password.accepts("correct-password");
```

Password hashing returns explicit results.

Always check the result before using the hash value.

## Configuration

Auth configuration is available through:

```cpp id="p5il7q"
rix.auth.config
```

Development configuration:

```cpp id="w5frl0"
auto config = rix.auth.config.development();
```

Production configuration:

```cpp id="a2m59h"
auto config = rix.auth.config.production();
```

Example:

```cpp id="su8tek"
auto config = rix.auth.config.production();

config.set_min_password_length(12);
config.set_issuer("my-app");

auto auth = rix.auth.memory(config);
```

Configuration controls:

- minimum password length
- maximum password length
- session lifetime
- token lifetime
- password hash iterations
- password salt size
- password hash size
- token issuer
- email verification requirement
- session rotation
- inactive user rejection

## Explicit errors

Rix Auth does not use exceptions for normal authentication failures.

It uses explicit result and status objects.

Operations that return data use result objects:

```cpp id="j18pz7"
auto result = auth.login({"ada@example.com","correct-password"});

if (result.failed())
{
  const auto &error = result.error();
}
```

Operations that only return success or failure use status objects:

```cpp id="izild7"
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
}
```

Convert an error to a stable string:

```cpp id="gbb5dx"
rix.auth.error.to_string(error)
```

Read the human-readable message:

```cpp id="hse97m"
error.message()
```

## Common error codes

Auth errors use stable error codes.

Common codes include:

```txt id="dqyor3"
InvalidInput
InvalidEmail
InvalidPassword
UserNotFound
UserAlreadyExists
InvalidCredentials
EmailVerificationRequired
UserDisabled
InvalidSession
SessionExpired
SessionRevoked
InvalidToken
TokenExpired
TokenRevoked
StoreError
CryptoError
ValidationError
ConfigurationError
Unknown
```

Use the code for programmatic decisions.

Use the message for diagnostics and developer feedback.

## Stores

Auth storage is abstracted behind stores.

User storage:

```cpp id="r52gjm"
UserStore
MemoryUserStore
DbUserStore
```

Session storage:

```cpp id="c21du0"
SessionStore
MemorySessionStore
DbSessionStore
```

The facade gives helpers:

```cpp id="ol2za8"
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();
```

Database stores:

```cpp id="fxby3v"
auto users = rix.auth.stores.database_users(db);
auto sessions = rix.auth.stores.database_sessions(db);
```

For most applications, use:

```cpp id="sed1g6"
auto auth = rix.auth.memory();
```

or:

```cpp id="f4jkzu"
auto auth = rix.auth.database(db);
```

## Managed auth

`ManagedAuth` owns its stores and exposes the Auth API safely.

The easiest managed APIs are:

```cpp id="gjm4gi"
auto auth = rix.auth.memory();
```

and:

```cpp id="xmodkp"
auto auth = rix.auth.database(db);
```

For custom owned stores:

```cpp id="z9oohn"
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto managed = rix.auth.managed(
    std::move(users),
    std::move(sessions)
);

if (managed.failed())
{
  return 1;
}

auto auth = managed.move_value();
```

Use `managed` when you want to create stores yourself but still let the returned auth service own them.

## Caller-owned auth

Advanced code can create an auth service with caller-owned stores:

```cpp id="f8vr17"
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto auth = rix.auth.create(*users, *sessions);
```

In this case, the caller owns the stores.

The stores must stay alive for as long as `auth` is used.

For normal application code, prefer `rix.auth.memory()` or `rix.auth.database(db)`.

## Security notes

Do not log sensitive values in production.

Avoid logging:

```txt id="m4e00b"
plain-text passwords
password hashes
session ids
raw token values
```

Use memory auth only for development, examples, tests, and temporary tools.

Use database auth for real applications.

Use production configuration for real deployments:

```cpp id="a5w4yw"
auto config = rix.auth.config.production();
```

## What you should remember

Use Auth through the facade:

```cpp id="m4pwme"
#include <rix.hpp>
```

```cpp id="j2x3zd"
auto auth = rix.auth.memory();
```

Register users:

```cpp id="k8pf0e"
auth.register_user(...)
```

Login users:

```cpp id="tp9kpy"
auth.login(...)
```

Authenticate sessions:

```cpp id="ue2am9"
auth.authenticate_session(...)
```

Hash passwords:

```cpp id="wf5ojc"
rix.auth.password.hash(...)
```

Always check results before using `.value()`.

Use memory auth for examples and tests.

Use database auth for durable applications.

## Next step

Create your first Auth example.

Next: [Auth Quick Start](./quick-start)
