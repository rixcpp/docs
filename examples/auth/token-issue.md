# Token Issue

This example shows how to issue a token for a registered user with `rix/auth`.

The example uses the public Rix facade:

```cpp id="q8m4na"
#include <rix.hpp>
```

and accesses auth through:

```cpp id="x5v9kc"
rix.auth
```

It uses an in-memory auth service, so it is useful for examples, tests, and local development.

## Create the file

```bash id="m7q2vd"
mkdir -p ~/rix-auth-token-example
cd ~/rix-auth-token-example
touch token_issue.cpp
```

Add:

```cpp id="h9c5xa"
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth token issue ==");

  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "linus@example.com",
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

  auto token = auth.issue_token(
      registered.value().id());

  if (token.failed())
  {
    const auto &error = token.error();

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  rix.debug.print("OK:", "token issued");
  rix.debug.print("user id:", token.value().user_id());
  rix.debug.print("issuer:", token.value().issuer());
  rix.debug.print("issued at:", token.value().issued_at());
  rix.debug.print("expires at:", token.value().expires_at());

  return 0;
}
```

Run it:

```bash id="r4n8qm"
vix run token_issue.cpp
```

If Rix is not available yet for single-file usage:

```bash id="d2k9xb"
vix install -g rix/rix
vix run token_issue.cpp
```

Expected output shape:

```txt id="p8v3ka"
== rix/auth token issue ==
OK: token issued
user id: user_...
issuer: rix/auth
issued at: ...
expires at: ...
```

## What this example does

The example creates an in-memory auth service:

```cpp id="t7q4md"
auto auth = rix.auth.memory();
```

It registers a user:

```cpp id="z6m8qc"
auto registered = auth.register_user({
    "linus@example.com",
    "correct-password"});
```

It issues a token for the registered user:

```cpp id="a5x9vr"
auto token = auth.issue_token(
    registered.value().id());
```

Then it prints token metadata:

```cpp id="f2q7ka"
rix.debug.print("user id:", token.value().user_id());
rix.debug.print("issuer:", token.value().issuer());
rix.debug.print("issued at:", token.value().issued_at());
rix.debug.print("expires at:", token.value().expires_at());
```

## Issue a token

Use:

```cpp id="c4v8mx"
auto token = auth.issue_token(user_id);
```

The `user_id` must identify a valid user.

A token result contains a token value on success.

Check the result before using it:

```cpp id="n9q5hd"
if (token.failed())
{
  const auto &error = token.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message());

  return 1;
}
```

Then access:

```cpp id="b7m3qc"
token.value()
```

## Token fields

A token contains:

```txt id="j4x8na"
value
user id
issuer
issued timestamp
expiration timestamp
revocation state
```

In examples, it is safe to print metadata such as issuer and timestamps.

Avoid printing the raw token value in production logs.

## Token value is sensitive

The raw token value is sensitive.

Avoid logging:

```cpp id="w8k2qa"
token.value().value()
```

In production, do not print raw token values, passwords, password hashes, or session ids.

This example prints only:

```txt id="p6c9vx"
user id
issuer
issued at
expires at
```

## Token issuer

The issuer identifies the auth system that created the token.

By default:

```txt id="v5n8rp"
rix/auth
```

Read it with:

```cpp id="m2x7qc"
token.value().issuer()
```

You can configure the issuer through auth config:

```cpp id="h3q8vf"
auto config = rix.auth.config.development();

config.set_issuer("my-app");

auto auth = rix.auth.memory(config);
```

## Token expiration

Tokens are short-lived.

Read the expiration timestamp with:

```cpp id="x7m4ha"
token.value().expires_at()
```

Read the issue timestamp with:

```cpp id="r9c5vd"
token.value().issued_at()
```

The timestamps are Unix timestamps in seconds.

## Token lifetime

Token lifetime is controlled by auth configuration:

```cpp id="q2v8mc"
auto config = rix.auth.config.development();

config.set_token_ttl_seconds(60 * 15);

auto auth = rix.auth.memory(config);
```

This creates tokens that last 15 minutes.

Session lifetime is separate:

```cpp id="k5x9qa"
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
```

The token can be short-lived while the server-side session lasts longer.

## Complete custom token lifetime example

```cpp id="s6n4vm"
#include <rix.hpp>

int main()
{
  auto config = rix.auth.config.development();

  config.set_token_ttl_seconds(60 * 5);
  config.set_issuer("rix/auth/example");

  auto auth = rix.auth.memory(config);

  auto registered = auth.register_user({
      "linus@example.com",
      "correct-password"});

  if (registered.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(registered.error()),
        registered.error().message());

    return 1;
  }

  auto token = auth.issue_token(
      registered.value().id());

  if (token.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(token.error()),
        token.error().message());

    return 1;
  }

  rix.debug.print("issuer:", token.value().issuer());
  rix.debug.print("expires at:", token.value().expires_at());

  return 0;
}
```

Run:

```bash id="v8q3md"
vix run token_issue.cpp
```

## Issue a token after login

A successful login already returns a token:

```cpp id="d9m5qx"
auto login = auth.login({
    "linus@example.com",
    "correct-password"});
```

Access it with:

```cpp id="m8x2vc"
login.value().token
```

Example:

```cpp id="a2r7kb"
auto login = auth.login({
    "linus@example.com",
    "correct-password"});

if (login.failed())
{
  return 1;
}

rix.debug.print(
    "login token issuer:",
    login.value().token.issuer());
```

Use `issue_token` when you need to issue a new token for an already known user id.

