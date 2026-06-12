# Auth API Reference

This page summarizes the public API exposed by `rix/auth`.

The documentation examples use the unified Rix facade:

```cpp
#include <rix.hpp>
```

and access Auth through:

```cpp
rix.auth
```

The lower-level Auth types live under:

```cpp
rixlib::auth
```

Use the facade for application code.

Use lower-level types when you need explicit types, custom stores, advanced integrations, or tests.

## Facade entry point

The Auth module is mounted at:

```cpp
rix.auth
```

Common usage:

```cpp
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"
});

auto login = auth.login({
    "ada@example.com",
    "correct-password"
});
```

## Headers

Recommended public header:

```cpp
#include <rix.hpp>
```

Independent package header:

```cpp
#include <rix/auth.hpp>
```

Lower-level headers include:

```cpp
#include <rix/auth/Auth.hpp>
#include <rix/auth/AuthConfig.hpp>
#include <rix/auth/AuthError.hpp>
#include <rix/auth/AuthResult.hpp>
#include <rix/auth/ManagedAuth.hpp>
#include <rix/auth/PasswordHasher.hpp>
#include <rix/auth/Session.hpp>
#include <rix/auth/SessionStore.hpp>
#include <rix/auth/Token.hpp>
#include <rix/auth/User.hpp>
#include <rix/auth/UserStore.hpp>
#include <rix/auth/stores/MemoryUserStore.hpp>
#include <rix/auth/stores/MemorySessionStore.hpp>
#include <rix/auth/stores/DbUserStore.hpp>
#include <rix/auth/stores/DbSessionStore.hpp>
```

## Namespace

Lower-level Auth types are in:

```cpp
rixlib::auth
```

Examples:

```cpp
rixlib::auth::AuthConfig
rixlib::auth::AuthError
rixlib::auth::AuthErrorCode
rixlib::auth::User
rixlib::auth::Session
rixlib::auth::Token
```

## `rix.auth`

`rix.auth` exposes the high-level Auth module.

### Create memory auth

```cpp
auto auth = rix.auth.memory();
```

With configuration:

```cpp
auto config = rix.auth.config.development();

auto auth = rix.auth.memory(config);
```

Memory auth owns memory-backed user and session stores.

Use it for examples, tests, local experiments, and temporary tools.

### Create database auth

```cpp
auto auth = rix.auth.database(db);
```

With configuration:

```cpp
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Database auth owns database-backed user and session stores.

Use it when users and sessions must survive process restarts.

### Create Auth with caller-owned stores

```cpp
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto auth = rix.auth.create(*users, *sessions);
```

With configuration:

```cpp
auto config = rix.auth.config.development();

auto auth = rix.auth.create(*users, *sessions, config);
```

The stores must stay alive for as long as the Auth object is used.

For normal application code, prefer:

```cpp
auto auth = rix.auth.memory();
```

or:

```cpp
auto auth = rix.auth.database(db, config);
```

### Create managed auth with owned stores

```cpp
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto managed = rix.auth.managed(
    std::move(users),
    std::move(sessions)
);
```

With configuration:

```cpp
auto managed = rix.auth.managed(
    std::move(users),
    std::move(sessions),
    config
);
```

Check the result:

```cpp
if (managed.failed())
{
  const auto &error = managed.error();
  return 1;
}

