# Register and Login

This page explains how to register users and authenticate them with `rix/auth`.

The examples use the public Rix facade:

```cpp id="qriq0k"
#include <rix.hpp>
```

and the Auth API through:

```cpp id="p2lcen"
rix.auth
```

Registration creates a user.

Login verifies the user credentials and creates an authenticated session.

## Basic flow

The normal flow is:

```txt id="a9f7zy"
register_user
  -> validate email and password
  -> hash password
  -> create user

login
  -> find user by email
  -> verify password
  -> create session
  -> issue token

authenticate_session
  -> validate session id
  -> reject expired or revoked sessions
```

## Complete example

Create a file:

```bash id="aax5on"
mkdir -p ~/rix-auth-register-login
cd ~/rix-auth-register-login
touch auth.cpp
```

Add:

```cpp id="pjusnv"
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth register and login ==");

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

```bash id="pvbz19"
vix run auth.cpp
```

If Rix is not available yet for single-file usage:

```bash id="qldx7p"
vix install -g rix/rix
vix run auth.cpp
```

## Register a user

Use:

```cpp id="f82nzm"
auto registered = auth.register_user({"ada@example.com", "correct-password"});
```

The request contains:

```cpp id="ku1s3b"
email
password
```

The password is plain text at the API boundary.

Rix Auth validates it and stores only a password hash in the user store.

A successful result contains a `User`:

```cpp id="lhnted"
registered.value().id()
registered.value().email()
registered.value().email_verified()
registered.value().active()
registered.value().created_at()
registered.value().updated_at()
```

Do not expose or log the password hash in application output.

## Check registration errors

Always check the result before using `.value()`:

```cpp id="zopjgz"
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
```

Common registration failures include:

```txt id="wyxsef"
InvalidEmail
InvalidPassword
UserAlreadyExists
StoreError
CryptoError
```

## Login a user

Use:

```cpp id="o0dfj2"
auto login = auth.login({"ada@example.com", "correct-password"});
```

A successful login contains:

```cpp id="eejtiz"
login.value().user
login.value().session
login.value().token
```

The user is the authenticated identity.

The session is the server-side authentication state.

The token is a short-lived value attached to the authenticated user.

## Check login errors

Always check the login result:

```cpp id="sdt34j"
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

Common login failures include:

```txt id="d6isog"
InvalidEmail
InvalidPassword
UserNotFound
InvalidCredentials
EmailVerificationRequired
UserDisabled
StoreError
```

For public login responses, avoid revealing whether the email exists.

The application can return a generic message such as:

```txt id="a1puz4"
Invalid email or password.
```

while logs can keep the internal error code for diagnostics.

## Read the login result

After a successful login:

```cpp id="okkcgp"
const auto &result = login.value();

rix.debug.print("user:", result.user.email());
rix.debug.print("session:", result.session.id());
rix.debug.print("token issuer:", result.token.issuer());
```

The session id and token value are sensitive.

In production, avoid logging:

```txt id="wrb0we"
session ids
raw token values
password hashes
plain-text passwords
```

## Authenticate a session

After login, use the session id to authenticate later requests:

```cpp id="g2s0wu"
auto session = auth.authenticate_session(login.value().session.id());
```

A successful result contains a usable `Session`:

```cpp id="nxb3me"
session.value().id()
session.value().user_id()
session.value().created_at()
session.value().expires_at()
session.value().last_seen_at()
session.value().revoked()
```

A session is usable when it is:

```txt id="mvvv2f"
valid
not revoked
not expired
```

## Failed login example

Change the password:

```cpp id="ao5ec6"
auto login = auth.login({"ada@example.com", "wrong-password"});
```

Then run again:

```bash id="w521jz"
vix run auth.cpp
```

The login should fail.

This is expected.

Invalid credentials are normal authentication failures and are returned through the result object.

## Duplicate registration example

If you register the same email twice:

```cpp id="da6u3e"
auto first = auth.register_user({"ada@example.com", "correct-password"});
auto second = auth.register_user({"ada@example.com", "correct-password"});
```

The second registration should fail.

You can check the error:

```cpp id="v9ktrf"
if (second.failed())
{
  const auto &error = second.error();

  if (rix.auth.error.is(
          error,
          rixlib::auth::AuthErrorCode::UserAlreadyExists
      ))
  {
    rix.debug.eprint("user already exists");
  }
}
```

## Use a custom configuration

Registration and login use the active Auth configuration.

Example:

```cpp id="ahfsqo"
auto config = rix.auth.config.development();

config.set_min_password_length(10);
config.set_issuer("my-app");

auto auth = rix.auth.memory(config);
```

Now passwords shorter than the configured minimum length are rejected.

For real applications, start from production configuration:

```cpp id="mcvka9"
auto config = rix.auth.config.production();
auto auth = rix.auth.database(db, config);
```

## Email verification

Production configuration can require verified email addresses before login:

```cpp id="zowcwj"
auto config = rix.auth.config.production();
config.set_require_email_verification(true);
auto auth = rix.auth.memory(config);
```

If the user is not verified, login can fail with:

```txt id="dyvoth"
EmailVerificationRequired
```

The user model exposes:

```cpp id="abqyff"
user.email_verified()
user.set_email_verified(true)
```

In a real application, email verification is usually handled by a higher-level flow around Auth.

## Inactive users

Auth can reject inactive users:

```cpp id="twjc03"
auto config = rix.auth.config.production();
config.set_reject_inactive_users(true);
```

The user model exposes:

```cpp id="yigc31"
user.active()
user.set_active(false)
```

If an inactive user tries to login, Auth can return:

```txt id="ok6sqh"
UserDisabled
```

## Memory store behavior

The examples use:

```cpp id="djx0ks"
auto auth = rix.auth.memory();
```

This keeps users and sessions in memory.

That means:

```txt id="pt7bhm"
data is lost when the process exits
it is useful for examples and tests
it is not durable
```

Use memory auth for learning and test scenarios.

Use database auth when users and sessions must persist.

## Database-backed login

For real applications:

```cpp id="s5iswb"
auto config = rix.auth.config.production();
auto auth = rix.auth.database(db, config);
```

Database auth uses database-backed user and session stores.

The tables are created by the database store layer when schema creation is enabled.

Use database auth when authentication data must survive restarts.

## Error handling pattern

Use the same pattern for every Auth operation.

For result-returning operations:

```cpp id="zcagwe"
auto result = auth.login({"ada@example.com", "correct-password"});

if (result.failed())
{
  const auto &error = result.error();
  return 1;
}

auto value = result.value();
```

For status-returning operations:

```cpp id="c4o7om"
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

Do not call `.value()` before checking `ok()` or `failed()`.

## What you should remember

Register a user:

```cpp id="all0iz"
auto registered = auth.register_user({"ada@example.com", "correct-password"});
```

Login:

```cpp id="atbh0h"
auto login = auth.login({"ada@example.com", "correct-password"});
```

Authenticate the session:

```cpp id="fe6e2m"
auto session = auth.authenticate_session(login.value().session.id());
```

Always check:

```cpp id="tr5l57"
result.failed()
```

before using:

```cpp id="q33dq4"
result.value()
```

Use memory auth for examples.

Use database auth for durable applications.

## Next step

Learn password hashing directly.

Next: [Password Hashing](./password-hashing)
