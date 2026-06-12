# Database Store

This page explains how database-backed stores work in `rix/auth`.

The examples use the public Rix facade:

```cpp id="ek3y0d"
#include <rix.hpp>
```

and Auth through:

```cpp id="ccm13y"
rix.auth
```

Database stores persist users and sessions through Vix database storage.

Use them when authentication data must survive process restarts.

## Basic idea

Memory auth is useful for examples:

```cpp id="qtgylq"
auto auth = rix.auth.memory();
```

Database auth is for durable applications:

```cpp id="0evtqy"
auto auth = rix.auth.database(db);
```

With production configuration:

```cpp id="oq4s7f"
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Database auth creates:

```txt id="ihhcfb"
DbUserStore
DbSessionStore
Auth service
```

The user store persists users.

The session store persists sessions.

## When to use database auth

Use database auth when:

```txt id="44u43q"
users must survive restarts
sessions must survive restarts
the application is real or production-oriented
authentication state must be durable
multiple deployments need persistent account data
```

Database auth is the recommended direction for real applications.

## When not to use database auth

For the first local examples, you can use:

```cpp id="2bsj20"
auto auth = rix.auth.memory();
```

Memory auth is simpler when you only want to learn the API.

Use database auth when you are ready to persist real user and session data.

## Install

For the facade API, install:

```bash id="zy8lgh"
vix add rix/rix
vix install
```

In `vix.app`, declare:

```txt id="sp2qiy"
deps = [
  "rix/rix",
]
```

If your application also uses Vix database APIs, keep the normal Vix package link section:

```txt id="ohh6mb"
packages = [
  "vix",
]