auto auth = managed.move_value();
```

## `Auth`

`Auth` is the main authentication service.

It performs registration, login, session authentication, session refresh, logout, logout all sessions, and token issuing.

The facade usually returns either `Auth` or `ManagedAuth` depending on how the service is created.

### `register_user`

```cpp
AuthResult<User> register_user(const RegisterRequest &request);
```

Registers a new user.

Example:

```cpp
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"
});
```

On success, returns a `User`.

On failure, returns an `AuthError`.

### `login`

```cpp
AuthResult<LoginResult> login(const LoginRequest &request);
```

Authenticates a user and creates a session.

Example:

```cpp
auto login = auth.login({
    "ada@example.com",
    "correct-password"
});
```

On success, returns:

```cpp
login.value().user
login.value().session
login.value().token
```

### `logout`

```cpp
AuthStatus logout(std::string_view session_id);
```

Revokes one session.

Example:

```cpp
auto status = auth.logout(session_id);
```

### `logout_user`

```cpp
AuthStatus logout_user(std::string_view user_id);
```

Revokes all sessions for a user.

Example:

```cpp
auto status = auth.logout_user(user_id);
```

Use this for logout from all devices, password changes, account disabling, or security events.

### `authenticate_session`

```cpp
AuthResult<Session> authenticate_session(std::string_view session_id);
```

Finds and validates a session.

Example:

```cpp
auto session = auth.authenticate_session(session_id);
```

A session must be valid, not revoked, and not expired.

### `refresh_session`

```cpp
AuthResult<Session> refresh_session(std::string_view session_id);
```

Refreshes a valid session.

Example:

```cpp
auto refreshed = auth.refresh_session(session_id);
```

A refreshed session receives an updated expiration timestamp and last-seen timestamp.

### `issue_token`

```cpp
AuthResult<Token> issue_token(std::string_view user_id);
```

Creates a short-lived token for a user.

Example:

```cpp
auto token = auth.issue_token(user_id);
```

### `config`

```cpp
const AuthConfig &config() const noexcept;
```

Returns the current Auth configuration.

Example:

```cpp
auto min_length = auth.config().min_password_length();
```

### `password_hasher`

```cpp
const PasswordHasher &password_hasher() const noexcept;
```

Returns the password hasher used by the Auth service.

Example:

```cpp
auto min_length = auth.password_hasher().min_password_length();
```

## Request types

### `RegisterRequest`

```cpp
struct RegisterRequest
{
  std::string email;
  std::string password;
};
```

Used by:

```cpp
auth.register_user(...)
```

Example:

```cpp
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"
});
```

### `LoginRequest`

```cpp
struct LoginRequest
{
  std::string email;
  std::string password;
};
```

Used by:

```cpp
auth.login(...)
```

Example:

```cpp
auto login = auth.login({
    "ada@example.com",
    "correct-password"
});
```

## Result types

### `LoginResult`

```cpp
struct LoginResult
{
  User user;
  Session session;
  Token token;
};
```

Returned by:

```cpp
auth.login(...)
```

Example:

```cpp
auto login = auth.login({
    "ada@example.com",
    "correct-password"
});

if (login.ok())
{
  const auto &user = login.value().user;
  const auto &session = login.value().session;
  const auto &token = login.value().token;
}
```

## `AuthResult<T>`

`AuthResult<T>` stores either a success value of type `T` or an `AuthError`.

Used by operations that return data.

Examples:

```cpp
AuthResult<User>
AuthResult<LoginResult>
AuthResult<Session>
AuthResult<Token>
AuthResult<std::string>
AuthResult<std::optional<User>>
AuthResult<std::vector<Session>>
```

### Static constructors

```cpp
static AuthResult<T> success(T value);
static AuthResult<T> failure(AuthError error);
```

### Methods

```cpp
bool ok() const noexcept;
bool failed() const noexcept;
explicit operator bool() const noexcept;

const T &value() const;
T &value();
T move_value();

const AuthError &error() const noexcept;
```

Example:

```cpp
auto result = auth.login({
    "ada@example.com",
    "correct-password"
});

if (result.failed())
{
  const auto &error = result.error();
  return 1;
}

const auto &login = result.value();
```

Do not call `.value()` before checking `ok()` or `failed()`.

## `AuthStatus`

`AuthStatus` stores success or an `AuthError`.

Used by operations that do not return a value.

Examples:

```cpp
auth.logout(...)
auth.logout_user(...)
store.update(...)
store.remove_by_id(...)
store.revoke_by_id(...)
```

### Static constructors

```cpp
static AuthStatus success();
static AuthStatus failure(AuthError error);
```

### Methods

```cpp
bool ok() const noexcept;
bool failed() const noexcept;
explicit operator bool() const noexcept;

