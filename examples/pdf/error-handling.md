# Error Handling

This example shows how to handle expected PDF errors with `rix/pdf`.

The example uses the public Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

and accesses PDF through:

```cpp id="n5v9qc"
rix.pdf
```

Use this example when you want to check save errors, print stable error codes, and avoid calling `value()` before checking a result.

## Create the file

```bash id="k7x2ma"
mkdir -p ~/rix-pdf-error-example
cd ~/rix-pdf-error-example
touch error_handling.cpp
```

Add:

```cpp id="p9c5xr"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "This example intentionally uses an invalid output path.");

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 0;
  }

  return 1;
}
```

Run it:

```bash id="q4m8vb"
vix run error_handling.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x2n7pd"
vix install -g rix/rix
vix run error_handling.cpp
```

The failure is expected because the output path is empty.

## What this example does

The example creates a document:

```cpp id="b6x3rd"
auto doc = rix.pdf.document();
```

It adds visible content:

```cpp id="z5v8ka"
auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "This example intentionally uses an invalid output path.");
```

It intentionally saves to an invalid path:

```cpp id="c9q2mx"
auto saved = rix.pdf.save(doc, "");
```

Then it handles the error:

```cpp id="h7n4qc"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 0;
}
```

## PDF operations return explicit results

`rix/pdf` does not use exceptions for normal expected failures such as invalid paths, file write failures, or image loading errors.

It returns explicit values that you can check.

There are two common return types:

```txt id="d3x8vp"
PdfStatus
PdfResult<T>
```

## `PdfStatus`

`PdfStatus` is used when an operation only succeeds or fails.

Example:

```cpp id="j2m9wa"
auto saved = rix.pdf.save(doc, "output.pdf");
```

`save` returns a status.

Use:

```cpp id="w8c5nr"
saved.ok()
saved.failed()
saved.error()
```

Example:

```cpp id="k5v7ma"
if (saved.failed())
{
  const auto &error = saved.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

## `PdfResult<T>`

`PdfResult<T>` is used when an operation returns a value on success.

Example:

```cpp id="r6q9xd"
auto bytes = rix.pdf.write(doc);
```

`write` returns:

```txt id="p2n8fc"
PdfResult<std::string>
```

Use:

```cpp id="y4m6qv"
bytes.ok()
bytes.failed()
bytes.value()
bytes.error()
```

Only call `value()` after checking success.

```cpp id="f9x3ka"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());

  return 1;
}

rix.debug.print("bytes:", bytes.value().size());
```

## Error values

A PDF error contains:

```txt id="m7c5vx"
a stable error code
a human-readable message
```

Access the error:

```cpp id="q3p8za"
const auto &error = saved.error();
```

Convert the code to text:

```cpp id="v8n2hr"
rix.pdf.error.to_string(error)
```

Read the message:

```cpp id="a6q9mx"
error.message()
```

## Stable error codes

PDF error codes are available through:

```cpp id="r4v8kb"
rixlib::pdf::PdfErrorCode
```

Common codes include:

```cpp id="x9m2pd"
rixlib::pdf::PdfErrorCode::InvalidInput
rixlib::pdf::PdfErrorCode::InvalidImage
rixlib::pdf::PdfErrorCode::UnsupportedImageFormat
rixlib::pdf::PdfErrorCode::FileOpenFailed
rixlib::pdf::PdfErrorCode::FileReadFailed
rixlib::pdf::PdfErrorCode::FileWriteFailed
rixlib::pdf::PdfErrorCode::SerializationFailed
rixlib::pdf::PdfErrorCode::WriterError
rixlib::pdf::PdfErrorCode::Unknown
```

Use these when your application needs different behavior for different failures.

## Check a specific error

Use:

```cpp id="c5w9qa"
rix.pdf.error.is(
    error,
    rixlib::pdf::PdfErrorCode::InvalidInput)
```

Example:

```cpp id="z8q2vm"
if (rix.pdf.error.is(
        saved.error(),
        rixlib::pdf::PdfErrorCode::InvalidInput))
{
  rix.debug.eprint("hint:", "use a real output file path");
}
```

## Save error pattern

Use this pattern when saving files:

```cpp id="n7x4hd"
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  const auto &error = saved.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

This keeps file failures explicit.

## Write error pattern

Use this pattern when writing PDF bytes:

```cpp id="d6k8rc"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  const auto &error = bytes.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}

const auto &pdf_data = bytes.value();
```

Use `write` when you need the PDF bytes in memory.

Use `save` when you want a file.

## Invalid path example

