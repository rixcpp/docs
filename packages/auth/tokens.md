# Tokens

This page explains how tokens work in `rix/auth`.

The examples use the public Rix facade:

```cpp
#include <rix.hpp>
```

and the Auth API through:

```cpp
rix.auth
```

A token is a short-lived authentication value attached to a user.

Tokens are created during login and can also be issued directly for a user.

## Token flow

The normal token flow is:

```txt
login
  -> authenticate user credentials
  -> create session
  -> issue token

issue_token
  -> create a short-lived token for a user

token model
  -> stores token value
  -> stores user id
  -> stores issuer
  -> stores issued_at
  -> stores expires_at
  -> stores revoked state
```

Rix Auth currently exposes token creation and token model helpers.

Session authentication is still done with server-side sessions.

## Complete example

Create a file:

```bash
mkdir -p ~/rix-auth-tokens
cd ~/rix-auth-tokens
touch tokens.cpp
```

Add:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth tokens ==");

  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"linus@example.com", "correct-password"});

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

  auto token = auth.issue_token(registered.value().id());

  if (token.failed())
  {
    const auto &error = token.error();
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message()
    );
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

```bash
vix run tokens.cpp
```

If Rix is not available yet for single-file usage:

```bash
vix install -g rix/rix
vix run tokens.cpp
```

## Expected output

The output should look like this:

```txt
== rix/auth tokens ==
OK: token issued
user id: user_...
issuer: rix/auth
issued at: ...
expires at: ...
```

The exact user id and timestamps will be different.

The raw token value is intentionally not printed in this example.

## Token from login

A successful login returns a token together with the user and session:

```cpp
auto login = auth.login({"ada@example.com", "correct-password"});
```

After checking the result:

```cpp
if (login.failed())
{
  const auto &error = login.error();
  return 1;
}
```

You can access:

```cpp
login.value().token
```

The login result contains:

```cpp
login.value().user
login.value().session
login.value().token
```

The user contains the authenticated identity.

The session represents server-side login state.

The token is a short-lived value attached to the user.

## Issue a token directly

Use:

```cpp
auto token = auth.issue_token(user_id);
```

Example:

```cpp
auto token = auth.issue_token(registered.value().id());

if (token.failed())
{
  const auto &error = token.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message()
  );

  return 1;
}
```

A successful result contains a `Token`.

## Token fields

A token stores:

```txt
value
user_id
issuer
issued_at
expires_at
revoked
```

Read token fields:

```cpp
token.value().value()
token.value().user_id()
token.value().issuer()
token.value().issued_at()
token.value().expires_at()
token.value().revoked()
```

The token value is sensitive.

Do not log raw token values in production.

## Token issuer

The issuer comes from Auth configuration:

```cpp
auto config = rix.auth.config.development();

config.set_issuer("my-app");

auto auth = rix.auth.memory(config);
```

Tokens issued by this auth service will use:

```cpp
token.value().issuer()
```

to expose the configured issuer.

The default issuer is:

```txt
rix/auth
```

## Token lifetime

Token lifetime is controlled by Auth configuration.

Set token lifetime in seconds:

```cpp
auto config = rix.auth.config.development();

config.set_token_ttl_seconds(60 * 15);

auto auth = rix.auth.memory(config);
```

This example sets a fifteen-minute token lifetime.

Production configuration uses a short token lifetime by default.

## Short token example

For tests, you can use a very short lifetime:

```cpp
auto config = rix.auth.config.development();

config.set_token_ttl_seconds(60);

auto auth = rix.auth.memory(config);
```

This creates tokens that expire after one minute.

Short lifetimes are useful for tests and examples.

Use production settings for real deployments.

## Token model helpers

The token model exposes helper methods:

```cpp
token.valid()
token.has_value()
token.has_user_id()
token.belongs_to(user_id)
token.matches(raw_value)
token.issued_by(issuer)
token.expired(now)
token.usable(now)
token.revoked()
```

Example:

```cpp
const auto &value = token.value();

if (value.issued_by("rix/auth"))
{
  rix.debug.print("issuer is valid");
}
```

Another example:

```cpp
if (value.belongs_to(registered.value().id()))
{
  rix.debug.print("token belongs to user");
}
```

## Token expiration

A token is expired when the current time is greater than or equal to its expiration timestamp.

The model helper is:

```cpp
token.expired(now)
```

A token is usable when it is:

```txt
valid
not revoked
not expired
```

The model helper is:

```cpp
token.usable(now)
```

Most application code should avoid manually trusting token values without a higher-level validation flow.

Use the token helpers when writing tests, integrations, or future token validation code.

## Token revocation

The token model supports revocation:

```cpp
auto value = token.value();

value.revoke();
```

After revocation:

```cpp
value.revoked()
```

returns true.

A revoked token is not usable:

```cpp
value.usable(now)
```

returns false.

## Error handling

Token issuing returns an explicit result:

```cpp
auto token = auth.issue_token(user_id);

if (token.failed())
{
  const auto &error = token.error();
}
```

Use the facade error helper:

```cpp
rix.auth.error.to_string(error)
```

Use the error message for diagnostics:

```cpp
error.message()
```

Example:

```cpp
if (token.failed())
{
  const auto &error = token.error();

  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message()
  );

  return 1;
}
```

## Common token errors

Token operations can fail with errors such as:

```txt
InvalidInput
InvalidToken
TokenExpired
TokenRevoked
StoreError
CryptoError
Unknown
```

Use stable error codes for programmatic decisions.

Use messages for diagnostics.

## Token security

Treat token values as secrets.

Avoid logging:

```txt
raw token values
session ids
password hashes
plain-text passwords
```

Do not expose token values in debug output.

Do not store raw token values in places that should not contain authentication secrets.

Use short token lifetimes for real applications.

Use HTTPS in real deployments.

## Tokens and sessions

Login returns both a session and a token:

```cpp
login.value().session
login.value().token
```

The session is server-side state.

The token is a short-lived value attached to the authenticated user.

Use sessions when the application needs server-side revocation and persistent login state.

Use tokens when the application needs a short-lived authentication value.

## Complete login token example

```cpp
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"ada@example.com", "correct-password"});

  if (registered.failed())
  {
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

  const auto &token = login.value().token;

  rix.debug.print("token issued");
  rix.debug.print("user id:", token.user_id());
  rix.debug.print("issuer:", token.issuer());
  rix.debug.print("expires at:", token.expires_at());

  return 0;
}
```

Run it:

```bash
vix run tokens.cpp
```

## What you should remember

Login returns a token:

```cpp
login.value().token
```

You can issue a token directly:

```cpp
auto token = auth.issue_token(user_id);
```

A token contains:

```cpp
token.value().user_id()
token.value().issuer()
token.value().issued_at()
token.value().expires_at()
```

The raw token value is sensitive:

```cpp
token.value().value()
```

Do not log it in production.

Token lifetime is configured with:

```cpp
config.set_token_ttl_seconds(...)
```

Token issuer is configured with:

```cpp
config.set_issuer(...)
```

Always check results before using `.value()`.

## Next step

Learn how to configure Auth.

Next: [Configuration](./configuration)
