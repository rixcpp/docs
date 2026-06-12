# Session Refresh and Logout

This example shows how to refresh a session and log out with `rix/auth`.

The example uses the public Rix facade:

```cpp id="m8q4vx"
#include <rix.hpp>
```

and accesses auth through:

```cpp id="n5x9qa"
rix.auth
```

It uses an in-memory auth service, so it is useful for examples, tests, and local development.

## Create the file

```bash id="k7v2ma"
mkdir -p ~/rix-auth-session-example
cd ~/rix-auth-session-example
touch session_refresh_logout.cpp
```

Add:

```cpp id="p9c5xr"
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth session refresh and logout ==");

  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "grace@example.com",
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

  auto login = auth.login({
      "grace@example.com",
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

  const auto session_id = login.value().session.id();

  rix.debug.print("created session:", session_id);
  rix.debug.print("expires at:", login.value().session.expires_at());

  auto refreshed = auth.refresh_session(session_id);

  if (refreshed.failed())
  {
    const auto &error = refreshed.error();

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  rix.debug.print("----------------------------------------");
  rix.debug.print("OK:", "session refreshed");
  rix.debug.print("new expires at:", refreshed.value().expires_at());

  auto logout = auth.logout(session_id);

  if (logout.failed())
  {
    const auto &error = logout.error();

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  rix.debug.print("----------------------------------------");
  rix.debug.print("OK:", "logout successful");

  auto after_logout = auth.authenticate_session(session_id);

  if (after_logout.ok())
  {
    rix.debug.eprint("ERROR:", "session should not be valid after logout");
    return 1;
  }

  rix.debug.print("session rejected after logout");

  return 0;
}
```

Run it:

```bash id="q4m8vb"
vix run session_refresh_logout.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x2n7pd"
vix install -g rix/rix
vix run session_refresh_logout.cpp
```

Expected output shape:

```txt id="t8q5hm"
== rix/auth session refresh and logout ==
created session: session_...
expires at: ...
----------------------------------------
OK: session refreshed
new expires at: ...
----------------------------------------
OK: logout successful
session rejected after logout
```

## What this example does

The example creates an in-memory auth service:

```cpp id="b6x3rd"
auto auth = rix.auth.memory();
```

It registers a user:

```cpp id="z5v8ka"
auto registered = auth.register_user({
    "grace@example.com",
    "correct-password"});
```

It logs the user in:

```cpp id="c9q2mx"
auto login = auth.login({
    "grace@example.com",
    "correct-password"});
```

It stores the session id:

```cpp id="h7n4qc"
const auto session_id = login.value().session.id();
```

It refreshes the session:

```cpp id="d3x8vp"
auto refreshed = auth.refresh_session(session_id);
```

It logs out:

```cpp id="j2m9wa"
auto logout = auth.logout(session_id);
```

Then it checks that the session is rejected after logout:

```cpp id="w8c5nr"
auto after_logout = auth.authenticate_session(session_id);
```

## Create a session

A session is created when login succeeds.

```cpp id="k5v7ma"
auto login = auth.login({
    "grace@example.com",
    "correct-password"});
```

The login result contains:

```txt id="r6q9xd"
user
session
token
```

Access the session with:

```cpp id="p2n8fc"
login.value().session
```

Use the session id for later session operations:

```cpp id="y4m6qv"
const auto session_id = login.value().session.id();
```

## Refresh a session

Use:

```cpp id="f9x3ka"
auto refreshed = auth.refresh_session(session_id);
```

If the session is valid, not expired, and not revoked, refresh succeeds.

The refreshed session has an updated expiration timestamp.

```cpp id="m7c5vx"
rix.debug.print(
    "new expires at:",
    refreshed.value().expires_at());
```

## Check refresh errors

`refresh_session` returns a result.

Check it before using the refreshed session:

```cpp id="q3p8za"
if (refreshed.failed())
{
  const auto &error = refreshed.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());

  return 1;
}
```