const AuthError &error() const noexcept;
```

Example:

```cpp
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

## `AuthErrorCode`

`AuthErrorCode` is the stable error-code enum for Auth.

```cpp
enum class AuthErrorCode
{
  None,

  InvalidInput,
  InvalidState,
  InvalidEmail,
  InvalidPassword,

  UserNotFound,
  UserAlreadyExists,

  InvalidCredentials,
  EmailVerificationRequired,
  UserDisabled,

  InvalidSession,
  SessionExpired,
  SessionRevoked,

  InvalidToken,
  TokenExpired,
  TokenRevoked,

  StoreError,
  CryptoError,
  ValidationError,
  ConfigurationError,

  Unknown
};
```

Use error codes for programmatic decisions.

Use error messages for diagnostics.

## `AuthError`

`AuthError` stores a stable error code and a human-readable message.

### Constructors

```cpp
AuthError();
AuthError(AuthErrorCode code, std::string message);
```

### Methods

```cpp
bool ok() const noexcept;
bool has_error() const noexcept;
AuthErrorCode code() const noexcept;
const std::string &message() const noexcept;
bool is(AuthErrorCode code) const noexcept;
```

Example:

```cpp
if (login.failed())
{
  const auto &error = login.error();

  if (error.is(rixlib::auth::AuthErrorCode::InvalidCredentials))
  {
    return 1;
  }
}
```

### Helper functions

```cpp
std::string_view to_string(AuthErrorCode code) noexcept;

AuthError make_auth_ok();

AuthError make_auth_error(
    AuthErrorCode code,
    std::string message
);
```

Facade helpers are available through:

```cpp
rix.auth.error
```

## `rix.auth.error`

`rix.auth.error` exposes error helper functions.

### `none`

```cpp
auto error = rix.auth.error.none();
```

Creates a success error value.

### `make`

```cpp
auto error = rix.auth.error.make(
    rixlib::auth::AuthErrorCode::InvalidInput,
    "Invalid input."
);
```

Creates an Auth error.

### `to_string`

```cpp
rix.auth.error.to_string(error)
rix.auth.error.to_string(error.code())
```

Converts an error or error code to a stable string.

### `ok`

```cpp
bool ok = rix.auth.error.ok(error);
```

Returns true when the error represents success.

### `failed`

```cpp
bool failed = rix.auth.error.failed(error);
```

Returns true when the error represents failure.

### `is`

```cpp
bool invalid = rix.auth.error.is(
    error,
    rixlib::auth::AuthErrorCode::InvalidInput
);
```

Returns true when the error has the given code.

## `AuthConfig`

`AuthConfig` controls password policy, session lifetime, token lifetime, token issuer, email verification behavior, session rotation, and inactive user rejection.

### Create config

```cpp
AuthConfig();
```

Facade helpers:

```cpp
auto config = rix.auth.config.development();
auto config = rix.auth.config.production();
```

### Static constructors

```cpp
static AuthConfig development();
static AuthConfig production();
```

### Password length

```cpp
std::size_t min_password_length() const noexcept;
void set_min_password_length(std::size_t value) noexcept;

std::size_t max_password_length() const noexcept;
void set_max_password_length(std::size_t value) noexcept;
```

### Session lifetime

```cpp
std::int64_t session_ttl_seconds() const noexcept;
void set_session_ttl_seconds(std::int64_t value) noexcept;
```

### Token lifetime

```cpp
std::int64_t token_ttl_seconds() const noexcept;
void set_token_ttl_seconds(std::int64_t value) noexcept;
```

### Password hashing settings

