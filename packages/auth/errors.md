# Errors

This page explains how errors work in `rix/auth`.

The examples use the public Rix facade:

```cpp id="4wl0dm"
#include <rix.hpp>
```

and Auth error helpers through:

```cpp id="8rbxce"
rix.auth.error
```

Rix Auth uses explicit errors for normal authentication failures.

It does not use exceptions for expected authentication cases such as invalid credentials, invalid passwords, duplicate users, expired sessions, or revoked sessions.

## Basic idea

Operations that return data use result objects:

```cpp id="d973nw"
auto login = auth.login({
    "ada@example.com",
    "wrong-password"
});
```

Check the result:

```cpp id="tgxofn"
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

Operations that only return success or failure use status objects:

```cpp id="g5i0kz"
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message()
  );
  return 1;
}
```

## Result and status types

Auth uses two main patterns:

```txt id="20sgot"
AuthResult<T>
AuthStatus
```

`AuthResult<T>` is used when an operation returns data.

Examples:

```cpp id="z3w6cq"
AuthResult<User>
AuthResult<LoginResult>
AuthResult<Session>
AuthResult<Token>
AuthResult<std::string>
```

`AuthStatus` is used when an operation only returns success or failure.

Examples:

```cpp id="y8v693"
logout(...)
logout_user(...)
store.update(...)
store.remove_by_id(...)
store.revoke_by_id(...)
```

## Complete example

Create a file:

```bash id="q1t9z4"
mkdir -p ~/rix-auth-errors
cd ~/rix-auth-errors
touch errors.cpp
```

Add:

```cpp id="uy6hu4"
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth errors ==");

  auto auth = rix.auth.memory();
  auto registered = auth.register_user({
      "ada@example.com",
      "correct-password"
  });

  if (registered.failed())
  {
    const auto &error = registered.error();
    rix.debug.eprint(
        "registration error:",
        rix.auth.error.to_string(error),
        error.message()
    );
    return 1;
  }

  auto duplicate = auth.register_user({
      "ada@example.com",
      "correct-password"
  });

  if (duplicate.failed())
  {
    const auto &error = duplicate.error();

    rix.debug.print("----------------------------------------");
    rix.debug.print("duplicate registration failed as expected");
    rix.debug.print("code:", rix.auth.error.to_string(error));
    rix.debug.print("message:", error.message());
  }

  auto login = auth.login({
      "ada@example.com",
      "wrong-password"
  });

  if (login.failed())
  {
    const auto &error = login.error();

    rix.debug.print("----------------------------------------");
    rix.debug.print("login failed as expected");
    rix.debug.print("code:", rix.auth.error.to_string(error));
    rix.debug.print("message:", error.message());
  }

  auto session = auth.authenticate_session("missing-session");

  if (session.failed())
  {
    const auto &error = session.error();

    rix.debug.print("----------------------------------------");
    rix.debug.print("session rejected as expected");
    rix.debug.print("code:", rix.auth.error.to_string(error));
    rix.debug.print("message:", error.message());
  }

  return 0;
}
```

Run it:

```bash id="vw3z76"
vix run errors.cpp
```

If Rix is not available yet for single-file usage:

```bash id="eisr3a"
vix install -g rix/rix
vix run errors.cpp
```

## Expected output

The output should look like this:

```txt id="on0t3a"
== rix/auth errors ==
----------------------------------------
duplicate registration failed as expected
code: UserAlreadyExists
message: User already exists.
----------------------------------------
login failed as expected
code: InvalidCredentials
message: Invalid credentials.
----------------------------------------
session rejected as expected
code: InvalidSession
message: Session not found.
```

The exact messages can evolve, but the error pattern stays the same.

## Error object

An Auth error contains:

```txt id="0p2204"
code
message
```

The code is stable and useful for programmatic decisions.

The message is human-readable and useful for diagnostics.

Example:

```cpp id="45pczc"
const auto &error = login.error();