Then use:

```cpp id="v8n2hr"
refreshed.value()
```

## Logout

Use:

```cpp id="a6q9mx"
auto logout = auth.logout(session_id);
```

Logout revokes the session.

A revoked session remains stored, but it can no longer be used for authentication.

## Check logout errors

`logout` returns a status.

Use:

```cpp id="r4v8kb"
logout.ok()
logout.failed()
logout.error()
```

Example:

```cpp id="x9m2pd"
if (logout.failed())
{
  const auto &error = logout.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());

  return 1;
}
```

## Authenticate after logout

After logout, this should fail:

```cpp id="c5w9qa"
auto after_logout = auth.authenticate_session(session_id);
```

Check it:

```cpp id="z8q2vm"
if (after_logout.ok())
{
  rix.debug.eprint("ERROR:", "session should not be valid after logout");
  return 1;
}
```

This confirms that logout revoked the session.

## Normal session flow

The normal flow is:

```txt id="n7x4hd"
register user
login user
get session id
refresh session when needed
logout when done
reject session after logout
```

In code:

```cpp id="d6k8rc"
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "grace@example.com",
    "correct-password"});

auto login = auth.login({
    "grace@example.com",
    "correct-password"});

const auto session_id = login.value().session.id();

auto refreshed = auth.refresh_session(session_id);

auto logout = auth.logout(session_id);
```

In real code, check every result before calling `value()`.

## Error handling pattern

Use this pattern for session operations that return a value:

```cpp id="g5m9xq"
auto result = auth.refresh_session(session_id);

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

Use this pattern for operations that only return a status:

```cpp id="y3v8mb"
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());

  return 1;
}
```

## Refresh before logout

This is valid:

```cpp id="f4q7vd"
auto refreshed = auth.refresh_session(session_id);

if (refreshed.failed())
{
  return 1;
}

auto logout = auth.logout(session_id);
```

Refresh keeps the session alive.

Logout revokes it.

After logout, refresh should fail because the session is no longer usable.

## Refresh after logout example

```cpp id="w2x6qp"
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

  auto logout = auth.logout(session_id);

  if (logout.failed())
  {
    return 1;
  }

  auto refreshed = auth.refresh_session(session_id);

  if (refreshed.failed())
  {
    rix.debug.eprint(
        "expected auth error:",
        rix.auth.error.to_string(refreshed.error()),
        refreshed.error().message());

    return 0;
  }

  return 1;
}
```

Run:

```bash id="n6c9hd"
vix run session_refresh_logout.cpp
```

The refresh after logout should fail.

## Logout all sessions for a user

Use:

```cpp id="j8q5kc"
auto status = auth.logout_user(user_id);
```

Example:

```cpp id="r7x3vm"
auto registered = auth.register_user({
    "grace@example.com",
    "correct-password"});

if (registered.failed())
{
  return 1;
}

auto login1 = auth.login({
    "grace@example.com",
    "correct-password"});

auto login2 = auth.login({
    "grace@example.com",
    "correct-password"});

if (login1.failed() || login2.failed())
{
  return 1;
}

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

`logout_user` revokes all sessions belonging to the given user.

## Authenticate session directly

Use:

```cpp id="p6m8xb"
auto session = auth.authenticate_session(session_id);
```

This checks that the session:

```txt id="t9q2za"
exists
is valid
is not expired
is not revoked
```

Example:

```cpp id="x4v7nd"
if (session.ok())
{
  rix.debug.print("session user id:", session.value().user_id());
}
```

## Custom session lifetime

You can configure session lifetime with auth config:

```cpp id="b9v4qc"
auto config = rix.auth.config.development();

config.set_session_ttl_seconds(60 * 60);

auto auth = rix.auth.memory(config);
```

This creates sessions that last one hour.

Use this when testing session expiration behavior or changing application policy.

## Token lifetime is separate

