# Sessions

This page explains how sessions work in `rix/auth`.

The examples use the public Rix facade:

```cpp
#include <rix.hpp>
```

and the Auth API through:

```cpp
rix.auth
```

A session represents server-side login state.

When a user logs in, Rix Auth creates a session. The application can later authenticate that session id to know which user is connected.

## Session flow

The normal session flow is:

```txt
login
  -> create session
  -> return session id

authenticate_session
  -> find session
  -> reject invalid session
  -> reject expired session
  -> reject revoked session

refresh_session
  -> extend session lifetime
  -> update last seen time

logout
  -> revoke session
```

## Complete example

Create a file:

```bash
mkdir -p ~/rix-auth-sessions
cd ~/rix-auth-sessions
touch sessions.cpp
```

Add:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("== rix/auth sessions ==");

  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"grace@example.com", "correct-password"});

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

  auto login = auth.login({"grace@example.com", "correct-password"});

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

  const auto session_id = login.value().session.id();

  rix.debug.print("created session:", session_id);
  rix.debug.print("user id:", login.value().session.user_id());
  rix.debug.print("created at:", login.value().session.created_at());
  rix.debug.print("expires at:", login.value().session.expires_at());

  auto session = auth.authenticate_session(session_id);

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

  auto refreshed = auth.refresh_session(session_id);

  if (refreshed.failed())
  {
    const auto &error = refreshed.error();
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message()
    );
    return 1;
  }

  rix.debug.print("----------------------------------------");
  rix.debug.print("OK:", "session refreshed");
  rix.debug.print("new expires at:", refreshed.value().expires_at());
  rix.debug.print("last seen at:", refreshed.value().last_seen_at());

  auto logout = auth.logout(session_id);

  if (logout.failed())
  {
    const auto &error = logout.error();
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message()
    );
    return 1;
  }

  rix.debug.print("----------------------------------------");
  rix.debug.print("OK:", "logout successful");

  auto after_logout = auth.authenticate_session(session_id);

  if (after_logout.ok())
  {
    rix.debug.eprint("ERROR:", "session should not authenticate after logout");
    return 1;
  }

  rix.debug.print("session rejected after logout");

  return 0;
}
```

Run it:

```bash
vix run sessions.cpp
```

If Rix is not available yet for single-file usage:

```bash
vix install -g rix/rix
vix run sessions.cpp
```

## Expected output

The output should look like this:

```txt
== rix/auth sessions ==
created session: session_...
user id: user_...
created at: ...
expires at: ...
----------------------------------------
OK: session authenticated
session user id: user_...
----------------------------------------
OK: session refreshed
new expires at: ...
last seen at: ...
----------------------------------------
OK: logout successful
session rejected after logout
```

The exact ids and timestamps will be different.

## Create a session

A session is created during login:

```cpp
auto login = auth.login({"grace@example.com", "correct-password"});
```

A successful login returns:

```cpp
login.value().session
```

The session contains:

```cpp
login.value().session.id()
login.value().session.user_id()
login.value().session.created_at()
login.value().session.expires_at()
login.value().session.last_seen_at()
login.value().session.revoked()
```

The session id is sensitive.

Do not log session ids in production.

## Authenticate a session

Use:

```cpp
auto session = auth.authenticate_session(session_id);
```

A successful result means the session can be used.

A usable session must be:

```txt
valid
not revoked
not expired
```

Always check the result:

```cpp
if (session.failed())
{
  const auto &error = session.error();
  return 1;
}
```

Then use the authenticated user id:

```cpp
auto user_id = session.value().user_id();
```

In an HTTP application, this user id is usually attached to the request context or used to load the authenticated user.

## Refresh a session

Use:

```cpp
auto refreshed = auth.refresh_session(session_id);
```

Refreshing a session updates:

```cpp
refreshed.value().expires_at()
refreshed.value().last_seen_at()
```

A session can only be refreshed if it is still usable.

That means an expired or revoked session should not be refreshed.

## Logout

Use:

```cpp
auto status = auth.logout(session_id);
```

Logout revokes the session.

A revoked session remains stored, but it can no longer be used.

Always check the status:

```cpp
if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

After logout, authentication should fail:

