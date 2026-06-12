# Password Hash

This example shows how to hash and verify passwords with `rix/auth`.

The example uses the public Rix facade:

```cpp id="n7x4qa"
#include <rix.hpp>
```

and accesses password helpers through:

```cpp id="q5m8vd"
rix.auth.password
```

Use this example when you want to hash a plain-text password and verify login attempts safely.

## Create the file

```bash id="b9v2kc"
mkdir -p ~/rix-auth-password-example
cd ~/rix-auth-password-example
touch password_hash.cpp
```

Add:

```cpp id="x4m8qa"
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
        error.message());

    return 1;
  }

  const bool valid = rix.auth.password.verify(
      password,
      hashed.value());

  const bool invalid = rix.auth.password.verify(
      "wrong-password",
      hashed.value());

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

```bash id="m3k7vp"
vix run password_hash.cpp
```

If Rix is not available yet for single-file usage:

```bash id="v6r9dc"
vix install -g rix/rix
vix run password_hash.cpp
```

Expected output shape:

```txt id="p8q3mx"
== rix/auth password hashing ==
hash: ...
valid password: yes
wrong password: no
OK: password verification successful
```

The exact hash value changes because password hashing uses a salt.

## What this example does

The example defines a password:

```cpp id="h5r9xa"
const auto password = "correct-password";
```

It hashes the password:

```cpp id="c8n4vy"
auto hashed = rix.auth.password.hash(password);
```

It verifies the correct password:

```cpp id="q2v7mc"
const bool valid = rix.auth.password.verify(
    password,
    hashed.value());
```

It verifies that a wrong password does not match:

```cpp id="x9d5rp"
const bool invalid = rix.auth.password.verify(
    "wrong-password",
    hashed.value());
```

## Hash a password

Use:

```cpp id="f7m2ka"
auto hashed = rix.auth.password.hash("correct-password");
```

`hash` returns a result.

Check it before using the stored hash:

```cpp id="r4q8zb"
if (hashed.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(hashed.error()),
      hashed.error().message());

  return 1;
}
```

Then use:

```cpp id="j8p5vx"
hashed.value()
```

The value is an encoded password hash suitable for storage.

Do not store the plain-text password.

## Verify a password

Use:

```cpp id="w6q3nc"
const bool ok = rix.auth.password.verify(
    "correct-password",
    hashed.value());
```

If the password matches the hash, the result is `true`.

If it does not match, the result is `false`.

```cpp id="t9x2vd"
if (ok)
{
  rix.debug.print("password accepted");
}
```

## Wrong password check

A wrong password should fail:

```cpp id="b5m9qc"
const bool wrong = rix.auth.password.verify(
    "wrong-password",
    hashed.value());

if (!wrong)
{
  rix.debug.print("wrong password rejected");
}
```

This is the expected behavior.

## Result pattern

`hash` returns an auth result.

Use:

```cpp id="z4h8ky"
hashed.ok()
hashed.failed()
hashed.value()
hashed.error()
```

Never call `value()` before checking success.

Wrong:

```cpp id="d7n3ma"
auto hashed = rix.auth.password.hash("correct-password");

rix.debug.print(hashed.value());
```

Correct:

```cpp id="c6w4xp"
auto hashed = rix.auth.password.hash("correct-password");

if (hashed.failed())
{
  return 1;
}

rix.debug.print(hashed.value());
```

## Password policy

Password hashing checks the configured password policy.

By default, the development configuration accepts passwords with a minimum length suitable for examples and local development.

This can fail:

```cpp id="k4v8qn"
auto hashed = rix.auth.password.hash("short");
```

Handle the error:

```cpp id="m8q2zc"
if (hashed.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(hashed.error()),
      hashed.error().message());
}
```

## Check whether a password is accepted

Use:

```cpp id="y5n8pa"
const bool accepted = rix.auth.password.accepts("correct-password");
```

Example:

```cpp id="p3x7rk"
if (!rix.auth.password.accepts("short"))
{
  rix.debug.eprint("password rejected by policy");
}
```

`accepts` checks the length policy.

`hash` also checks the policy before creating a hash.

## Use a custom configuration

You can hash and verify with a custom auth configuration.

```cpp id="a2m9vc"
auto config = rix.auth.config.development();

config.set_min_password_length(8);
config.set_password_hash_iterations(310000);
config.set_password_salt_size(16);
config.set_password_hash_size(32);

auto hashed = rix.auth.password.hash(
    "correct-password",
    config);
```

Verify with the same style:

```cpp id="x6q4hd"
const bool ok = rix.auth.password.verify(
    "correct-password",
    hashed.value(),
    config);
```

Use custom configuration when your application needs stricter or different password policy settings.

## Create a hasher

You can create a password hasher through the facade:

```cpp id="v9c5xb"
auto hasher = rix.auth.password.hasher();
```

Then:

```cpp id="s7n2qa"
auto hashed = hasher.hash("correct-password");

const bool ok = hasher.verify(
    "correct-password",
    hashed.value());
```

With configuration:

```cpp id="q8k5mv"
auto config = rix.auth.config.production();