Session lifetime and token lifetime are separate settings.

```cpp id="m5k8xa"
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
config.set_token_ttl_seconds(60 * 15);
```

The session controls server-side authentication.

The token is a short-lived value issued for a user.

## Safe output

Session ids are sensitive.

This example prints the session id so the flow is easy to see.

For production logs, avoid printing:

```txt id="q8p3vc"
session ids
raw token values
passwords
password hashes
```

Use stable user ids, event ids, or redacted values instead.

## Use in a Vix project

Create a project:

```bash id="d5m9ka"
vix new rix-auth-session --app
cd rix-auth-session
```

Add Rix:

```bash id="m3q7xp"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="k8v2hd"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="p9n4qc"
name = "rix-auth-session"
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

```txt id="v6x8mr"
src/main.cpp
```

Build and run:

```bash id="c4q9vb"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="x7m5kd"
vix run session_refresh_logout.cpp
```

If needed:

```bash id="q2n8vc"
vix install -g rix/rix
vix run session_refresh_logout.cpp
```

For project usage, prefer:

```bash id="w5p9xa"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="a8r4qn"
deps = [
  "rix/rix",
]
```

## Use only auth with the facade

If you want the `rix.*` facade style but only want auth mounted, define the feature macro before including `rix.hpp`:

```cpp id="s6v3xp"
#define RIX_ENABLE_AUTH
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

  auto logout = auth.logout(login.value().session.id());

  return logout.ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp id="h9m6qa"
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "grace@example.com",
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

```bash id="n8c5vd"
vix add rix/auth
vix install
```

In `vix.app`:

```txt id="r9x2km"
deps = [
  "rix/auth",
]
```

Then include auth package headers directly.

The examples in this documentation prefer the public facade:

```cpp id="f6q8mb"
#include <rix.hpp>
```

and:

```cpp id="j4v7xc"
rix.auth
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="z5v9ha"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="m2q8vc"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="c7x9qa"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="d4v8nr"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Calling `value()` before checking success

Wrong:

```cpp id="v9n2kx"
auto refreshed = auth.refresh_session(session_id);

rix.debug.print(refreshed.value().expires_at());
```

Correct:

```cpp id="h5q7mc"
auto refreshed = auth.refresh_session(session_id);

if (refreshed.failed())
{
  return 1;
}

rix.debug.print(refreshed.value().expires_at());
```

### Expecting logout to delete the session

Logout revokes the session.

A revoked session can remain stored, but it is not usable.

This makes logout behavior safer and easier to audit.

### Refreshing a revoked session

This should fail:

```cpp id="q6p9xa"
auth.logout(session_id);

auto refreshed = auth.refresh_session(session_id);
```

A revoked session is not refreshable.

### Printing session ids in production

Avoid logging raw session ids.

They are sensitive authentication values.

The example prints them only to make the flow visible.

### Expecting memory sessions to persist

Memory sessions disappear when the process exits.

Use database-backed stores for durable auth.

## What you should remember

Create memory auth:

```cpp id="x8q4vd"
auto auth = rix.auth.memory();
```

Login creates a session:

```cpp id="n9m5xa"
auto login = auth.login({
    "grace@example.com",
    "correct-password"});
```

Refresh the session:

```cpp id="a5v8kc"
auto refreshed = auth.refresh_session(
    login.value().session.id());
```

Logout revokes the session:

```cpp id="m3q7xd"
auto logout = auth.logout(
    login.value().session.id());
```

After logout, authentication should fail:

```cpp id="b8p4qy"
auto after_logout = auth.authenticate_session(
    login.value().session.id());
```

Check every result before using `value()`.

For project usage:

```bash id="k2m9vc"
vix add rix/rix
vix install
```

and keep:

```txt id="r5q8xa"
deps = [
  "rix/rix",
]
```

## Next step

Continue with token issue.

Next: [Token issue](./token-issue)
