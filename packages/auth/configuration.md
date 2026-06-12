# Configuration

This page explains how to configure `rix/auth`.

The examples use the public Rix facade:

```cpp
#include <rix.hpp>
```

and configuration helpers through:

```cpp
rix.auth.config
```

Auth configuration controls password policy, session lifetime, token lifetime, token issuer, email verification behavior, session rotation, and inactive user rejection.

## Basic idea

Create a configuration:

```cpp
auto config = rix.auth.config.development();
```

Update the values you need:

```cpp
config.set_min_password_length(10);
config.set_issuer("my-app");
```

Then pass the configuration to Auth:

```cpp
auto auth = rix.auth.memory(config);
```

For database-backed auth:

```cpp
auto auth = rix.auth.database(db, config);
```

## Development configuration

Development configuration is useful for examples, tests, local experiments, and small temporary tools.

```cpp
auto config = rix.auth.config.development();
```

Use it with memory auth:

```cpp
auto auth = rix.auth.memory(config);
```

Development configuration keeps local testing simple while still using the same Auth API.

## Production configuration

Production configuration is stricter and should be the starting point for real applications.

```cpp
auto config = rix.auth.config.production();
```

Use it with database auth:

```cpp
auto auth = rix.auth.database(db, config);
```

Production configuration is intended for durable applications where users and sessions must survive process restarts.

## Complete example

Create a file:

```bash
mkdir -p ~/rix-auth-configuration
cd ~/rix-auth-configuration
touch configuration.cpp
```

Add:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth configuration ==");

  auto config = rix.auth.config.development();

  config.set_min_password_length(10);
  config.set_max_password_length(1024);
  config.set_session_ttl_seconds(60 * 60 * 24 * 7);
  config.set_token_ttl_seconds(60 * 15);
  config.set_issuer("rix/auth/configuration-example");
  config.set_require_email_verification(false);
  config.set_rotate_sessions(true);
  config.set_reject_inactive_users(true);

  auto validation = rix.auth.config.validate(config);

  if (validation.failed())
  {
    const auto &error = validation.error();
    rix.debug.eprint(
        "config error:",
        rix.auth.error.to_string(error),
        error.message()
    );
    return 1;
  }

  auto auth = rix.auth.memory(config);
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

  rix.debug.print("registered:", registered.value().email());
  rix.debug.print("issuer:", login.value().token.issuer());
  rix.debug.print("session expires at:", login.value().session.expires_at());
  rix.debug.print("token expires at:", login.value().token.expires_at());

  return 0;
}
```

Run it:

```bash
vix run configuration.cpp
```

If Rix is not available yet for single-file usage:

```bash
vix install -g rix/rix
vix run configuration.cpp
```

## Expected output

The output should look like this:

```txt
== rix/auth configuration ==
registered: ada@example.com
issuer: rix/auth/configuration-example
session expires at: ...
token expires at: ...
```

The exact timestamps will be different.

## Password length

Set the minimum accepted password length:

```cpp
config.set_min_password_length(12);
```

Read it:

```cpp
config.min_password_length();
```

Set the maximum accepted password length:

```cpp
config.set_max_password_length(1024);
```

Read it:

```cpp
config.max_password_length();
```

The password must be within this range before it can be hashed or accepted during registration.

Example:

```cpp
auto config = rix.auth.config.development();

config.set_min_password_length(12);

auto auth = rix.auth.memory(config);

auto registered = auth.register_user({"ada@example.com", "short"});
```

This registration should fail because the password is shorter than the configured minimum length.

## Session lifetime

Session lifetime controls how long server-side sessions remain usable.

Set it in seconds:

```cpp
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
```

Read it:

```cpp
config.session_ttl_seconds();
```

This example uses seven days:

```txt
60 * 60 * 24 * 7
```

When a user logs in, the created session receives an expiration timestamp based on this value.

## Token lifetime

Token lifetime controls how long issued tokens remain usable.

Set it in seconds:

```cpp
config.set_token_ttl_seconds(60 * 15);
```

Read it:

```cpp
config.token_ttl_seconds();
```

This example uses fifteen minutes:

```txt
60 * 15
```

Tokens should normally be short-lived.

## Password hashing settings

Password hashing settings control how password hashes are generated.

Set the iteration count:

```cpp
config.set_password_hash_iterations(310000);
```

Read it:

```cpp
config.password_hash_iterations();
```

Set the salt size:

```cpp
config.set_password_salt_size(16);
```

Read it:

```cpp
config.password_salt_size();
```

Set the derived hash size:

```cpp
config.set_password_hash_size(32);
```

Read it:

```cpp
config.password_hash_size();
```

These values are used by password hashing during registration and direct password hashing.

## Issuer

The issuer is written into issued tokens.

Set it:

```cpp
config.set_issuer("my-app");
```

Read it:

```cpp
config.issuer();
```

Example:

```cpp
auto config = rix.auth.config.development();

config.set_issuer("pico");

auto auth = rix.auth.memory(config);

auto registered = auth.register_user({"ada@example.com", "correct-password"});