auto hasher = rix.auth.password.hasher(config);
```

For most examples, the facade helpers are enough:

```cpp id="h6v9zc"
rix.auth.password.hash(...)
rix.auth.password.verify(...)
```

## Complete custom policy example

```cpp id="n4x7pc"
#include <rix.hpp>

int main()
{
  auto config = rix.auth.config.development();

  config.set_min_password_length(12);

  const auto password = "correct-password";

  auto hashed = rix.auth.password.hash(
      password,
      config);

  if (hashed.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(hashed.error()),
        hashed.error().message());

    return 1;
  }

  const bool ok = rix.auth.password.verify(
      password,
      hashed.value(),
      config);

  rix.debug.print("password valid:", ok ? "yes" : "no");

  return ok ? 0 : 1;
}
```

Run:

```bash id="u9r3dt"
vix run password_hash.cpp
```

## Use with registration

Normally, you do not need to call password hashing directly during registration.

`auth.register_user` hashes the password internally.

```cpp id="b8q4km"
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

Use `rix.auth.password.hash` directly when you are writing lower-level auth utilities, tests, import tools, adapters, or custom flows.

## Use with login

Normally, you do not need to call password verification directly during login.

`auth.login` verifies the password internally.

```cpp id="d4r8va"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

Use `rix.auth.password.verify` directly when testing, migrating stored hashes, or building custom auth flows.

## Safe output

Do not print plain-text passwords.

Do not print password hashes in production logs.

This example prints the hash only to show that a hash was produced.

For real applications, store the hash and keep logs clean.

## Use in a Vix project

Create a project:

```bash id="j7n5qc"
vix new rix-auth-password --app
cd rix-auth-password
```

Add Rix:

```bash id="c9m4xp"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="r8v2hn"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="f3q7kb"
name = "rix-auth-password"
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

```txt id="z5m8qa"
src/main.cpp
```

Build and run:

```bash id="w9k4vc"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="m2x6rd"
vix run password_hash.cpp
```

If needed:

```bash id="q7v9na"
vix install -g rix/rix
vix run password_hash.cpp
```

For project usage, prefer:

```bash id="p4n8zc"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="h6q3md"
deps = [
  "rix/rix",
]
```

## Use only auth with the facade

If you want the `rix.*` facade style but only want auth mounted, define the feature macro before including `rix.hpp`:

```cpp id="x8m5rc"
#define RIX_ENABLE_AUTH
#include <rix.hpp>

int main()
{
  auto hashed = rix.auth.password.hash("correct-password");

  return hashed.ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp id="a9w2vd"
#define RIX_ENABLE_AUTH
#define RIX_ENABLE_DEBUG
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

  rix.debug.print("hash created");
  return 0;
}
```

## Use the independent package

For independent usage, install:

```bash id="k5v7qm"
vix add rix/auth
vix install
```

In `vix.app`:

```txt id="n3c8xa"
deps = [
  "rix/auth",
]
```

Then include auth package headers directly.

The examples in this documentation prefer the public facade:

```cpp id="y2q6rp"
#include <rix.hpp>
```

and:

```cpp id="g8x4hc"
rix.auth
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="f9p4zb"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="t6m8qn"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="u8x2qc"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="b5r7mx"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Calling `value()` before checking success

Wrong:

```cpp id="k6q8vd"
auto hashed = rix.auth.password.hash("correct-password");

const auto &stored_hash = hashed.value();
```

Correct:

```cpp id="d9m3xa"
auto hashed = rix.auth.password.hash("correct-password");

if (hashed.failed())
{
  return 1;
}

const auto &stored_hash = hashed.value();
```

### Expecting the same hash every time

Password hashes include a salt.

This means hashing the same password twice can produce different encoded hashes.

That is expected.

Use `verify` to check whether a password matches a stored hash.

### Logging passwords

Never log:

```txt id="q3x7kv"
plain-text passwords
password hashes in production
```

For docs, the hash may be printed to show the example result.

For production, do not print it.

### Verifying against an empty hash

This returns `false`:

```cpp id="v4m9wc"
rix.auth.password.verify(
    "correct-password",
    "");
```

Always store and pass the encoded hash returned by `hash`.

## What you should remember

Hash a password:

```cpp id="z9h5qa"
auto hashed = rix.auth.password.hash("correct-password");
```

Check the result:

```cpp id="m4v8kn"
if (hashed.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(hashed.error()),
      hashed.error().message());

  return 1;
}
```

Verify the password:

```cpp id="p7c2rx"
const bool ok = rix.auth.password.verify(
    "correct-password",
    hashed.value());
```

Wrong passwords return `false`:

```cpp id="c5n9hd"
const bool wrong = rix.auth.password.verify(
    "wrong-password",
    hashed.value());
```

For project usage:

```bash id="r8q6ma"
vix add rix/rix
vix install
```

and keep:

```txt id="s2x4vc"
deps = [
  "rix/rix",
]
```

## Next step

Continue with session refresh and logout.

Next: [Session refresh and logout](./session-refresh-logout)
