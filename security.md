# Security Policy

Security matters for Rix because some packages can handle application data, authentication, passwords, sessions, tokens, generated files, and future userland features for Vix.cpp applications.

This page explains how to report security issues and how security-sensitive Rix code should be handled.

## The short version

Do not open a public issue for sensitive security problems.

Report security issues privately to the maintainers.

Do not publish:

```txt id="q8m4xa"
exploits
private keys
tokens
session ids
password hashes
plain-text passwords
private user data
```

If you are not sure whether something is security-sensitive, report it privately first.

## Scope

This policy applies to Rix packages and documentation, including:

```txt id="n5v9qc"
rix/auth
rix/csv
rix/debug
rix/pdf
rix/rix
future Rix packages
examples
tests
documentation
registry metadata
```

It also applies to security-sensitive integrations between Rix and Vix.cpp applications.

## What counts as a security issue

Security issues may include:

```txt id="k7x2ma"
authentication bypass
password hashing weakness
session validation weakness
token leakage
unsafe token generation
unsafe session handling
secret exposure
private data exposure
path traversal
unsafe file writing
unsafe parsing behavior
unsafe defaults
documentation that encourages insecure usage
```

If a vulnerability can affect user data, authentication, generated files, application secrets, or service integrity, treat it as security-sensitive.

## Report privately

Please report security issues privately.

Include:

```txt id="p9c5xr"
the affected package
the affected version or commit if known
a clear description of the issue
steps to reproduce if safe to share
impact
suggested fix if available
whether the issue is already public
```

Do not include more sensitive data than necessary.

Do not post exploit details publicly before maintainers have had a chance to investigate and release a fix.

## Where to report

Use the private security contact or security advisory channel provided by the repository if available.

If the repository has a GitHub Security Advisory option, prefer that.

If no private security channel is listed yet, contact the project maintainer privately through the available maintainer contact.

Avoid public issues for sensitive reports.

## Good security report example

```txt id="q4m8vb"
Package: rix/auth
Version: 0.2.0
Issue: revoked sessions can still pass authenticate_session
Impact: logged-out users may remain authenticated
Reproduction:
1. register user
2. login
3. logout session
4. call authenticate_session with the old session id
Expected: failure
Actual: success
Suggested fix: check session.revoked() before returning success
```

A good report is clear, reproducible, and focused.

## What not to include publicly

Do not publicly post:

```txt id="x2n7pd"
working exploit code
real user data
passwords
password hashes
raw token values
session ids
private keys
production secrets
private server URLs
private logs containing secrets
```

If a public issue already contains sensitive data, notify maintainers so it can be removed.

## Maintainer response

Maintainers should review security reports carefully.

A typical response process is:

```txt id="t8q5hm"
acknowledge the report
confirm the affected package and versions
reproduce the issue
assess severity
prepare a fix
add tests
update documentation if needed
release a patched version
publish advisory notes when appropriate
```

The exact process may depend on the severity and complexity of the issue.

## Responsible disclosure

Please give maintainers reasonable time to investigate and fix security issues before public disclosure.

Responsible disclosure helps protect users who depend on Rix packages.

When a fix is released, maintainers may publish a summary that explains:

```txt id="b6x3rd"
what was affected
what was fixed
which versions are safe
how users should update
```

The summary should avoid unnecessary exploit details.

## Supported versions

Security fixes are normally applied to the current maintained version of each package.

Early Rix packages may move quickly.

Users should keep packages updated through the Vix workflow:

```bash id="z5v8ka"
vix registry sync
vix install
```

If a package has multiple supported release lines in the future, this policy should be updated with a version support table.

## Updating after a security fix

After a security release, users should refresh registry metadata and reinstall dependencies:

```bash id="c9q2mx"
vix registry sync
vix install
```

Then rebuild and test the application:

```bash id="h7n4qc"
vix build
vix tests
```

For deployed applications, rebuild and redeploy according to the project deployment workflow.

## Security-sensitive packages

Some packages need extra care.

Examples:

```txt id="d3x8vp"
rix/auth
future crypto helpers
future database adapters
future HTTP/session adapters
future storage adapters
```

Security-sensitive packages should prefer:

```txt id="j2m9wa"
safe defaults
explicit errors
clear documentation
tests for failure paths
no secret logging
short token lifetimes
intentional session lifetimes
constant-time comparison where appropriate
```

## Auth security rules

For `rix/auth`, do not log:

```txt id="w8c5nr"
plain-text passwords
password hashes
raw tokens
session ids
private user secrets
```

Auth code should treat these values as sensitive.

Use explicit results for failures:

```cpp id="k5v7ma"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

if (login.failed())
{
  rix.debug.eprint(
      "auth error:",
      rix.auth.error.to_string(login.error()),
      login.error().message());

  return 1;
}
```

Do not print token values or session ids in production logs.

## Password handling

Passwords should be handled carefully.

Applications should:

```txt id="r6q9xd"
never store plain-text passwords
never log passwords
never log password hashes
use configured password hashing helpers
reject weak passwords according to policy
use production configuration for production apps
```

Example:

```cpp id="p2n8fc"
auto hashed = rix.auth.password.hash("correct-password");

if (hashed.failed())
{
  return 1;
}
```

The returned hash should be stored securely.

The plain-text password should not be stored.

## Session handling

Sessions should be treated as sensitive.

Applications should:

```txt id="y4m6qv"
not log raw session ids
revoke sessions on logout
check session expiration
use secure cookies when sessions are sent through browsers
use HTTPS in production
choose intentional session lifetimes
```

Logout should make a session unusable.

A revoked or expired session should not authenticate.

## Token handling

Tokens should be treated as secrets.

Applications should:

```txt id="f9x3ka"
not log raw token values
use short token lifetimes
validate token expiration
validate token issuer when relevant
send tokens only over HTTPS
avoid storing tokens in unsafe locations
```

Token metadata such as issuer and expiration can be useful for diagnostics.

Raw token values should not be printed.

## Production configuration

Use stricter configuration for real applications.

Example shape:

```cpp id="m7c5vx"
auto config = rix.auth.config.production();

config.set_min_password_length(12);
config.set_token_ttl_seconds(60 * 15);
config.set_session_ttl_seconds(60 * 60 * 24 * 7);
config.set_issuer("my-app");

auto auth = rix.auth.memory(config);
```

Memory stores are useful for examples and tests.

Production applications should use durable stores when available.

## Memory store warning

Memory stores do not persist data after the process exits.

Use memory stores for:

```txt id="q3p8za"
examples
tests
local development
temporary demos
```

Do not rely on memory stores for durable production user accounts.

Use database-backed stores when building real applications.

## File generation security

Packages such as `rix/pdf` can write files.

Applications should:

```txt id="v8n2hr"
validate output paths
avoid writing to unexpected locations
create output folders intentionally
handle file open and write errors
avoid writing user-controlled paths without validation
avoid exposing private generated files publicly
```

Example:

```cpp id="a6q9mx"
auto saved = rix.pdf.save(doc, "output/report.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

If the output path comes from a user request, validate it before saving.

## Parsing security

Packages that parse input should handle invalid input safely.

Parsing code should avoid:

```txt id="r4v8kb"
crashes on malformed input
unbounded memory growth
unsafe assumptions about row sizes
unsafe assumptions about field counts
hidden failures
```

For CSV input, users should check row sizes before indexed access:

```cpp id="x9m2pd"
if (row.size() > 2)
{
  rix.debug.print(row[2]);
}
```

## Debug output security

`rix.debug` is useful for examples and small tools.

It should not be used to print secrets.

Avoid printing:

```txt id="c5w9qa"
passwords
password hashes
tokens
session ids
private keys
secrets
private user data
```

For real Vix application logs, prefer:

```cpp id="z8q2vm"
vix::log
```

and still avoid logging secrets.

## Documentation security

Documentation should not encourage unsafe behavior.

Docs should avoid:

```txt id="n7x4hd"
printing raw tokens
printing session ids
storing plain-text passwords
ignoring result failures
calling value() before checking success
using memory stores as production storage
saving files to user-controlled paths without validation
```

Examples should show safe patterns.

## Safe result handling

Rix APIs use explicit results and statuses for expected failures.

Correct:

```cpp id="d6k8rc"
auto result = rix.pdf.write(doc);

