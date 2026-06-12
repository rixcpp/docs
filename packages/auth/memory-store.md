# Memory Store

This page explains how memory-backed stores work in `rix/auth`.

The examples use the public Rix facade:

```cpp id="v1s2ko"
#include <rix.hpp>
```

and Auth through:

```cpp id="y8wre7"
rix.auth
```

Memory stores keep users and sessions inside the current process.

They are useful for examples, tests, local development, and small temporary tools.

They are not durable.

When the process exits, the stored users and sessions are lost.

## Basic idea

The simplest memory-backed Auth service is:

```cpp id="kepp4q"
auto auth = rix.auth.memory();
```

This creates:

```txt id="ck2bip"
MemoryUserStore
MemorySessionStore
Auth service
```

and returns a managed auth object that owns the stores safely.

You can immediately register users, login, authenticate sessions, refresh sessions, and logout.

## Complete example

Create a file:

```bash id="bst3tw"
mkdir -p ~/rix-auth-memory-store
cd ~/rix-auth-memory-store
touch memory.cpp
```

Add:

```cpp id="od6w8x"
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth memory store ==");

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

  rix.debug.print("registered:", registered.value().email());
  rix.debug.print("user id:", registered.value().id());
  rix.debug.print("session id:", login.value().session.id());

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

  rix.debug.print("OK:", "session authenticated");
  rix.debug.print("session user id:", session.value().user_id());

  return 0;
}
```

Run it:

```bash id="ob8k6b"
vix run memory.cpp
```

If Rix is not available yet for single-file usage:

```bash id="g77bbf"
vix install -g rix/rix
vix run memory.cpp
```

## Expected output

The output should look like this:

```txt id="pmw84l"
== rix/auth memory store ==
registered: ada@example.com
user id: user_...
session id: session_...
OK: session authenticated
session user id: user_...
```

The exact user id and session id will be different.

## When to use memory auth

Use memory auth for:

```txt id="kg3rr6"
examples
tests
local experiments
temporary tools
learning
```

Memory auth is the fastest way to try `rix/auth`.

It does not need a database.

It does not need schema setup.

It is easy to reset because all data lives in memory.

## When not to use memory auth

Do not use memory auth when:

```txt id="ufzoos"
users must survive restarts
sessions must survive restarts
the app runs in production
the app runs across multiple processes
the app needs durable account state
```

For real applications, prefer database auth:

```cpp id="hxz6jp"
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

## Memory auth with configuration

Memory auth can receive a custom configuration:

```cpp id="qvq2p7"
auto config = rix.auth.config.development();

config.set_min_password_length(10);
config.set_session_ttl_seconds(60 * 60);
config.set_token_ttl_seconds(60 * 15);
config.set_issuer("memory-example");

auto auth = rix.auth.memory(config);
```

The configuration applies to:

```txt id="iotfkm"
password validation
password hashing
session lifetime
token lifetime
token issuer
email verification behavior
inactive user rejection
```

## Memory users

A memory user store keeps users in memory.

The facade can create one directly:

```cpp id="n7yeib"
auto users = rix.auth.stores.memory_users();
```

This returns an owned user store.

Most applications do not need to create the store directly.

Prefer:

```cpp id="ob1htv"
auto auth = rix.auth.memory();
```

Use direct store creation only when you need custom store wiring.

## Memory sessions

A memory session store keeps sessions in memory.

The facade can create one directly:

```cpp id="udmvdr"
auto sessions = rix.auth.stores.memory_sessions();
```

This returns an owned session store.

Most applications do not need to create the store directly.

Prefer:

```cpp id="xkavte"
auto auth = rix.auth.memory();
```

## Managed memory auth

`rix.auth.memory()` returns a managed auth service.

That means the returned object owns its user store and session store.

```cpp id="qy4g1w"
auto auth = rix.auth.memory();
```

This is safe because the stores stay alive as long as the auth object stays alive.

You can use the returned object like the normal Auth API:

```cpp id="eqi7cf"
auth.register_user(...)
auth.login(...)
auth.authenticate_session(...)
auth.refresh_session(...)
auth.logout(...)
auth.logout_user(...)
auth.issue_token(...)
```

## Custom managed memory stores

If you want to create stores yourself but still let the returned auth service own them, use `managed`.

```cpp id="npsg89"
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto managed = rix.auth.managed(
    std::move(users),
    std::move(sessions)
);
```

Check the result:

```cpp id="akm7xh"
if (managed.failed())
{
  const auto &error = managed.error();
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(error),
      error.message()
  );
  return 1;
}

auto auth = managed.move_value();
```

Use this when you need custom store construction but still want safe ownership.

## Managed memory auth with config

You can pass configuration to `managed`:

```cpp id="t3x363"
auto config = rix.auth.config.development();

config.set_issuer("managed-memory-example");

auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto managed = rix.auth.managed(
    std::move(users),
    std::move(sessions),
    config
);
```

The configuration is validated before the managed auth object is returned.

If the configuration is invalid, `managed` returns an error.

## Caller-owned memory stores

Advanced code can create an auth service from caller-owned stores:

```cpp id="fu1rj5"
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto auth = rix.auth.create(*users, *sessions);
```

In this case, the caller owns the stores.

The stores must stay alive for as long as `auth` is used.

This is advanced usage.

For normal application code, prefer:

```cpp id="efn9jz"
auto auth = rix.auth.memory();
```

or:

```cpp id="rnw8as"
auto managed = rix.auth.managed(
    rix.auth.stores.memory_users(),
    rix.auth.stores.memory_sessions()
);
```

## Store lifetime rule

This is safe:

```cpp id="uww6qy"
auto auth = rix.auth.memory();
```

because the auth object owns its stores.

This is also safe:

```cpp id="k31dxf"
auto managed = rix.auth.managed(
    rix.auth.stores.memory_users(),
    rix.auth.stores.memory_sessions()
);
```

because the managed auth object owns the stores.

This requires care:

```cpp id="mg5rn2"
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto auth = rix.auth.create(*users, *sessions);
```

because the stores are owned outside the auth object.

Do not destroy the stores while the auth service is still using them.

## Inspect memory stores

A managed auth object exposes the owned stores:

```cpp id="axrx8y"
auto auth = rix.auth.memory();

auto &users = auth.users();
auto &sessions = auth.sessions();
```

This is useful for tests and advanced diagnostics.

Example:

```cpp id="h94q41"
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"
});

auto all_users = auth.users().all();

if (all_users.ok())
{
  rix.debug.print("users:", all_users.value().size());
}
```

## Find users in memory

The user store exposes lookup methods:

```cpp id="yawuta"
auth.users().find_by_id(user_id)
auth.users().find_by_email(email)
auth.users().exists_by_id(user_id)
auth.users().exists_by_email(email)
auth.users().all()
```

Example:

```cpp id="o7qpc3"
auto found = auth.users().find_by_email("ada@example.com");

if (found.ok() && found.value().has_value())
{
  rix.debug.print("found:", found.value()->email());
}
```

These methods are mainly useful for tests, admin tools, and custom integrations.

Normal application code should prefer the high-level Auth API.

## Find sessions in memory

The session store exposes lookup methods:

```cpp id="q4y2ef"
auth.sessions().find_by_id(session_id)
auth.sessions().find_by_user_id(user_id)
auth.sessions().exists_by_id(session_id)
auth.sessions().all()
```

Example:

```cpp id="ttqzes"
auto found = auth.sessions().find_by_user_id(user_id);

if (found.ok())
{
  rix.debug.print("sessions:", found.value().size());
}
```

These methods are useful for tests, cleanup tools, and admin-style features.

Normal application code should prefer:

```cpp id="y62fic"
auth.authenticate_session(session_id)
```

## Clear memory stores

Memory stores expose `clear()`.

For users:

```cpp id="xfclik"
auto &users = auth.users();

users.clear();
```

For sessions:

```cpp id="fko3ae"
auto &sessions = auth.sessions();

sessions.clear();
```

Clearing a memory store removes its in-memory data.

This is useful in tests.

Use it carefully in application code.

## Memory store size

Memory stores expose size helpers.

For users:

```cpp id="aufgb7"
auto count = auth.users().size();
bool empty = auth.users().empty();
```

For sessions:

```cpp id="gq8z9w"
auto count = auth.sessions().size();
bool empty = auth.sessions().empty();
```

These are useful for tests and diagnostics.

## Duplicate users

Memory user store rejects duplicate users.

This can happen when:

```txt id="s8vz3q"
the same user id already exists
the same email already exists
```

Example:

```cpp id="z00so3"
auto first = auth.register_user({
    "ada@example.com",
    "correct-password"
});

auto second = auth.register_user({
    "ada@example.com",
    "correct-password"
});
```

The second registration should fail with a user-already-exists error.

## Duplicate sessions

Memory session store rejects duplicate session ids.

Normally, application code does not create session ids directly.

Auth generates session ids during login.

Duplicate session errors are mostly relevant for tests and custom store implementations.

## Session revocation in memory

Logout revokes a session in the memory session store:

```cpp id="bg00yh"
auto status = auth.logout(session_id);
```

After logout:

```cpp id="d08chp"
auto session = auth.authenticate_session(session_id);
```

should fail because the session is revoked.

Logout all sessions for a user:

```cpp id="yq02ax"
auto status = auth.logout_user(user_id);
```

This revokes every session attached to the user.

## Thread safety

The memory stores are designed to be thread-safe for individual store operations.

This means individual calls such as create, update, find, revoke, and remove are protected internally.

For larger multi-step workflows, the application should still treat Auth operations as the public coordination layer.

Use database-backed stores for real multi-process or durable deployments.

## Memory store limitations

Memory stores do not provide:

```txt id="eub123"
durability
cross-process sharing
database migrations
long-term persistence
production storage guarantees
```

They are intentionally simple.

Use them to learn, test, and prototype.

Use database stores for real applications.

## Security notes

Memory auth still uses password hashing and the configured policy.

But the storage is not durable.

Do not use memory auth as the permanent storage for real user accounts.

Do not log:

```txt id="z0j6d2"
plain-text passwords
password hashes
session ids
raw token values
```

Use production configuration and database auth for real deployments.

## What you should remember

Create memory auth:

```cpp id="b7g58x"
auto auth = rix.auth.memory();
```

Create memory auth with config:

```cpp id="nz1190"
auto config = rix.auth.config.development();

auto auth = rix.auth.memory(config);
```

Create memory stores manually:

```cpp id="y1ppei"
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();
```

Prefer managed ownership:

```cpp id="zp1u7o"
auto auth = rix.auth.memory();
```

Use caller-owned stores only when you understand the lifetime rule:

```cpp id="bwwj04"
auto auth = rix.auth.create(*users, *sessions);
```

Memory auth is for examples, tests, and local experiments.

Database auth is for durable applications.

## Next step

Learn database-backed stores.

Next: [Database Store](./database-store)