This intentionally fails:

```cpp id="g5m9xq"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Invalid path example");

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    const auto &error = saved.error();

    rix.debug.eprint(
        "expected pdf error:",
        rix.pdf.error.to_string(error),
        error.message());

    if (rix.pdf.error.is(
            error,
            rixlib::pdf::PdfErrorCode::InvalidInput))
    {
      rix.debug.eprint("hint:", "the output path cannot be empty");
    }

    return 0;
  }

  return 1;
}
```

Run:

```bash id="y3v8mb"
vix run error_handling.cpp
```

## Missing folder example

Saving to a folder that does not exist can fail:

```cpp id="f4q7vd"
auto saved = rix.pdf.save(doc, "output/report.pdf");
```

Create the folder first:

```bash id="w2x6qp"
mkdir -p output
```

Then save:

```cpp id="n6c9hd"
auto saved = rix.pdf.save(doc, "output/report.pdf");
```

## Handle file open errors

```cpp id="j8q5kc"
auto saved = rix.pdf.save(doc, "missing-folder/report.pdf");

if (saved.failed())
{
  const auto &error = saved.error();

  if (rix.pdf.error.is(
          error,
          rixlib::pdf::PdfErrorCode::FileOpenFailed))
  {
    rix.debug.eprint("file error:", "cannot open output file");
    return 1;
  }

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

This is useful when your application wants a special message for file path failures.

## Image loading error example

Image loading also returns a result.

```cpp id="r7x3vm"
auto image = rix.pdf.image.load_jpeg("missing.jpg");

if (image.failed())
{
  rix.debug.eprint(
      "image error:",
      rix.pdf.error.to_string(image.error()),
      image.error().message());

  return 1;
}
```

Only use `image.value()` after checking success.

```cpp id="p6m8xb"
page.image_fit(
    image.value(),
    page.x_left(),
    page.y_top() - 200.0F,
    200.0F,
    160.0F);
```

## Unsupported image format example

The first image implementation supports JPEG images.

Loading a PNG through `load_jpeg` can fail:

```cpp id="t9q2za"
auto image = rix.pdf.image.load_jpeg("logo.png");

if (image.failed())
{
  if (rix.pdf.error.is(
          image.error(),
          rixlib::pdf::PdfErrorCode::UnsupportedImageFormat))
  {
    rix.debug.eprint("image error:", "only JPEG images are supported");
    return 1;
  }
}
```

## Complete image error example

```cpp id="x4v7nd"
#include <rix.hpp>

int main()
{
  auto image = rix.pdf.image.load_jpeg("missing.jpg");

  if (image.failed())
  {
    const auto &error = image.error();

    rix.debug.eprint(
        "expected image error:",
        rix.pdf.error.to_string(error),
        error.message());

    return 0;
  }

  return 1;
}
```

Run:

```bash id="p4q8zb"
vix run error_handling.cpp
```

The failure is expected if the file does not exist.

## Write bytes safely

This example writes PDF bytes and checks the result before reading `value()`:

```cpp id="v2k9qc"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "PDF bytes example");

  auto bytes = rix.pdf.write(doc);

  if (bytes.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(bytes.error()),
        bytes.error().message());

    return 1;
  }

  rix.debug.print("generated bytes:", bytes.value().size());
  return 0;
}
```

Run:

```bash id="c8w5rp"
vix run error_handling.cpp
```

## Use errors in a Vix route

When generating a PDF inside a Vix route, return an HTTP error if generation fails.

```cpp id="z4v8qa"
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  app.get("/report.pdf", [](vix::Request &, vix::Response &res) {
    auto doc = rix.pdf.document();

    auto &page = doc.add_page();

    page.text(
        page.x_left(),
        page.y_top(),
        "Hello from rix.pdf");

    auto bytes = rix.pdf.write(doc);

    if (bytes.failed())
    {
      res.status(500).json({
          "ok", false,
          "error", rix.pdf.error.to_string(bytes.error()),
          "message", bytes.error().message()});

      return;
    }

    res.header("Content-Type", "application/pdf");
    res.header("Content-Disposition", "inline; filename=\"report.pdf\"");
    res.send(bytes.value());
  });

  app.run();

  return 0;
}
```

Use `write` in routes because the PDF should be returned as response bytes.

## API error shape

For APIs, a useful error shape is:

```json id="q8k5mv"
{
  "ok": false,
  "error": "InvalidInput",
  "message": "Output PDF path cannot be empty."
}
```

In C++:

```cpp id="s6n4vm"
res.status(500).json({
    "ok", false,
    "error", rix.pdf.error.to_string(error),
    "message", error.message()});
