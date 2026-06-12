# Facade API

This page summarizes the public API exposed by the unified Rix facade.

The facade is available from:

```cpp
#include <rix.hpp>
```

It exposes the global object:

```cpp
rix
```

Current mounted package APIs:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

The facade is designed for application code.

It keeps Rix usage consistent:

```txt
Package API -> rix.<package>
```

## Include

Use the unified facade header:

```cpp
#include <rix.hpp>
```

Example:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  auto auth = rix.auth.memory();

  return 0;
}
```

For most documentation examples, this is the recommended include.

## Facade object

The global facade object is:

```cpp
rix
```

It is an inline object that groups the selected Rix modules.

Example:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

Each mounted package is exposed as a member of the facade.

## Package model

Each Rix package follows the same naming model:

```txt
Package  : rix/name
Header   : <rix/name.hpp>
Namespace: rixlib::name
Facade   : rix.name
```

Examples:

```txt
rix/auth  -> rix.auth
rix/csv   -> rix.csv
rix/debug -> rix.debug
rix/pdf   -> rix.pdf
```

The unified facade package is:

```txt
Package: rix/rix
Header : <rix.hpp>
Object : rix
```

## Install

For a project, install the facade package:

```bash
vix add rix/rix
vix install
```

If the project uses `vix.app`, declare it in `deps`:

```txt
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

Do not put Rix packages in `packages`.

## `rix.auth`

`rix.auth` exposes the Auth package through the facade.

It is used for registration, login, password hashing, sessions, tokens, configuration, stores, and error helpers.

### Create memory auth

```cpp
auto auth = rix.auth.memory();
```

Memory auth is useful for examples, tests, and local development.

It stores users and sessions in memory.

Data is lost when the process exits.

### Create memory auth with config

```cpp
auto config = rix.auth.config.development();

config.set_min_password_length(8);
config.set_issuer("my-app");

auto auth = rix.auth.memory(config);
```

### Create database auth

```cpp
auto auth = rix.auth.database(db);
```

With configuration:

```cpp
auto config = rix.auth.config.production();

auto auth = rix.auth.database(db, config);
```

Database auth uses database-backed user and session stores.

Use it when users and sessions must survive process restarts.

### Register a user

```cpp
auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});
```

Check the result before using the value:

```cpp
if (registered.failed())
{
  const auto &error = registered.error();
  return 1;
}

auto user = registered.value();
```

### Login

```cpp
auto login = auth.login({
    "ada@example.com",
    "correct-password"});
```

A successful login contains:

```cpp
login.value().user
login.value().session
login.value().token
```

### Authenticate a session

```cpp
auto session = auth.authenticate_session(login.value().session.id());
```

A usable session must be valid, not revoked, and not expired.

### Refresh a session

```cpp
auto refreshed = auth.refresh_session(login.value().session.id());
```

### Logout

```cpp
auto status = auth.logout(login.value().session.id());
```

For operations that only return success or failure, check the status:

```cpp
if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

### Logout all sessions for a user

```cpp
auto status = auth.logout_user(user_id);
```

### Issue a token

```cpp
auto token = auth.issue_token(user_id);
```

### Password helpers

Hash a password:

```cpp
auto hashed = rix.auth.password.hash("correct-password");
```

Verify a password:

```cpp
bool valid = rix.auth.password.verify(
    "correct-password",
    hashed.value()
);
```

Check whether a password satisfies the policy:

```cpp
bool accepted = rix.auth.password.accepts("correct-password");
```

Create a password hasher:

```cpp
auto hasher = rix.auth.password.hasher();
```

With configuration:

```cpp
auto config = rix.auth.config.production();
auto hasher = rix.auth.password.hasher(config);
```

### Config helpers

Development config:

```cpp
auto config = rix.auth.config.development();
```

Production config:

```cpp
auto config = rix.auth.config.production();
```

Development config with custom minimum password length:

```cpp
auto config = rix.auth.config.development_with_min_password_length(10);
```

Production config with custom minimum password length:

```cpp
auto config = rix.auth.config.production_with_min_password_length(12);
```

Validate config:

```cpp
auto status = rix.auth.config.validate(config);