if (result.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(result.error()),
      result.error().message());

  return 1;
}

const auto &bytes = result.value();
```

Wrong:

```cpp id="g5m9xq"
auto result = rix.pdf.write(doc);

const auto &bytes = result.value();
```

Always check success before reading values.

## Dependency security

Keep dependencies intentional.

Rix packages belong in `deps`:

```txt id="y3v8mb"
deps = [
  "rix/rix",
]
```

Do not put Rix packages in `packages`:

```txt id="f4q7vd"
packages = [
  "rix/rix",
]
```

After a security update, refresh and reinstall:

```bash id="w2x6qp"
vix registry sync
vix install
```

## Supply chain notes

Rix packages are installed through the Vix Registry.

Applications should:

```txt id="n6c9hd"
review dependencies
keep lockfiles when applicable
sync registry metadata intentionally
update packages after security releases
avoid using unknown package sources
```

When publishing a Rix package, keep package metadata accurate.

## Reporting insecure examples

If you find an insecure example in documentation, report it.

Examples of insecure docs include:

```txt id="j8q5kc"
printing a raw token
printing a session id
saving to an unsafe path
using memory auth as production storage
ignoring errors
calling value() before checking failed()
```

Documentation bugs can become security bugs when users copy examples.

## Security review checklist

For security-sensitive changes, check:

```txt id="r7x3vm"
Are secrets logged?
Are errors explicit?
Are invalid inputs handled?
Are tokens and sessions validated?
Are expirations checked?
Are revoked sessions rejected?
Are password policies enforced?
Are file paths validated?
Are tests added for failure paths?
Are docs updated with safe usage?
```

## Common mistakes

### Opening a public issue with exploit details

Do not publicly post exploit details for a live vulnerability.

Report privately first.

### Logging secrets

Do not log:

```txt id="p6m8xb"
passwords
password hashes
tokens
session ids
private keys
secrets
```

### Using memory auth as production storage

Memory auth is not durable.

Use it for examples and tests.

Use durable stores for real applications.

### Calling `value()` before checking success

Wrong:

```cpp id="t9q2za"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

auto session = login.value().session;
```

Correct:

```cpp id="x4v7nd"
auto login = auth.login({
    "ada@example.com",
    "correct-password"});

if (login.failed())
{
  return 1;
}

auto session = login.value().session;
```

### Printing raw tokens

Wrong:

```cpp id="p4q8zb"
rix.debug.print("token:", token.value().value());
```

Better:

```cpp id="v2k9qc"
rix.debug.print("token issuer:", token.value().issuer());
rix.debug.print("token expires at:", token.value().expires_at());
```

### Printing session ids

Avoid:

```cpp id="c8w5rp"
rix.debug.print("session:", login.value().session.id());
```

Prefer safer diagnostics:

```cpp id="z4v8qa"
rix.debug.print("session created");
```

### Saving to untrusted paths

Do not directly save generated files to paths controlled by users without validation.

Wrong:

```cpp id="q8k5mv"
rix.pdf.save(doc, request_path);
```

Better:

```cpp id="s6n4vm"
auto safe_path = "output/report.pdf";
auto saved = rix.pdf.save(doc, safe_path);
```

Validate and restrict paths in real applications.

## What you should remember

Report security issues privately.

Do not publish secrets or exploit details.

Do not log passwords, hashes, tokens, session ids, private keys, or secrets.

Use explicit results and check failures.

Use production configuration for production apps.

Use durable stores for real user accounts.

Validate file paths before saving generated files.

Use Vix commands to update after security releases:

```bash id="v8q3md"
vix registry sync
vix install
vix build
vix tests
```

Rix should stay simple, but security-sensitive code must stay careful.