```cpp
std::uint32_t password_hash_iterations() const noexcept;
void set_password_hash_iterations(std::uint32_t value) noexcept;

std::size_t password_salt_size() const noexcept;
void set_password_salt_size(std::size_t value) noexcept;

std::size_t password_hash_size() const noexcept;
void set_password_hash_size(std::size_t value) noexcept;
```

### Issuer

```cpp
const std::string &issuer() const noexcept;
void set_issuer(std::string value);
```

### Email verification

```cpp
bool require_email_verification() const noexcept;
void set_require_email_verification(bool value) noexcept;
```

### Session rotation

```cpp
bool rotate_sessions() const noexcept;
void set_rotate_sessions(bool value) noexcept;
```

### Inactive user rejection

```cpp
bool reject_inactive_users() const noexcept;
void set_reject_inactive_users(bool value) noexcept;
```

## `rix.auth.config`

`rix.auth.config` exposes configuration helpers.

### `development`

```cpp
auto config = rix.auth.config.development();
```

Returns a development Auth configuration.

### `production`

```cpp
auto config = rix.auth.config.production();
```

Returns a production Auth configuration.

### `development_with_min_password_length`

```cpp
auto config = rix.auth.config.development_with_min_password_length(10);
```

Returns development configuration with a custom minimum password length.

### `production_with_min_password_length`

```cpp
auto config = rix.auth.config.production_with_min_password_length(12);
```

Returns production configuration with a custom minimum password length.

### `validate`

```cpp
auto status = rix.auth.config.validate(config);
```

Validates a configuration and returns `AuthStatus`.

### `valid`

```cpp
bool ok = rix.auth.config.valid(config);
```

Returns true when the configuration is valid.

## `PasswordHasher`

`PasswordHasher` hashes passwords and verifies passwords against stored password hashes.

It uses the configured password policy and hashing settings.

### Constructors

```cpp
PasswordHasher();
explicit PasswordHasher(const AuthConfig &config);
```

### Hash

```cpp
AuthResult<std::string> hash(std::string_view password) const;
```

Example:

```cpp
auto hashed = rix.auth.password.hash("correct-password");

if (hashed.failed())
{
  return 1;
}
```

### Verify

```cpp
bool verify(
    std::string_view password,
    std::string_view password_hash) const;
```

Example:

```cpp
bool valid = rix.auth.password.verify(
    "correct-password",
    hashed.value()
);
```

### Check policy

```cpp
bool accepts(std::string_view password) const noexcept;
```

Example:

```cpp
bool accepted = rix.auth.password.accepts("correct-password");
```

### Policy methods

```cpp
std::size_t min_password_length() const noexcept;
void set_min_password_length(std::size_t value) noexcept;

std::size_t max_password_length() const noexcept;
void set_max_password_length(std::size_t value) noexcept;

std::uint32_t iterations() const noexcept;
void set_iterations(std::uint32_t value) noexcept;

std::size_t salt_size() const noexcept;
void set_salt_size(std::size_t value) noexcept;

std::size_t hash_size() const noexcept;
void set_hash_size(std::size_t value) noexcept;
```

## `rix.auth.password`

`rix.auth.password` exposes password helpers.

### `hash`

```cpp
auto hashed = rix.auth.password.hash("correct-password");
```

With configuration:

```cpp
auto hashed = rix.auth.password.hash(
    "correct-password",
    config
);
```

### `verify`

```cpp
bool valid = rix.auth.password.verify(
    "correct-password",
    password_hash
);
```

With configuration:

```cpp
bool valid = rix.auth.password.verify(
    "correct-password",
    password_hash,
    config
);
```

### `accepts`

```cpp
bool accepted = rix.auth.password.accepts("correct-password");
```

With configuration:

```cpp
bool accepted = rix.auth.password.accepts(
    "correct-password",
    config
);
```

### `hasher`

```cpp
auto hasher = rix.auth.password.hasher();
```

With configuration:

```cpp
auto hasher = rix.auth.password.hasher(config);
```

## `User`