if (status.failed())
{
  return 1;
}
```

Check config validity:

```cpp
bool ok = rix.auth.config.valid(config);
```

### Store helpers

Create memory stores:

```cpp
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();
```

Create database stores:

```cpp
auto users = rix.auth.stores.database_users(db);
auto sessions = rix.auth.stores.database_sessions(db);
```

Create managed auth with owned stores:

```cpp
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto result = rix.auth.managed(
    std::move(users),
    std::move(sessions)
);
```

If the result succeeds:

```cpp
auto auth = result.move_value();
```

Create auth with caller-owned stores:

```cpp
auto users = rix.auth.stores.memory_users();
auto sessions = rix.auth.stores.memory_sessions();

auto auth = rix.auth.create(*users, *sessions);
```

In this case, the stores must stay alive for as long as the `auth` object is used.

For normal application code, prefer:

```cpp
auto auth = rix.auth.memory();
```

or:

```cpp
auto auth = rix.auth.database(db);
```

### Error helpers

Convert an error to a stable string:

```cpp
rix.auth.error.to_string(error)
```

Create an error:

```cpp
auto error = rix.auth.error.make(
    rixlib::auth::AuthErrorCode::InvalidInput,
    "Invalid input"
);
```

Check an error:

```cpp
bool failed = rix.auth.error.failed(error);
bool ok = rix.auth.error.ok(error);
```

Check a specific error code:

```cpp
bool invalid = rix.auth.error.is(
                error,
                rixlib::auth::AuthErrorCode::InvalidInput
              );
```

## `rix.csv`

`rix.csv` exposes the CSV package through the facade.

It is used for parsing, writing, loading, saving, and transforming CSV data.

### Parse CSV

```cpp
auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n"
    "Gaspard,Vix.cpp\n"
);
```

The result is a table of rows.

### Write CSV

```cpp
auto output = rix.csv.write(table);
```

### Write one row

```cpp
auto line = rix.csv.write_row({"Ada", "C++"});
```

### Load a CSV file

```cpp
auto table = rix.csv.load("users.csv");
```

### Save a CSV file

```cpp
rix.csv.save("users.csv", table);
```

### Write to an output stream

```cpp
std::ostringstream out;

rix.csv.write_to(out, table);
```

### Version

```cpp
auto version = rix.csv.version();
```

## `rix.debug`

`rix.debug` exposes lightweight debug utilities.

Use it for quick output, formatting, error output, debug-only output, string rendering, and value inspection.

For application logging, prefer the Vix logging system.

### Print

```cpp
rix.debug.print("Hello", "Rix");
```

Prints values separated by spaces with a trailing newline.

### Error print

```cpp
rix.debug.eprint("error:", "something failed");
```

Prints to stderr.

### Debug-only print

```cpp
rix.debug.dprint("debug value:", 42);
```

Use this for debug-oriented output.

### Sprint

```cpp
auto text = rix.debug.sprint("user:", "Ada");
```

Returns the rendered output as a string.

### Format

```cpp
auto text = rix.debug.format(
    "Package: {}",
    "rix/rix");
```

Supported placeholders:

```txt
{}    automatic argument indexing
{0}   explicit positional indexing
{{    escaped opening brace
}}    escaped closing brace
```

Example:

```cpp
auto a = rix.debug.format("Hello, {}", "Rix");
auto b = rix.debug.format("{0} uses {1}", "Rix", "C++");
auto c = rix.debug.format("{{ config }} = {}", "ready");
```

Format specifiers are intentionally not supported:

```txt
{:.2f}
{:>10}
```

### Inspect

```cpp
rix.debug.inspect(value);
```

Use inspection when you want more structured debug output for values, containers, and supported C++ types.

## `rix.pdf`

`rix.pdf` exposes the PDF package through the facade.

It is used to create documents, add pages, draw text, draw shapes, write tables, embed images, set metadata, serialize PDF bytes, and save files.

### Create a document

```cpp
auto doc = rix.pdf.document();
```

Create with custom page settings:

```cpp
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::one_inch()
);
```

### Add a page

```cpp
auto &page = doc.add_page();
```

### Draw text

```cpp
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf"
);
```

### Draw a heading

```cpp
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF",
    1
);
```

### Draw a paragraph

```cpp
y = page.paragraph(
    page.x_left(),
    y - 10.0F,
    page.content_width(),
    "Rix PDF provides document generation helpers."
);
```

### Draw aligned text

```cpp
page.text_aligned(
    page.x_left(),
    y,
    page.content_width(),
    "Centered text",
    rixlib::pdf::Align::Center
);
```

### Draw lines and shapes

```cpp
page.line(
    page.x_left(),
    y,
    page.x_right(),
    y
);
```

```cpp
page.rect(
    page.x_left(),
    y - 60.0F,
    140.0F,
    50.0F
);
```

```cpp
page.fill_rect(
    page.x_left(),
    y - 120.0F,
    140.0F,
    50.0F,
    rixlib::pdf::Color::light_gray()
);
```

```cpp
page.circle(
    page.x_left() + 70.0F,
    y - 200.0F,
    35.0F
);
```

### Create a table

```cpp
rixlib::pdf::Table table;

