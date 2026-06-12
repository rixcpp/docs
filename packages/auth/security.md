# Security

This page explains security practices for `rix/auth`.

The examples use the public Rix facade:

```cpp id="ri3c7m"
#include <rix.hpp>
```

and Auth through:

```cpp id="xksshl"
rix.auth
```

`rix/auth` gives applications authentication building blocks: password hashing, user storage, sessions, tokens, configuration, and explicit errors.

Security still depends on how the application uses those building blocks.

## Basic rule

For examples and tests:

```cpp id="l63kcb"
auto auth = rix.auth.memory();
```

For real applications:

```cpp id="q0pbxh"
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Memory auth is useful for learning.

Database auth is the right direction when users and sessions must persist.

## Do not log secrets

Never log:

```txt id="zdlpoa"
plain-text passwords
password hashes
session ids
raw token values
```

These values are authentication secrets.

They must not appear in production logs, debug output, public responses, metrics, traces, or crash reports.

## Passwords

Passwords enter the Auth API as plain text:

```cpp id="i1ird9"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"
});
```

Rix Auth validates the password and stores a password hash.

Application code should not store the plain-text password.

Application code should not send the password hash to clients.

Application code should not log either value.

## Password hashing

Rix Auth hashes passwords during registration.

You can also use the password helpers directly:

```cpp id="pngz81"
auto hashed = rix.auth.password.hash("correct-password");
```

Always check the result:

```cpp id="p2xrwy"
if (hashed.failed())
{
  const auto &error = hashed.error();
  return 1;
}
```

Store:

```cpp id="iuc5l4"
hashed.value()
```

Do not store the plain-text password.

## Password policy

Password policy is controlled by Auth configuration.

For production:

```cpp id="a0o3ai"
auto config = rix.auth.config.production();

config.set_min_password_length(12);
```

Use a minimum password length that fits the application security policy.

Do not weaken the password policy for production just to make testing easier.

For tests, use development configuration:

```cpp id="6xs7vc"
auto config = rix.auth.config.development();
```

## Production configuration

Start real applications with:

```cpp id="rmj5bd"
auto config = rix.auth.config.production();
```

Then customize only what your application needs:

```cpp id="sq8w79"
config.set_issuer("my-app");
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
config.set_token_ttl_seconds(60 * 10);
```

Use production configuration with database auth:

```cpp id="nymlrt"
auto auth = rix.auth.database(db, config);
```

## Validate configuration

If configuration comes from environment variables, files, admin panels, or deployment settings, validate it before creating Auth.

```cpp id="4agmwm"
auto status = rix.auth.config.validate(config);

if (status.failed())
{
  const auto &error = status.error();
  rix.debug.eprint(
      "config error:",
      rix.auth.error.to_string(error),
      error.message()
  );
  return 1;
}
```

Invalid configuration should fail at startup instead of failing later during authentication.

## Session ids

Session ids are sensitive.

A session id proves access to a server-side authenticated session.

Do not log session ids in production:

```cpp id="zak8zn"
// Avoid this in production.
rix.debug.print("session:", login.value().session.id());
```

For local examples, printing session ids can help explain the flow.

For real applications, avoid it.

## Session lifetime

Session lifetime is controlled with:

```cpp id="s21l7d"
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
```

Choose a lifetime that matches the application.

Longer sessions are more convenient.

Shorter sessions reduce the time a stolen session can be used.

Use logout to revoke sessions:

```cpp id="zlx19h"
auto status = auth.logout(session_id);
```

Use logout all when every session for a user must be revoked:

```cpp id="0fajbf"
auto status = auth.logout_user(user_id);
```

## Session revocation

Logout revokes a session.

A revoked session remains stored but cannot be used.

```cpp id="7hja36"
auto logout = auth.logout(session_id);

if (logout.failed())
{
  const auto &error = logout.error();
  return 1;
}
```

After logout, authentication should fail:

```cpp id="nttqzh"
auto session = auth.authenticate_session(session_id);

if (session.ok())
{
  return 1;
}
```

Use revocation instead of deleting the user.

## Logout all sessions

Use `logout_user` when all sessions must be invalidated.

Common cases:

```txt id="tcr10d"
password changed
account disabled
user clicks logout from all devices
security incident detected
administrator disables access
```

Example:

```cpp id="nixei8"
auto status = auth.logout_user(user_id);

if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

## Tokens

Tokens are short-lived authentication values attached to a user.

A token is returned during login:

```cpp id="2n01xc"
login.value().token
```

You can also issue one directly:

```cpp id="jmibqr"
auto token = auth.issue_token(user_id);
```

The raw token value is sensitive:

```cpp id="m2179q"
token.value().value()
```

Do not log it in production.

## Token lifetime

Token lifetime is controlled with:

```cpp id="x4v5hd"
config.set_token_ttl_seconds(60 * 10);
```

Keep token lifetimes short for real applications.

A short-lived token limits the time a stolen token can be used.

## Token issuer

Set a stable issuer for the application:

```cpp id="fku77a"
config.set_issuer("my-app");
```

The issuer appears on issued tokens:

```cpp id="jlyaui"
token.value().issuer()
```

Use a name that identifies your application or service.

Avoid empty issuers.

Configuration validation rejects empty issuers.

## Memory auth security

Memory auth still uses password hashing and the configured password policy.

But memory auth is not durable.

Data disappears when the process exits.

Use memory auth for:

```txt id="ro8tk0"
examples
tests
local experiments
temporary tools
```