auto code = error.code();
auto message = error.message();
```

Convert the code to a stable string:

```cpp id="wbf85x"
rix.auth.error.to_string(error)
```

or:

```cpp id="ea6c89"
rix.auth.error.to_string(error.code())
```

## Check success or failure

An error can be checked directly:

```cpp id="o37m89"
bool ok = rix.auth.error.ok(error);
bool failed = rix.auth.error.failed(error);
```

The error object also exposes:

```cpp id="tla5yy"
error.ok()
error.has_error()
```

For normal Auth operations, prefer checking the result or status:

```cpp id="23369h"
if (login.failed())
{
  const auto &error = login.error();
}
```

## Check a specific error code

Use:

```cpp id="frtfyt"
rix.auth.error.is(error, rixlib::auth::AuthErrorCode::InvalidCredentials)
```

Example:

```cpp id="owje4e"
if (login.failed())
{
  const auto &error = login.error();

  if (rix.auth.error.is(
          error,
          rixlib::auth::AuthErrorCode::InvalidCredentials
      ))
  {
    rix.debug.eprint("Invalid email or password.");
  }
}
```

Use this when the application needs different behavior for different errors.

## Create an error

You can create an error manually:

```cpp id="z9v0mj"
auto error = rix.auth.error.make(
    rixlib::auth::AuthErrorCode::InvalidInput,
    "Invalid input."
);
```

Create a success error value:

```cpp id="b7i9pa"
auto ok = rix.auth.error.none();
```

Most application code receives errors from Auth operations instead of creating them manually.

Manual creation is useful for tests, custom stores, and integrations.

## Error codes

`rix/auth` exposes stable error codes through:

```cpp id="czuhqg"
rixlib::auth::AuthErrorCode
```

Current codes:

```txt id="i54sqw"
None

InvalidInput
InvalidState
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

## Common registration errors

Registration can fail with:

```txt id="6yv21w"
InvalidInput
InvalidEmail
InvalidPassword
UserAlreadyExists
StoreError
CryptoError
ValidationError
ConfigurationError
```

Example:

```cpp id="u5j1nk"
auto registered = auth.register_user({
    "not-an-email",
    "short"
});

if (registered.failed())
{
  const auto &error = registered.error();

  rix.debug.eprint(
      "registration failed:",
      rix.auth.error.to_string(error),
      error.message()
  );
}
```

## Common login errors

Login can fail with:

```txt id="bqkm3p"
InvalidEmail
InvalidPassword
UserNotFound
InvalidCredentials
EmailVerificationRequired
UserDisabled
StoreError
```

For public application responses, avoid revealing whether the email exists.

Use a generic public message:

```txt id="mx88xk"
Invalid email or password.
```

Keep the stable error code for logs and diagnostics.

## Common session errors

Session operations can fail with:

```txt id="i6egcy"
InvalidSession
SessionExpired
SessionRevoked
StoreError
InvalidInput
```

Example:

```cpp id="y2me24"
auto session = auth.authenticate_session(session_id);

if (session.failed())
{
  const auto &error = session.error();

  if (rix.auth.error.is(
          error,
          rixlib::auth::AuthErrorCode::SessionExpired))
  {
    rix.debug.eprint("session expired");
  }
}
```

## Common token errors

Token operations can fail with:

```txt id="p7co2y"
InvalidInput
InvalidToken
TokenExpired
TokenRevoked
StoreError
CryptoError
Unknown
```

Example:

```cpp id="gst3h3"
auto token = auth.issue_token(user_id);

if (token.failed())
{
  const auto &error = token.error();
  rix.debug.eprint(
      "token error:",
      rix.auth.error.to_string(error),
      error.message()
  );
}
```

## Common configuration errors

Configuration validation can fail with:

```txt id="jt0xya"
ConfigurationError
```

Example:

```cpp id="103zfp"
auto config = rix.auth.config.development();

config.set_min_password_length(20);
config.set_max_password_length(8);

auto status = rix.auth.config.validate(config);

if (status.failed())
{
  const auto &error = status.error();

  rix.debug.eprint(
      "config error:",
      rix.auth.error.to_string(error),
      error.message()
  );
}
```

## Common store errors

Store operations can fail with:

```txt id="yc14jo"
StoreError
InvalidInput
InvalidState
UserNotFound
UserAlreadyExists
InvalidSession
```

`StoreError` usually means the storage backend failed.

For memory stores, this is uncommon.

For database stores, this can happen when the database operation fails.

Use the message for diagnostics.

## Result pattern

Operations that return values must be checked before `.value()` is used.

Correct:

```cpp id="sly8mz"
auto login = auth.login({
    "ada@example.com",
    "correct-password"
});

if (login.failed())
{
  const auto &error = login.error();
  return 1;
}

auto user = login.value().user;
```

Wrong:

```cpp id="0rreub"
auto login = auth.login({
    "ada@example.com",
    "correct-password"
});

auto user = login.value().user;
```

The wrong version assumes success before checking the result.

## Status pattern

Status-only operations are checked in the same way:

```cpp id="qxv4wb"
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

You can also use `ok()`:

```cpp id="4qrye1"
if (status.ok())
{
  rix.debug.print("logout successful");
}
```

## Boolean conversion

Results and statuses can be used in boolean contexts:

```cpp id="28tcc8"
if (login)
{
  rix.debug.print("login ok");
}
```

and:

```cpp id="v3im9s"
if (!status)
{
  rix.debug.eprint("operation failed");
}
```

For documentation and clarity, prefer:

```cpp id="b0bxd4"
login.failed()
login.ok()
status.failed()
status.ok()
```

## Public API responses

In an HTTP application, do not expose every internal detail.

For login, prefer a generic response:

```txt id="5bb21b"
Invalid email or password.
```

even if the internal error is:

```txt id="e8pgyj"
UserNotFound
InvalidCredentials
InvalidPassword
```

For registration, it is usually acceptable to tell the user that the email is already used, depending on your product policy.

For sessions, expired or revoked sessions should usually ask the user to login again.

## Debug output

For examples and local development:

```cpp id="v1xjho"
rix.debug.eprint(
    "auth error:",
    rix.auth.error.to_string(error),
    error.message()
);
```

For real application logging, prefer the Vix logging system.

Avoid logging secrets.

## Security notes

Never log:

```txt id="j1f1a1"
plain-text passwords
password hashes
session ids
raw token values
```

Be careful with login errors.

Avoid user enumeration by returning generic login messages.

Use stable error codes internally.

Use human-readable messages for diagnostics.

Do not send sensitive internal store errors directly to public clients.

## Complete helper function

A small helper can keep examples clean:

```cpp id="d60iea"
#include <rix.hpp>

static void print_auth_error(
    const char *label,
    const rixlib::auth::AuthError &error)
{
  rix.debug.eprint(
      label,
      rix.auth.error.to_string(error),
      error.message()
  );
}
```

Usage:

```cpp id="oxr9ql"
auto login = auth.login({
    "ada@example.com",
    "wrong-password"
});

if (login.failed())
{
  print_auth_error("login failed:", login.error());
  return 1;
}
```

## What you should remember

Check result-returning operations:

```cpp id="zzemc6"
if (result.failed())
{
  const auto &error = result.error();
}
```

Check status-returning operations:

```cpp id="d0j0oz"
if (status.failed())
{
  const auto &error = status.error();
}
```

Convert errors to stable strings:

```cpp id="u2l0xi"
rix.auth.error.to_string(error)
```

Check specific codes:

```cpp id="9dwo09"
rix.auth.error.is(
    error,
    rixlib::auth::AuthErrorCode::InvalidCredentials)
```

Use stable codes for program logic.

Use messages for diagnostics.

Do not call `.value()` before checking `ok()` or `failed()`.

## Next step

Learn Auth security practices.

Next: [Security](./security)