```cpp
auto after_logout = auth.authenticate_session(session_id);

if (after_logout.ok())
{
  return 1;
}
```

## Logout all sessions for a user

Use:

```cpp
auto status = auth.logout_user(user_id);
```

This revokes every session attached to that user.

Use it when:

```txt
the user changes password
the user clicks "logout from all devices"
an account is disabled
a security event requires immediate disconnect
```

Example:

```cpp
auto status = auth.logout_user(login.value().user.id());

if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

## Session lifetime

Session lifetime is controlled by Auth configuration.

Development configuration:

```cpp
auto config = rix.auth.config.development();
```

Production configuration:

```cpp
auto config = rix.auth.config.production();
```

Set the session lifetime in seconds:

```cpp
auto config = rix.auth.config.development();

config.set_session_ttl_seconds(60 * 60 * 24 * 7);

auto auth = rix.auth.memory(config);
```

This example sets a seven-day session lifetime.

## Short session example

For tests, you can use a short lifetime:

```cpp
auto config = rix.auth.config.development();

config.set_session_ttl_seconds(60);

auto auth = rix.auth.memory(config);
```

This creates sessions that expire after one minute.

Use short lifetimes for tests and examples.

Use production settings for real deployments.

## Session fields

A session stores:

```txt
id
user_id
created_at
expires_at
last_seen_at
revoked
```

`id` is the session identifier.

`user_id` is the authenticated user.

`created_at` is the creation timestamp.

`expires_at` is the expiration timestamp.

`last_seen_at` is updated when the session is refreshed.

`revoked` tells whether the session has been manually invalidated.

## Session model helpers

The session model exposes helper methods:

```cpp
session.valid()
session.has_id()
session.has_user_id()
session.has_id(session_id)
session.belongs_to(user_id)
session.expired(now)
session.usable(now)
session.refreshable(now)
session.revoked()
```

These are useful in store implementations, tests, and advanced integrations.

Most application code should use:

```cpp
auth.authenticate_session(session_id)
```

instead of manually checking the session state.

## Memory sessions

The examples use:

```cpp
auto auth = rix.auth.memory();
```

Memory auth stores sessions in memory.

That means:

```txt
sessions are lost when the process exits
sessions do not survive restart
sessions are useful for examples and tests
```

Use memory sessions for learning, tests, and temporary tools.

Use database sessions for real applications.

## Database sessions

For durable sessions:

```cpp
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Database auth stores sessions through a database-backed session store.

Use database auth when users and sessions must survive process restarts.

## Session store helpers

The facade exposes store helpers:

```cpp
auto sessions = rix.auth.stores.memory_sessions();
```

For database sessions:

```cpp
auto sessions = rix.auth.stores.database_sessions(db);
```

Most applications do not need to create session stores directly.

Use:

```cpp
auto auth = rix.auth.memory();
```

or:

```cpp
auto auth = rix.auth.database(db);
```

## Common session errors

Session operations can fail with errors such as:

```txt
InvalidSession
SessionExpired
SessionRevoked
StoreError
InvalidInput
```

Use stable error codes for programmatic decisions:

```cpp
if (rix.auth.error.is(
        session.error(),
        rixlib::auth::AuthErrorCode::SessionExpired))
{
  // ask the user to login again
}
```

Use the error message for diagnostics:

```cpp
session.error().message()
```

## Security notes

Do not log session ids in production.

Do not send session ids to places that should not receive authentication secrets.

Use HTTPS in real applications.

Use database-backed sessions when session state must survive restarts.

Use logout to revoke sessions instead of deleting users.

Use `logout_user` when all sessions for a user must be invalidated.

## What you should remember

Login creates a session:

```cpp
auto login = auth.login({
    "grace@example.com",
    "correct-password"});
```

Authenticate the session:

```cpp
auto session = auth.authenticate_session(login.value().session.id());
```

Refresh the session:

```cpp
auto refreshed = auth.refresh_session(login.value().session.id());
```

Logout revokes the session:

```cpp
auto status = auth.logout(login.value().session.id());
```

Logout all sessions for a user:

```cpp
auto status = auth.logout_user(user_id);
```

Always check results and statuses before using returned values.

## Next step

Learn how tokens work.

Next: [Tokens](./tokens)