`User` is the persistent identity model used by Auth.

### Constructors

```cpp
User();

User(
    std::string id,
    std::string email,
    std::string password_hash,
    std::int64_t created_at
);
```

### Identity fields

```cpp
const std::string &id() const noexcept;
void set_id(std::string value);

const std::string &email() const noexcept;
void set_email(std::string value);

const std::string &password_hash() const noexcept;
void set_password_hash(std::string value);
```

The password hash is sensitive.

Do not log it or send it to clients.

### Account state

```cpp
bool email_verified() const noexcept;
void set_email_verified(bool value) noexcept;

bool active() const noexcept;
void set_active(bool value) noexcept;
```

### Timestamps

```cpp
std::int64_t created_at() const noexcept;
void set_created_at(std::int64_t value) noexcept;

std::int64_t updated_at() const noexcept;
void set_updated_at(std::int64_t value) noexcept;
```

### Helpers

```cpp
bool valid() const noexcept;
bool has_id() const noexcept;
bool has_email() const noexcept;

bool has_email(std::string_view value) const noexcept;
bool has_id(std::string_view value) const noexcept;

bool can_authenticate() const noexcept;
```

## `Session`

`Session` represents server-side authenticated session state.

### Constructors

```cpp
Session();

Session(
    std::string id,
    std::string user_id,
    std::int64_t created_at,
    std::int64_t expires_at
);
```

### Identity fields

```cpp
const std::string &id() const noexcept;
void set_id(std::string value);

const std::string &user_id() const noexcept;
void set_user_id(std::string value);
```

The session id is sensitive.

Do not log it in production.

### Timestamps

```cpp
std::int64_t created_at() const noexcept;
void set_created_at(std::int64_t value) noexcept;

std::int64_t expires_at() const noexcept;
void set_expires_at(std::int64_t value) noexcept;

std::int64_t last_seen_at() const noexcept;
void set_last_seen_at(std::int64_t value) noexcept;
```

### Revocation

```cpp
bool revoked() const noexcept;
void set_revoked(bool value) noexcept;
void revoke() noexcept;
```

### Helpers

```cpp
bool valid() const noexcept;
bool has_id() const noexcept;
bool has_user_id() const noexcept;

bool has_id(std::string_view value) const noexcept;
bool belongs_to(std::string_view value) const noexcept;

bool expired(std::int64_t now) const noexcept;
bool usable(std::int64_t now) const noexcept;
bool refreshable(std::int64_t now) const noexcept;

void refresh(std::int64_t now, std::int64_t ttl_seconds) noexcept;
```

## `Token`

`Token` represents a short-lived token attached to a user.

### Constructors

```cpp
Token();

Token(
    std::string value,
    std::string user_id,
    std::int64_t issued_at,
    std::int64_t expires_at
);
```

### Token fields

```cpp
const std::string &value() const noexcept;
void set_value(std::string value);

const std::string &user_id() const noexcept;
void set_user_id(std::string value);

const std::string &issuer() const noexcept;
void set_issuer(std::string value);
```

The raw token value is sensitive.

Do not log it in production.

### Timestamps

```cpp
std::int64_t issued_at() const noexcept;
void set_issued_at(std::int64_t value) noexcept;

std::int64_t expires_at() const noexcept;
void set_expires_at(std::int64_t value) noexcept;
```

### Revocation

```cpp
bool revoked() const noexcept;
void set_revoked(bool value) noexcept;
void revoke() noexcept;
```

### Helpers

```cpp
bool valid() const noexcept;
bool has_value() const noexcept;
bool has_user_id() const noexcept;

bool belongs_to(std::string_view value) const noexcept;
bool matches(std::string_view value) const noexcept;
bool issued_by(std::string_view value) const noexcept;

bool expired(std::int64_t now) const noexcept;
bool usable(std::int64_t now) const noexcept;
```

## `ManagedAuth`