auto token = auth.issue_token(registered.value().id());
```

The token issuer is:

```cpp
token.value().issuer()
```

Use a stable issuer name for your application.

## Email verification requirement

You can require email verification before login:

```cpp
config.set_require_email_verification(true);
```

Read it:

```cpp
config.require_email_verification();
```

When this option is enabled, a user whose email is not verified cannot login.

The user model exposes:

```cpp
user.email_verified()
user.set_email_verified(true)
```

Email verification itself is usually handled by a higher-level application flow.

`rix/auth` provides the user state and login rejection behavior.

## Session rotation

Session rotation is controlled by:

```cpp
config.set_rotate_sessions(true);
```

Read it:

```cpp
config.rotate_sessions();
```

Session rotation is a security-oriented setting.

Keep it enabled for normal applications.

## Reject inactive users

You can reject inactive users during login:

```cpp
config.set_reject_inactive_users(true);
```

Read it:

```cpp
config.reject_inactive_users();
```

The user model exposes:

```cpp
user.active()
user.set_active(false)
```

If inactive users are rejected, login can fail with:

```txt
UserDisabled
```

This is useful when an account is disabled or blocked.

## Validate configuration

You can validate a configuration before using it:

```cpp
auto status = rix.auth.config.validate(config);

if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

You can also use a boolean helper:

```cpp
bool valid = rix.auth.config.valid(config);
```

Validation checks that required numeric values are usable and that the issuer is not empty.

## Invalid configuration example

This configuration is invalid:

```cpp
auto config = rix.auth.config.development();

config.set_min_password_length(20);
config.set_max_password_length(8);

auto status = rix.auth.config.validate(config);

if (status.failed())
{
  rix.debug.eprint(
      "config error:",
      rix.auth.error.to_string(status.error()),
      status.error().message()
  );
}
```

The minimum password length cannot be greater than the maximum password length.

## Shortcut helpers

Create development config with a custom minimum password length:

```cpp
auto config = rix.auth.config.development_with_min_password_length(10);
```

Create production config with a custom minimum password length:

```cpp
auto config = rix.auth.config.production_with_min_password_length(12);
```

These helpers are useful for short examples.

## Use configuration with memory auth

```cpp
auto config = rix.auth.config.development();

config.set_min_password_length(10);
config.set_issuer("local-example");

auto auth = rix.auth.memory(config);
```

Memory auth is useful for examples and tests.

The configuration still applies to registration, login, sessions, tokens, and password hashing.

## Use configuration with database auth

```cpp
auto config = rix.auth.config.production();

config.set_issuer("my-production-app");

auto auth = rix.auth.database(db, config);
```

Database auth is the recommended direction for real applications.

It persists users and sessions through database-backed stores.

## Configuration and password helpers

Password helpers can also receive configuration directly:

```cpp
auto config = rix.auth.config.production();

auto hashed = rix.auth.password.hash("correct-password", config);
```

Verify with the same policy:

```cpp
bool valid = rix.auth.password.verify("correct-password", hashed.value(), config);
```

Create a configured hasher:

```cpp
auto hasher = rix.auth.password.hasher(config);
```

This is useful when you need password hashing outside registration and login.

## Configuration fields

Auth configuration exposes these fields:

| Setting                    | Getter                         | Setter                                |
| -------------------------- | ------------------------------ | ------------------------------------- |
| Minimum password length    | `min_password_length()`        | `set_min_password_length(...)`        |
| Maximum password length    | `max_password_length()`        | `set_max_password_length(...)`        |
| Session lifetime           | `session_ttl_seconds()`        | `set_session_ttl_seconds(...)`        |
| Token lifetime             | `token_ttl_seconds()`          | `set_token_ttl_seconds(...)`          |
| Password hash iterations   | `password_hash_iterations()`   | `set_password_hash_iterations(...)`   |
| Password salt size         | `password_salt_size()`         | `set_password_salt_size(...)`         |
| Password hash size         | `password_hash_size()`         | `set_password_hash_size(...)`         |
| Token issuer               | `issuer()`                     | `set_issuer(...)`                     |
| Require email verification | `require_email_verification()` | `set_require_email_verification(...)` |
| Rotate sessions            | `rotate_sessions()`            | `set_rotate_sessions(...)`            |
| Reject inactive users      | `reject_inactive_users()`      | `set_reject_inactive_users(...)`      |

## Recommended starting points

For examples:

```cpp
auto config = rix.auth.config.development();
auto auth = rix.auth.memory(config);
```

For tests:

```cpp
auto config = rix.auth.config.development();

config.set_session_ttl_seconds(60);
config.set_token_ttl_seconds(60);

auto auth = rix.auth.memory(config);
```

For real applications:

```cpp
auto config = rix.auth.config.production();

config.set_issuer("my-app");

auto auth = rix.auth.database(db, config);
```

## Security notes

Use production configuration for real deployments.

Use database-backed auth for durable users and sessions.

Keep token lifetimes short.

Do not use empty issuers.

Do not weaken password policy for production.

Do not log passwords, password hashes, raw token values, or session ids.

## What you should remember

Create development config:

```cpp
auto config = rix.auth.config.development();
```

Create production config:

```cpp
auto config = rix.auth.config.production();
```

Set password policy:

```cpp
config.set_min_password_length(12);
```

Set session lifetime:

```cpp
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
```

Set token lifetime:

```cpp
config.set_token_ttl_seconds(60 * 15);
```

Set issuer:

```cpp
config.set_issuer("my-app");
```

Validate before use when configuration is user-defined:

```cpp
auto status = rix.auth.config.validate(config);
```

Pass the config into Auth:

```cpp
auto auth = rix.auth.memory(config);
```

or:

```cpp
auto auth = rix.auth.database(db, config);
```

## Next step

Learn memory-backed stores.

Next: [Memory Store](./memory-store)