```

This keeps API responses predictable.

## Custom error values

You can create error values through the facade:

```cpp id="v8q3md"
auto error = rix.pdf.error.make(
    rixlib::pdf::PdfErrorCode::InvalidInput,
    "Custom PDF input error.");
```

You can create a success error value:

```cpp id="h5v8qp"
auto ok = rix.pdf.error.none();
```

Most application code does not need to create PDF errors manually.

This is mainly useful for adapters, tests, and wrappers.

## Complete error handling example

```cpp id="d9m5qx"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("PDF error handling");

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "This document demonstrates explicit PDF errors.");

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    const auto &error = saved.error();

    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(error),
        error.message());

    if (rix.pdf.error.is(
            error,
            rixlib::pdf::PdfErrorCode::InvalidInput))
    {
      rix.debug.eprint("hint:", "use a real output file path");
    }

    return 0;
  }

  return 1;
}
```

Run:

```bash id="m8x2vc"
vix run error_handling.cpp
```

## Use in a Vix project

Create a project:

```bash id="a2r7kb"
vix new rix-pdf-error-handling --app
cd rix-pdf-error-handling
```

Add Rix:

```bash id="c8n3vy"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="n6x9qa"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="y5q2md"
name = "rix-pdf-error-handling"
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

```txt id="b4v8qc"
src/main.cpp
```

Build and run:

```bash id="p3x7rn"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="h9n2ka"
vix run error_handling.cpp
```

If needed:

```bash id="q6v8mx"
vix install -g rix/rix
vix run error_handling.cpp
```

For project usage, prefer:

```bash id="t5c8vp"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="r8q5wc"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="x4m9vd"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto saved = rix.pdf.save(doc, "");

  return saved.failed() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp id="f7q3ma"
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 0;
  }

  return 1;
}
```

## Use the independent package

For independent usage, install:

```bash id="n9x2qc"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="c5v8na"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="m6q4rd"
#include <rix/pdf.hpp>
```

Example:

```cpp id="v2k8xm"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto saved = pdf.save(doc, "");

  return saved.failed() ? 0 : 1;
}
```

The examples in this documentation prefer the public facade:

```cpp id="q9c5rd"
#include <rix.hpp>
```

and:

```cpp id="k8m4xa"
rix.pdf
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="h5n7vc"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="x9q2va"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="d6m8qc"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="z4x7mq"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Calling `value()` before checking success

Wrong:

```cpp id="y8m3ka"
auto bytes = rix.pdf.write(doc);

rix.debug.print(bytes.value().size());
```

Correct:

```cpp id="s5v9qa"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  return 1;
}

rix.debug.print(bytes.value().size());
```

### Ignoring save errors

Wrong:

```cpp id="p7n4xm"
rix.pdf.save(doc, "output.pdf");
```

Correct:

```cpp id="w3q8kc"
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

### Expecting missing folders to be created automatically

This can fail:

```cpp id="r6x2vd"
rix.pdf.save(doc, "output/report.pdf");
```

Create the folder first:

```bash id="a8k5qx"
mkdir -p output
```

### Saving to an empty path

This is invalid:

```cpp id="f2v7mc"
rix.pdf.save(doc, "");
```

Use a real path:

```cpp id="c9m4vx"
rix.pdf.save(doc, "output.pdf");
```

### Using `load_jpeg` for PNG files

`load_jpeg` expects JPEG image data.

This can fail:

```cpp id="m8q2za"
rix.pdf.image.load_jpeg("logo.png");
```

Use JPEG input for this helper.

### Printing errors without the message

The code is useful:

```cpp id="n5v8qc"
rix.pdf.error.to_string(error)
```

The message gives more context:

```cpp id="q7x4ma"
error.message()
```

Use both when printing diagnostics.

## What you should remember

Check `save`:

```cpp id="h6q9vx"
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

Check `write`:

```cpp id="v8n3qb"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());
}
```

Check images:

```cpp id="k4m9xd"
auto image = rix.pdf.image.load_jpeg("photo.jpg");

if (image.failed())
{
  rix.debug.eprint(
      "image error:",
      rix.pdf.error.to_string(image.error()),
      image.error().message());
}
```

Never call `value()` before checking success.

For project usage:

```bash id="x3m7qa"
vix add rix/rix
vix install
```

and keep:

```txt id="n9q5vx"
deps = [
  "rix/rix",
]
```

## Next step

Continue with package rules.

Next: [Package rules](/guides/package-model)