## Issue token for missing user

Issuing a token for a missing user should fail:

```cpp id="c8n3vy"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto token = auth.issue_token("missing-user");

  if (token.failed())
  {
    rix.debug.eprint(
        "expected auth error:",
        rix.auth.error.to_string(token.error()),
        token.error().message());

    return 0;
  }

  return 1;
}
```

Run:

```bash id="n6x9qa"
vix run token_issue.cpp
```

The failure is expected because the user does not exist.

## Check token usability

A token object can be checked at a given time:

```cpp id="y5q2md"
const auto now = token.value().issued_at();

if (token.value().usable(now))
{
  rix.debug.print("token is usable");
}
```

A usable token must be:

```txt id="k7m5xa"
valid
not revoked
not expired
```

## Check token ownership

Use:

```cpp id="b4v8qc"
token.value().belongs_to(user_id)
```

Example:

```cpp id="p3x7rn"
if (token.value().belongs_to(registered.value().id()))
{
  rix.debug.print("token belongs to user");
}
```

## Check token issuer

Use:

```cpp id="h9n2ka"
token.value().issued_by("rix/auth")
```

Example:

```cpp id="q6v8mx"
if (token.value().issued_by("rix/auth"))
{
  rix.debug.print("token issuer accepted");
}
```

## Revoke a token object

A token object can be revoked in memory:

```cpp id="t5c8vp"
auto value = token.value();

value.revoke();

if (!value.usable(value.issued_at()))
{
  rix.debug.print("token revoked");
}
```

This changes the token object.

It does not revoke every copy of that token in an external token store.

For durable token revocation in a real application, use an application-level store or token tracking strategy.

## Error handling pattern

Use this pattern for token operations:

```cpp id="r8q5wc"
auto result = auth.issue_token(user_id);

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

```cpp id="x4m9vd"
result.value()
```

Only after checking success.

## Use in a Vix project

Create a project:

```bash id="f7q3ma"
vix new rix-auth-token --app
cd rix-auth-token
```

Add Rix:

```bash id="n9x2qc"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="c5v8na"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="m6q4rd"
name = "rix-auth-token"
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

```txt id="v2k8xm"
src/main.cpp
```

Build and run:

```bash id="q9c5rd"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="k8m4xa"
vix run token_issue.cpp
```

If needed:

```bash id="h5n7vc"
vix install -g rix/rix
vix run token_issue.cpp
```

For project usage, prefer:

```bash id="x9q2va"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="d6m8qc"
deps = [
  "rix/rix",
]
```

## Use only auth with the facade

If you want the `rix.*` facade style but only want auth mounted, define the feature macro before including `rix.hpp`:

```cpp id="z4x7mq"
#define RIX_ENABLE_AUTH
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

  return token.ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp id="y8m3ka"
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto registered = auth.register_user({
      "linus@example.com",
      "correct-password"});

  if (registered.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(registered.error()),
        registered.error().message());

    return 1;
  }

  auto token = auth.issue_token(
      registered.value().id());

  if (token.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(token.error()),
        token.error().message());

    return 1;
  }

  rix.debug.print("token issued");
  return 0;
}
```

## Use the independent package

For independent usage, install:

```bash id="s5v9qa"
vix add rix/auth
vix install
```

In `vix.app`:

```txt id="p7n4xm"
deps = [
  "rix/auth",
]
```

Then include auth package headers directly.

The examples in this documentation prefer the public facade:

```cpp id="w3q8kc"
#include <rix.hpp>
```

and:

```cpp id="r6x2vd"
rix.auth
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="a8k5qx"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="f2v7mc"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="c9m4vx"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="m8q2za"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Calling `value()` before checking success

Wrong:

```cpp id="n5v8qc"
auto token = auth.issue_token(user_id);

rix.debug.print(token.value().issuer());
```

Correct:

```cpp id="q7x4ma"
auto token = auth.issue_token(user_id);

if (token.failed())
{
  return 1;
}

rix.debug.print(token.value().issuer());
```

### Printing raw token values

Avoid printing:

```cpp id="h6q9vx"
token.value().value()
```

The raw token value is sensitive.

Use metadata such as issuer and expiration in examples.

### Expecting tokens and sessions to be the same thing

A session is server-side authentication state.

A token is a short-lived value issued for a user.

They have separate lifetimes:

```cpp id="v8n3qb"
config.set_session_ttl_seconds(...);
config.set_token_ttl_seconds(...);
```

### Issuing a token for a missing user

This should fail:

```cpp id="k4m9xd"
auto token = auth.issue_token("missing-user");
```

Use a real user id from registration or login.

### Expecting memory auth to persist data

Memory auth does not persist users or sessions after the process exits.

Use database-backed stores for real applications.

## What you should remember

Create memory auth:

```cpp id="x3m7qa"
auto auth = rix.auth.memory();
```

Register a user:

```cpp id="n9q5vx"
auto registered = auth.register_user({
    "linus@example.com",
    "correct-password"});
```

Issue a token:

```cpp id="d2v8rc"
auto token = auth.issue_token(
    registered.value().id());
```

Check errors before using values:

```cpp id="b5x9ma"
if (token.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(token.error()),
      token.error().message());

  return 1;
}
```

Avoid logging raw token values.

For project usage:

```bash id="r4q8md"
vix add rix/rix
vix install
```

and keep:

```txt id="y7m2ka"
deps = [
  "rix/rix",
]
```

## Next step

Continue with PDF examples.

Next: [Basic PDF](../pdf/basic)
