# Password Hashing

This page explains how to hash and verify passwords with `rix/auth`.

The examples use the public Rix facade:

```cpp
#include <rix.hpp>
```

and the password helpers through:

```cpp
rix.auth.password
```

Password hashing is used internally by registration and login.

You can also use it directly when you need to test password policy, hash a password, or verify a password against a stored hash.

## Basic example

Create a file:

```bash
mkdir -p ~/rix-auth-password-hashing
cd ~/rix-auth-password-hashing
touch password.cpp
```

Add:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth password hashing ==");

  const auto password = "correct-password";
  auto hashed = rix.auth.password.hash(password);

  if (hashed.failed())
  {
    const auto &error = hashed.error();
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message()
    );
    return 1;
  }

  const bool valid = rix.auth.password.verify(password,hashed.value());
  const bool invalid = rix.auth.password.verify("wrong-password",hashed.value());

  rix.debug.print("hash:", hashed.value());
  rix.debug.print("valid password:", valid ? "yes" : "no");
  rix.debug.print("wrong password:", invalid ? "yes" : "no");

  if (!valid || invalid)
  {
    rix.debug.eprint("ERROR:", "password verification failed");
    return 1;
  }

  rix.debug.print("OK:", "password verification successful");

  return 0;
}
```

Run it:

```bash
vix run password.cpp
```

If Rix is not available yet for single-file usage:

```bash
vix install -g rix/rix
vix run password.cpp
```

## Expected output

The output should look like this:

```txt
== rix/auth password hashing ==
hash: ...
valid password: yes
wrong password: no
OK: password verification successful
```

The hash value will be different between runs.

Password hashing uses random salt, so the same password should not produce the same encoded hash every time.

## Hash a password

Use:

```cpp
auto hashed = rix.auth.password.hash("correct-password");
```

Hashing returns an explicit result.

Always check the result before using `.value()`:

```cpp
if (hashed.failed())
{
  const auto &error = hashed.error();
  return 1;
}

auto password_hash = hashed.value();
```

The returned value is the encoded password hash.

Store the hash, not the plain-text password.

## Verify a password

Use:

```cpp
bool valid = rix.auth.password.verify("correct-password", password_hash);
```

`verify` returns `true` when the plain-text password matches the stored hash.

Example:

```cpp
const bool valid = rix.auth.password.verify("correct-password", hashed.value());
const bool invalid = rix.auth.password.verify("wrong-password", hashed.value());
```

The expected result is:

```txt
valid   -> true
invalid -> false
```

## Check password policy

Use:

```cpp
bool accepted = rix.auth.password.accepts("correct-password");
```

This checks whether the password satisfies the configured password length policy.

Example:

```cpp
const bool short_password = rix.auth.password.accepts("short");
const bool good_password = rix.auth.password.accepts("correct-password");
```

`accepts` does not hash the password.

It only checks whether the password is accepted by the password policy.

## Use a custom configuration

Password hashing can use an Auth configuration.

Example:

```cpp
auto config = rix.auth.config.development();

config.set_min_password_length(12);
config.set_max_password_length(1024);
config.set_password_hash_iterations(310000);
config.set_password_salt_size(16);
config.set_password_hash_size(32);

auto hashed = rix.auth.password.hash("correct-password", config);
```

Verify with the same configuration:

```cpp
bool valid = rix.auth.password.verify("correct-password",hashed.value(), config);
```

You can also check the policy with the same config:

```cpp
bool accepted = rix.auth.password.accepts("correct-password", config);
```

## Create a password hasher

For repeated operations, create a hasher:

```cpp
auto hasher = rix.auth.password.hasher();
auto hashed = hasher.hash("correct-password");
```

With custom configuration:

```cpp
auto config = rix.auth.config.production();
auto hasher = rix.auth.password.hasher(config);
auto hashed = hasher.hash("correct-password");
```

The hasher exposes the configured policy:

```cpp
hasher.min_password_length();
hasher.max_password_length();
hasher.iterations();
hasher.salt_size();
hasher.hash_size();
```

## Development vs production configuration

Development configuration is easier to use in examples:

```cpp
auto config = rix.auth.config.development();
```

Production configuration is stricter:

```cpp
auto config = rix.auth.config.production();
```

For real applications, start with production configuration:

```cpp
auto config = rix.auth.config.production();
auto auth = rix.auth.database(db, config);
```

Password settings are part of the Auth configuration because registration, login, and direct password hashing should follow the same policy.

## Password policy failures

Hashing can fail when the password does not satisfy the policy.

Example:

```cpp
auto hashed = rix.auth.password.hash("short");

if (hashed.failed())
{
  const auto &error = hashed.error();
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message()
  );

  return 1;
}
```

Common password hashing failures include:

```txt
InvalidPassword
CryptoError
```

`InvalidPassword` means the password was rejected by the policy.

`CryptoError` means the underlying hashing operation failed.

## Passwords during registration

When registering a user:

```cpp
auto registered = auth.register_user({"ada@example.com", "correct-password"});
```

Rix Auth hashes the password internally before storing the user.

The user store receives a user with a password hash.

Application code should not store the plain-text password.

## Passwords during login

When logging in:

```cpp
auto login = auth.login({"ada@example.com", "correct-password"});
```

Rix Auth finds the user by email and verifies the plain-text password against the stored hash.

If verification fails, login fails with an authentication error.

A public application should usually return a generic message such as:

```txt
Invalid email or password.
```

Do not reveal whether the email exists.

## Security notes

Never store plain-text passwords.

Never log plain-text passwords.

Avoid logging password hashes in production.

Do not send password hashes to clients.

Treat password hashes as sensitive server-side data.

Use production configuration for real deployments.

Use database-backed auth when users must persist.

## Complete example with custom policy

```cpp
#include <rix.hpp>

int main()
{
  auto config = rix.auth.config.development();

  config.set_min_password_length(12);
  config.set_issuer("password-example");

  auto password = "correct-password";
  auto hashed = rix.auth.password.hash(password, config);

  if (hashed.failed())
  {
    const auto &error = hashed.error();
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message()
    );
    return 1;
  }

  const bool valid = rix.auth.password.verify(password,hashed.value(), config);

  if (!valid)
  {
    rix.debug.eprint("ERROR:", "password should be valid");
    return 1;
  }

  rix.debug.print("OK:", "password accepted and verified");

  return 0;
}
```

Run it:

```bash
vix run password.cpp
```

## What you should remember

Hash a password:

```cpp
auto hashed = rix.auth.password.hash("correct-password");
```

Verify a password:

```cpp
bool valid = rix.auth.password.verify("correct-password", hashed.value());
```

Check the policy:

```cpp
bool accepted = rix.auth.password.accepts("correct-password");
```

Always check:

```cpp
hashed.failed()
```

before using:

```cpp
hashed.value()
```

Store password hashes.

Never store plain-text passwords.

## Next step

Learn how sessions work.

Next: [Sessions](./sessions)