Do not use memory auth as permanent storage for real users.

## Database auth security

Use database auth for real applications:

```cpp id="hr9vnj"
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Database auth persists:

```txt id="vz47pm"
users
password hashes
sessions
revocation state
timestamps
```

Protect the database like sensitive authentication infrastructure.

Do not expose auth tables publicly.

Back up and migrate them carefully.

## Email verification

Production configuration can require email verification before login:

```cpp id="mq39xj"
config.set_require_email_verification(true);
```

If enabled, users whose email is not verified cannot login.

The user model exposes:

```cpp id="vw76wa"
user.email_verified()
user.set_email_verified(true)
```

The email verification flow itself belongs to the application.

`rix/auth` provides the state and login rejection behavior.

## Inactive users

You can reject inactive users:

```cpp id="x18e93"
config.set_reject_inactive_users(true);
```

The user model exposes:

```cpp id="o2e18u"
user.active()
user.set_active(false)
```

When inactive user rejection is enabled, disabled accounts cannot login.

Use this for account suspension, admin disable actions, or security lockout flows.

## Public login responses

Do not reveal too much information during login.

Internally, Auth may return errors such as:

```txt id="w665b6"
UserNotFound
InvalidCredentials
InvalidPassword
UserDisabled
EmailVerificationRequired
```

For public login forms, prefer a generic message:

```txt id="xo99yd"
Invalid email or password.
```

This avoids exposing whether an email address exists.

You can still use the stable internal error code for logs and diagnostics.

## Registration responses

Registration can fail with:

```txt id="pkc5f5"
InvalidEmail
InvalidPassword
UserAlreadyExists
StoreError
CryptoError
```

Depending on your product policy, it may be acceptable to tell the user that an email is already registered.

For higher privacy, use a more generic response and send account recovery instructions separately.

## Store errors

Database-backed auth can fail with `StoreError`.

Do not send raw internal database failure details to public clients.

Instead:

```txt id="uownpa"
public response: Something went wrong.
internal logs: stable error code and diagnostic message
```

For examples, printing the message is fine.

For production, use the Vix logging system and avoid secrets.

## Error handling

Always check results before using values.

Correct:

```cpp id="t3puwz"
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

```cpp id="bxwwfl"
auto login = auth.login({
    "ada@example.com",
    "correct-password"
});

auto user = login.value().user;
```

The wrong version assumes success.

## HTTP application pattern

In a Vix HTTP application, the shape is usually:

```txt id="5l49yj"
read request
validate input
call rix.auth
map Auth errors to public HTTP responses
avoid exposing secrets
attach authenticated user id to request context
```

Example error mapping:

```txt id="ojhpo7"
InvalidCredentials -> 401
SessionExpired     -> 401
SessionRevoked     -> 401
UserDisabled       -> 403
InvalidPassword    -> 400
UserAlreadyExists  -> 409
StoreError         -> 500
```

Keep public messages simple.

Keep detailed diagnostics internal.

## Example: safe login handling

```cpp id="qhkm0c"
auto login = auth.login({
    email,
    password
});

if (login.failed())
{
  const auto &error = login.error();

  if (rix.auth.error.is(
          error,
          rixlib::auth::AuthErrorCode::InvalidCredentials) ||
      rix.auth.error.is(
          error,
          rixlib::auth::AuthErrorCode::UserNotFound)
      )
  {
    /*
     * Public response:
     * Invalid email or password.
     */
    return 1;
  }

  /*
   * Internal diagnostic:
   * rix.auth.error.to_string(error)
   * error.message()
   */
  return 1;
}
```

## Example: safe session handling

```cpp id="ch13vz"
auto session = auth.authenticate_session(session_id);

if (session.failed())
{
  const auto &error = session.error();

  if (rix.auth.error.is(
          error,
          rixlib::auth::AuthErrorCode::SessionExpired) ||
      rix.auth.error.is(
          error,
          rixlib::auth::AuthErrorCode::SessionRevoked) ||
      rix.auth.error.is(
          error,
          rixlib::auth::AuthErrorCode::InvalidSession)
      )
  {
    /*
     * Public response:
     * Please login again.
     */
    return 1;
  }

  return 1;
}
```

## Debug output vs application logs

Use `rix.debug` for examples and local debug output:

```cpp id="olx7fb"
rix.debug.eprint(
    "auth error:",
    rix.auth.error.to_string(error),
    error.message()
);
```

For real application logging, prefer the Vix logging system.

Avoid logging secrets in both cases.

## Security checklist

Before using Auth in production, check:

```txt id="drs2xm"
production configuration is used
database auth is used
configuration is validated at startup
password policy is not weakened
token lifetime is short
session lifetime is intentional
issuer is stable and not empty
session ids are not logged
raw token values are not logged
password hashes are not sent to clients
login errors do not reveal account existence
logout revokes sessions
logout_user is used for account security events
HTTPS is used in deployment
```

## What you should remember

Use memory auth for examples:

```cpp id="jcv9d3"
auto auth = rix.auth.memory();
```

Use database auth for real applications:

```cpp id="qwmlo0"
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Never log:

```txt id="ehnvps"
plain-text passwords
password hashes
session ids
raw token values
```

Use generic public login errors.

Use stable error codes internally.

Use logout to revoke one session.

Use logout_user to revoke every session for a user.

Validate configuration before use when it is loaded from outside the code.

## Next step

Review the Auth API reference.

Next: [API Reference](./api-reference)