links = [
  "vix::vix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

Do not put Rix packages in `packages`.

## Database auth

The high-level facade API is:

```cpp id="jy9hal"
auto auth = rix.auth.database(db);
```

This uses production configuration by default.

You can also pass configuration explicitly:

```cpp id="gzsknd"
auto config = rix.auth.config.production();

config.set_issuer("my-app");

auto auth = rix.auth.database(db, config);
```

Use this form when your application needs custom password policy, session lifetime, token lifetime, or issuer.

## Database stores

The facade can create database-backed stores directly:

```cpp id="iplzm2"
auto users = rix.auth.stores.database_users(db);
auto sessions = rix.auth.stores.database_sessions(db);
```

Most applications do not need to create stores directly.

Prefer:

```cpp id="aacmxw"
auto auth = rix.auth.database(db);
```

or:

```cpp id="tvukao"
auto auth = rix.auth.database(db, config);
```

Direct store creation is useful for advanced integrations, tests, migrations, and custom wiring.

## Tables

The database stores use two tables:

```txt id="67gl0h"
rix_auth_users
rix_auth_sessions
```

`DbUserStore` stores users.

`DbSessionStore` stores sessions.

The constructors can create the required schema automatically when schema creation is enabled.

The high-level database auth helper creates the stores using their default schema behavior.

## User store table

The user store persists the user model.

A user contains:

```txt id="kvv1jx"
id
email
password_hash
email_verified
active
created_at
updated_at
```

The password hash is sensitive server-side data.

Do not send it to clients.

Do not log it in production.

## Session store table

The session store persists the session model.

A session contains:

```txt id="7j7yjp"
id
user_id
created_at
expires_at
last_seen_at
revoked
```

The session id is sensitive.

Do not log session ids in production.

## Complete shape

A real application usually creates the database before creating Auth.

The exact database setup depends on your Vix application.

The Auth part looks like this:

```cpp id="zpzln6"
#include <rix.hpp>

int main()
{
  auto config = rix.auth.config.production();

  config.set_issuer("my-app");

  /*
   * Create or open your Vix database here.
   *
   * Example shape:
   *
   *   auto db = ...;
   */

  auto auth = rix.auth.database(db, config);

  auto registered = auth.register_user({
      "ada@example.com",
      "correct-password"
  });

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

  auto login = auth.login({
      "ada@example.com",
      "correct-password"
  });

  if (login.failed())
  {
    const auto &error = login.error();

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  rix.debug.print("registered:", registered.value().email());
  rix.debug.print("user id:", registered.value().id());
  rix.debug.print("session expires at:", login.value().session.expires_at());

  return 0;
}
```

This page focuses on the Auth database store API.

Use the database setup style recommended by the Vix database module in your application.

## Create stores manually

For advanced usage, create the stores manually:

```cpp id="c8gukm"
auto users = rix.auth.stores.database_users(db);
auto sessions = rix.auth.stores.database_sessions(db);
```

Then create managed auth:

```cpp id="38wfqa"
auto managed = rix.auth.managed(
    std::move(users),
    std::move(sessions),
    rix.auth.config.production()
);
```

Check the result:

```cpp id="oq6hsp"
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

Use this when you want the returned auth object to own the database-backed stores.

## Caller-owned database stores

Advanced code can create an auth service with caller-owned stores:

```cpp id="nm8fc7"
auto users = rix.auth.stores.database_users(db);
auto sessions = rix.auth.stores.database_sessions(db);

auto auth = rix.auth.create(
    *users,
    *sessions,
    rix.auth.config.production()
);
```

In this case, the caller owns the stores.

The stores must stay alive for as long as the auth service is used.

For normal application code, prefer:

```cpp id="jx3woz"
auto auth = rix.auth.database(db, config);
```

## Store lifetime rule

This is the simplest durable path:

```cpp id="mek4x5"
auto auth = rix.auth.database(db, config);
```

This is also safe:

```cpp id="qx7sad"
auto managed = rix.auth.managed(
    rix.auth.stores.database_users(db),
    rix.auth.stores.database_sessions(db),
    config
);
```

because the managed auth object owns the stores.

This requires care:

```cpp id="v0o5bw"
auto users = rix.auth.stores.database_users(db);
auto sessions = rix.auth.stores.database_sessions(db);

auto auth = rix.auth.create(*users, *sessions, config);
```

because the stores are owned outside the auth object.

Do not destroy the stores while Auth is still using them.

The database object must also stay alive while the stores are using it.

## Schema creation

The database-backed stores can create their required tables.

The store constructors accept a schema creation flag at the lower-level API.

Conceptually:

```cpp id="ycjdqs"
DbUserStore(db, true)
DbSessionStore(db, true)
```

The facade helper uses the default store behavior.

For most applications, that is enough.

For advanced migrations, you can manage schema creation separately and use lower-level store construction when needed.

## Ensure schema manually

The lower-level database stores expose:

```cpp id="ze5qcw"
ensure_schema()
```

This is useful when you want explicit control over schema creation.

Example shape:

```cpp id="dv14fl"
auto users = rix.auth.stores.database_users(db);
auto sessions = rix.auth.stores.database_sessions(db);

/*
 * If you need direct ensure_schema access, use the lower-level
 * DbUserStore and DbSessionStore types.
 */
```

For normal application code, prefer the high-level helper:

```cpp id="nnm367"
auto auth = rix.auth.database(db, config);
```

## Register with database auth

Registration is the same as memory auth:

```cpp id="bowt8v"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"
});
```

The difference is storage.

With memory auth, the user lives in memory.

With database auth, the user is persisted through the database store.

Always check the result:

```cpp id="xfonqk"
if (registered.failed())
{
  const auto &error = registered.error();
  return 1;
}
```

## Login with database auth

Login is also the same:

```cpp id="o2z75h"
auto login = auth.login({
    "ada@example.com",
    "correct-password"
});
```

A successful login creates a database-backed session.

That session can survive process restarts if the database is durable.

## Authenticate a persisted session

Authenticate with the session id:

```cpp id="ksdc5i"
auto session = auth.authenticate_session(session_id);
```

If the session exists in the database and is usable, authentication succeeds.

A usable session must be:

```txt id="b3b9fs"
valid
not revoked
not expired
```

## Refresh a persisted session

Refresh a session:

```cpp id="mpedw8"
auto refreshed = auth.refresh_session(session_id);
```

The database-backed store updates the stored session.

The refreshed session receives a new expiration time and last-seen time.

## Logout with database auth

Logout revokes the session:

```cpp id="h55y20"
auto status = auth.logout(session_id);
```

The database-backed session remains stored but becomes unusable.

After logout:

```cpp id="kfstzc"
auto session = auth.authenticate_session(session_id);
```

should fail.

## Logout all sessions for a user

Use:

```cpp id="sfcpyq"
auto status = auth.logout_user(user_id);
```

This revokes all database-backed sessions attached to the user.

Use it when:

```txt id="0futga"
a user changes password
a user logs out from all devices
an account is disabled
a security incident requires immediate disconnect
```

## Inspect database stores

A managed auth object exposes its stores:

```cpp id="54lyfs"
auto auth = rix.auth.database(db, config);