`ManagedAuth` owns auth stores and exposes the public Auth API.

Use it when the auth object should safely own its user store and session store.

### Constructor

```cpp
ManagedAuth(
    std::unique_ptr<UserStore> users,
    std::unique_ptr<SessionStore> sessions,
    AuthConfig config
);
```

The facade creates `ManagedAuth` for:

```cpp
rix.auth.memory()
rix.auth.database(db)
rix.auth.managed(...)
```

### Auth operations

```cpp
AuthResult<User> register_user(const RegisterRequest &request);

AuthResult<LoginResult> login(const LoginRequest &request);

AuthStatus logout(std::string_view session_id);

AuthStatus logout_user(std::string_view user_id);

AuthResult<Session> authenticate_session(std::string_view session_id);

AuthResult<Session> refresh_session(std::string_view session_id);

AuthResult<Token> issue_token(std::string_view user_id);
```

### Accessors

```cpp
const AuthConfig &config() const noexcept;
const PasswordHasher &password_hasher() const noexcept;

Auth &service() noexcept;
const Auth &service() const noexcept;

UserStore &users() noexcept;
const UserStore &users() const noexcept;

SessionStore &sessions() noexcept;
const SessionStore &sessions() const noexcept;
```

Example:

```cpp
auto auth = rix.auth.memory();

auto all_users = auth.users().all();
```

## `UserStore`

`UserStore` is the abstract persistence interface for users.

### Methods

```cpp
virtual AuthStatus create(const User &user) = 0;

virtual AuthStatus update(const User &user) = 0;

virtual AuthStatus remove_by_id(std::string_view id) = 0;

virtual AuthResult<std::optional<User>>
find_by_id(std::string_view id) const = 0;

virtual AuthResult<std::optional<User>>
find_by_email(std::string_view email) const = 0;

virtual AuthResult<bool>
exists_by_id(std::string_view id) const = 0;

virtual AuthResult<bool>
exists_by_email(std::string_view email) const = 0;

virtual AuthResult<std::vector<User>> all() const = 0;
```

Concrete implementations:

```cpp
MemoryUserStore
DbUserStore
```

## `SessionStore`

`SessionStore` is the abstract persistence interface for sessions.

### Methods

```cpp
virtual AuthStatus create(const Session &session) = 0;

virtual AuthStatus update(const Session &session) = 0;

virtual AuthStatus remove_by_id(std::string_view id) = 0;

virtual AuthStatus revoke_by_id(std::string_view id) = 0;

virtual AuthStatus revoke_by_user_id(std::string_view user_id) = 0;

virtual AuthResult<std::optional<Session>>
find_by_id(std::string_view id) const = 0;

virtual AuthResult<std::vector<Session>>
find_by_user_id(std::string_view user_id) const = 0;

virtual AuthResult<bool>
exists_by_id(std::string_view id) const = 0;

virtual AuthResult<std::vector<Session>> all() const = 0;
```

Concrete implementations:

```cpp
MemorySessionStore
DbSessionStore
```

## `MemoryUserStore`

`MemoryUserStore` is an in-memory user store.

It is useful for tests, examples, local development, and small applications that do not need durable user persistence.

### Methods

It implements all `UserStore` methods.

Additional helpers:

```cpp
void clear();

std::size_t size() const;

bool empty() const;
```

Example:

```cpp
auto auth = rix.auth.memory();

auto users = auth.users().all();

if (users.ok())
{
  rix.debug.print("users:", users.value().size());
}
```

## `MemorySessionStore`

`MemorySessionStore` is an in-memory session store.

It is useful for tests, examples, local development, and small applications that do not need durable session persistence.

### Methods

It implements all `SessionStore` methods.

Additional helpers:

```cpp
void clear();

std::size_t size() const;

bool empty() const;
```

Example:

```cpp
auto auth = rix.auth.memory();

auto sessions = auth.sessions().all();

if (sessions.ok())
{
  rix.debug.print("sessions:", sessions.value().size());
}
```