table.set_column_widths({
    160.0F,
    160.0F,
    160.0F
});

table.add_header({
    "Name",
    "Language",
    "Project"
});

table.add_row({
    "Ada",
    "C++",
    "Rix"
});

page.table(
    page.x_left(),
    y,
    table
);
```

### Set metadata

```cpp
doc.set_title("Rix PDF Example")
   .set_author("Rix")
   .set_subject("PDF generation")
   .set_keywords("rix,pdf,vix,cpp");
```

### Save a PDF

```cpp
auto saved = rix.pdf.save(doc, "example.pdf");

if (saved.failed())
{
  const auto &error = saved.error();
  return 1;
}
```

### Write PDF bytes

```cpp
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  return 1;
}
```

### Make a simple text PDF

```cpp
auto saved = rix.pdf.make_text(
    "note.pdf",
    "This file was generated with rix.pdf.make_text.",
    "Rix PDF"
);
```

### Load a JPEG image

```cpp
auto image = rix.pdf.image.load_jpeg("photo.jpg");

if (image.failed())
{
  return 1;
}

page.image_fit(
    image.value(),
    page.x_left(),
    page.y_top() - 200.0F,
    300.0F,
    200.0F
);
```

### PDF error helpers

Convert an error to a stable string:

```cpp
rix.pdf.error.to_string(error)
```

Example:

```cpp
auto saved = rix.pdf.save(doc, "");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message()
  );
  return 1;
}
```

## Feature macros

The facade can be restricted with feature macros.

Default:

```cpp
#include <rix.hpp>
```

Restricted facade:

```cpp
#define RIX_ENABLE_AUTH
#include <rix.hpp>
```

Available macros:

```cpp
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

Feature macros must be defined before including `rix.hpp`.

## Result pattern

Rix packages prefer explicit results for operations that can fail.

For Auth:

```cpp
auto login = auth.login({"ada@example.com", "correct-password"});

if (login.failed())
{
  const auto &error = login.error();
  return 1;
}
```

For PDF:

```cpp
auto saved = rix.pdf.save(doc, "example.pdf");

if (saved.failed())
{
  const auto &error = saved.error();
  return 1;
}
```

For status-only operations:

```cpp
auto status = auth.logout(session_id);

if (status.failed())
{
  const auto &error = status.error();
  return 1;
}
```

Always check `failed()` or `ok()` before using `.value()`.

## Complete facade example

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Rix facade example");

  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"ada@example.com", "correct-password"});

  if (registered.failed())
  {
    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(registered.error()),
        registered.error().message()
    );
    return 1;
  }

  auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
  );

  rix.debug.print("csv rows:", table.size());

  auto doc = rix.pdf.document();
  auto &page = doc.add_page();

  page.heading(
      page.x_left(),
      page.y_top(),
      "Rix Facade",
      1
  );

  auto saved = rix.pdf.save(doc, "facade.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message()
    );
    return 1;
  }

  rix.debug.print("created:", "facade.pdf");

  return 0;
}
```

Run it as a single file:

```bash
vix run main.cpp
```

Or use it inside a Vix project with:

```txt
deps = [
  "rix/rix",
]
```

## What you should remember

Use:

```cpp
#include <rix.hpp>
```

Then call package APIs through:

```cpp
rix.auth
rix.csv
rix.debug
rix.pdf
```

Install the facade package with:

```bash
vix add rix/rix
vix install
```

Declare it in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

Use `rix.debug` for lightweight debug output.

Use the Vix logging system for application logs.

Use `rixlib::...` namespaces when you need lower-level package types or advanced usage.

## Next step

Continue with the package overview.

Next: [Packages](/packages/)