auto &users = auth.users();
auto &sessions = auth.sessions();
```

You can use store methods in tests, admin tools, or diagnostics:

```cpp id="e67k0l"
auto all_users = auth.users().all();

if (all_users.ok())
{
  rix.debug.print("users:", all_users.value().size());
}
```

For large production datasets, prefer dedicated paginated admin APIs instead of loading everything with `all()`.

## User store methods

The user store exposes:

```cpp id="e9u1hg"
create(user)
update(user)
remove_by_id(id)
find_by_id(id)
find_by_email(email)
exists_by_id(id)
exists_by_email(email)
all()
```

Most application code should not call these directly.

Prefer the high-level Auth operations:

```cpp id="a5kw9t"
auth.register_user(...)
auth.login(...)
```

## Session store methods

The session store exposes:

```cpp id="q7ajkd"
create(session)
update(session)
remove_by_id(id)
revoke_by_id(id)
revoke_by_user_id(user_id)
find_by_id(id)
find_by_user_id(user_id)
exists_by_id(id)
all()
```

Most application code should not call these directly.

Prefer:

```cpp id="3lzhec"
auth.authenticate_session(...)
auth.refresh_session(...)
auth.logout(...)
auth.logout_user(...)
```

## Error handling

Database operations return explicit results and statuses.

Registration:

```cpp id="p0ycbp"
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"
});

if (registered.failed())
{
  const auto &error = registered.error();
}
```

Login:

```cpp id="qtqsr6"
auto login = auth.login({
    "ada@example.com",
    "correct-password"
});

if (login.failed())
{
  const auto &error = login.error();
}
```

Logout:

```cpp id="c6565z"
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
}
```

Use the stable error code for programmatic decisions:

```cpp id="zxgfxt"
rix.auth.error.to_string(error)
```

Use the message for diagnostics:

```cpp id="80zjrk"
error.message()
```

## Common database store errors

Database-backed auth can fail with errors such as:

```txt id="8qrb1c"
StoreError
InvalidInput
InvalidEmail
InvalidPassword
UserNotFound
UserAlreadyExists
InvalidCredentials
InvalidSession
SessionExpired
SessionRevoked
ConfigurationError
```

`StoreError` usually means the database operation failed.

Use the message for diagnostics.

## Production configuration

Use production configuration for durable auth:

```cpp id="dnb58p"
auto config = rix.auth.config.production();

config.set_issuer("my-production-app");

auto auth = rix.auth.database(db, config);
```

Production configuration is stricter and is the right starting point for real deployments.

## Migration strategy

For real applications, treat auth database tables like application data.

A good production strategy is:

```txt id="qpbl0e"
use database auth for runtime
keep schema creation explicit in deployment or migrations
validate configuration at startup
use production configuration
monitor StoreError failures
avoid logging secrets
```

The high-level helper is convenient for getting started.

As the application grows, you can move schema management into your normal migration workflow.

## Security notes

Database auth persists sensitive authentication data.

Do not log:

```txt id="1g742w"
plain-text passwords
password hashes
session ids
raw token values
```

Use production configuration.

Use durable database storage.

Use HTTPS in real applications.

Keep token lifetimes short.

Revoke sessions with `logout`.

Revoke all sessions with `logout_user` when account security changes.

## What you should remember

Use database auth for durable applications:

```cpp id="fd49iu"
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Register and login use the same API as memory auth:

```cpp id="8hdzzz"
auth.register_user(...)
auth.login(...)
```

Sessions are persisted through the database-backed session store.

Users are persisted through the database-backed user store.

For normal application code, prefer:

```cpp id="amzqax"
rix.auth.database(db, config)
```

over manual store wiring.

Always check results and statuses before using returned values.

## Next step

Learn Auth errors.

Next: [Errors](./errors)