## `DbUserStore`

`DbUserStore` is a database-backed user store.

It persists users through Vix database storage.

### Constructor

```cpp
explicit DbUserStore(
    vix::db::Database &database,
    bool create_schema = true);
```

### Methods

It implements all `UserStore` methods.

Additional helper:

```cpp
AuthStatus ensure_schema();
```

The store expects a table named:

```txt
rix_auth_users
```

The constructor can create the table automatically when requested.

## `DbSessionStore`

`DbSessionStore` is a database-backed session store.

It persists sessions through Vix database storage.

### Constructor

```cpp
explicit DbSessionStore(
    vix::db::Database &database,
    bool create_schema = true);
```

### Methods

It implements all `SessionStore` methods.

Additional helper:

```cpp
AuthStatus ensure_schema();
```

The store expects a table named:

```txt
rix_auth_sessions
```

The constructor can create the table automatically when requested.

## `rix.auth.stores`

`rix.auth.stores` exposes store helpers.

### Memory stores

```cpp
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();
```

### Database stores

```cpp
auto users = rix.auth.stores.database_users(db);
auto sessions = rix.auth.stores.database_sessions(db);
```

Use these helpers for advanced store wiring.

For normal application code, prefer:

```cpp
auto auth = rix.auth.memory();
```

or:

```cpp
auto auth = rix.auth.database(db, config);
```

## Version helpers

`rix.auth` exposes package version helpers.

```cpp
std::string version() const;

int version_major() const noexcept;
int version_minor() const noexcept;
int version_patch() const noexcept;
int version_number() const noexcept;
```

Example:

```cpp
auto version = rix.auth.version();
```

## Common patterns

### Register and login

```cpp
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"
});

if (registered.failed())
{
  return 1;
}

auto login = auth.login({
    "ada@example.com",
    "correct-password"
});

if (login.failed())
{
  return 1;
}
```

### Authenticate session

```cpp
auto session = auth.authenticate_session(
    login.value().session.id()
);

if (session.failed())
{
  return 1;
}
```

### Refresh session

```cpp
auto refreshed = auth.refresh_session(
    login.value().session.id()
);

if (refreshed.failed())
{
  return 1;
}
```

### Logout

```cpp
auto status = auth.logout(
    login.value().session.id()
);

if (status.failed())
{
  return 1;
}
```

### Issue token

```cpp
auto token = auth.issue_token(
    registered.value().id()
);

if (token.failed())
{
  return 1;
}
```

### Handle errors

```cpp
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

## Security reminders

Do not log:

```txt
plain-text passwords
password hashes
session ids
raw token values
```

Use memory auth for examples and tests.

Use database auth for real applications.

Use production configuration for real deployments.

Always check results before calling `.value()`.

## What you should remember

Application code usually starts with:

```cpp
#include <rix.hpp>
```

Then creates Auth with:

```cpp
auto auth = rix.auth.memory();
```

or:

```cpp
auto auth = rix.auth.database(db, config);
```

Main operations:

```cpp
auth.register_user(...)
auth.login(...)
auth.authenticate_session(...)
auth.refresh_session(...)
auth.logout(...)
auth.logout_user(...)
auth.issue_token(...)
```

Password helpers:

```cpp
rix.auth.password.hash(...)
rix.auth.password.verify(...)
rix.auth.password.accepts(...)
```

Configuration helpers:

```cpp
rix.auth.config.development()
rix.auth.config.production()
rix.auth.config.validate(config)
```

Error helpers:

```cpp
rix.auth.error.to_string(error)
rix.auth.error.is(error, code)
```

Stores:

```cpp
rix.auth.stores.memory_users()
rix.auth.stores.memory_sessions()
rix.auth.stores.database_users(db)
rix.auth.stores.database_sessions(db)
```

## Next step

Continue with package examples.

Next: [Examples](/examples/auth/memory-register-login)
