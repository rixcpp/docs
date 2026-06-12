# Code of Conduct

Rix is a technical project built around Vix.cpp and the wider C++ community.

We want contributors, users, maintainers, and readers to feel welcome when they report issues, ask questions, improve documentation, open pull requests, or discuss package design.

This code of conduct explains the behavior expected in Rix spaces.

## The short version

Be respectful.

Be constructive.

Focus on the work.

Help people learn.

Do not harass, insult, threaten, or exclude people.

Rix is a project for building useful C++ userland libraries. The community should make that work easier, not harder.

## Our values

Rix values:

```txt id="q8m4xa"
respect
clarity
patience
technical honesty
constructive feedback
welcoming collaboration
simple and stable APIs
```

The project can only grow if people can ask questions, make mistakes, learn, and improve the work together.

## Expected behavior

Good community behavior includes:

```txt id="n5v9qc"
being respectful in discussions
welcoming new contributors
asking questions in good faith
giving clear technical feedback
explaining decisions when reviewing code
accepting corrections
staying focused on the issue or pull request
crediting other people's work
helping improve documentation and examples
```

Technical disagreement is allowed.

Disrespect is not.

## Unacceptable behavior

Unacceptable behavior includes:

```txt id="k7x2ma"
harassment
threats
personal attacks
insults
hate speech
sexualized language or imagery
doxxing or sharing private information
deliberate intimidation
trolling
repeated off-topic disruption
unwelcome personal attention
publicly shaming contributors
```

This applies in issues, pull requests, discussions, documentation channels, chat groups, social spaces connected to the project, and any official Rix or Vix.cpp community space.

## Technical disagreements

Disagreements are normal in software.

When disagreeing, focus on:

```txt id="p9c5xr"
the API
the behavior
the bug
the test
the documentation
the design tradeoff
the user impact
```

Avoid making the discussion about the person.

Better:

```txt id="q4m8vb"
This API may be hard to maintain because it exposes writer internals.
```

Not acceptable:

```txt id="x2n7pd"
You do not understand API design.
```

## Review culture

Code review should improve the project.

Review comments should be clear, specific, and useful.

Good review comments explain:

```txt id="t8q5hm"
what should change
why it should change
how the change helps users or maintainers
whether the comment is required or optional
```

Example:

```txt id="b6x3rd"
Please check `failed()` before calling `value()`.
This keeps the example safe for users copying it into applications.
```

Avoid vague or hostile review comments.

## Maintainer responsibilities

Maintainers are expected to:

```txt id="z5v8ka"
apply this code of conduct fairly
respond to reports seriously
avoid favoritism
protect contributors from harassment
keep discussions focused and respectful
explain moderation decisions when appropriate
```

Maintainers may remove comments, close issues, lock discussions, or block users when behavior harms the community.

## Contributor responsibilities

Contributors are expected to:

```txt id="c9q2mx"
follow this code of conduct
keep discussions respectful
avoid personal attacks
respect maintainer decisions
accept review feedback in good faith
report harmful behavior when needed
```

Contributors should not use the project spaces to attack people, promote unrelated conflicts, or pressure maintainers aggressively.

## Reporting problems

If you experience or witness unacceptable behavior, report it to the project maintainers.

A report should include:

```txt id="h7n4qc"
what happened
where it happened
who was involved
links or screenshots if available
whether there is an immediate safety concern
```

Do not include sensitive private information unless it is necessary for the report.

If the repository has a security policy or private maintainer contact, use that private channel for sensitive reports.

## Report handling

Maintainers will review reports and decide what action is appropriate.

Possible actions include:

```txt id="d3x8vp"
private warning
public reminder
comment removal
issue or pull request lock
temporary restriction
permanent ban from project spaces
```

The response depends on the severity and pattern of behavior.

## Privacy

Reports should be handled with care.

Maintainers should avoid exposing private details unnecessarily.

People who report problems should not be punished for making a good-faith report.

False reports made to harass or silence others may also violate this code of conduct.

## Scope

This code of conduct applies to Rix project spaces, including:

```txt id="j2m9wa"
GitHub repositories
issues
pull requests
discussions
documentation contributions
official chat groups
official community spaces
project-related events
```

It also applies when someone represents the project in public spaces.

## Enforcement principles

Enforcement should be:

```txt id="w8c5nr"
fair
proportional
consistent
focused on community safety
focused on restoring useful collaboration when possible
```

The goal is not to punish mistakes harshly.

The goal is to protect the community and keep the project healthy.

## Examples of healthy participation

Healthy participation looks like:

```txt id="k5v7ma"
asking for clarification before assuming bad intent
explaining why an API may be confusing
suggesting a smaller pull request when a change is too large
helping someone fix a failing example
pointing to the right documentation page
thanking contributors for useful work
```

Rix should be a place where people can improve C++ software without fear of unnecessary hostility.

## Examples of unhealthy participation

Unhealthy participation looks like:

```txt id="r6q9xd"
mocking someone's skill level
attacking a contributor instead of the code
repeatedly reopening the same argument
pressuring maintainers aggressively
posting insults in issues or pull requests
sharing private messages without consent
using project spaces for unrelated personal conflicts
```

This behavior may lead to moderation.

## Good-faith mistakes

People can make mistakes.

A contributor may misunderstand an API, write a bad patch, miss a test, or phrase feedback poorly.

When possible, respond with patience.

Example:

```txt id="p2n8fc"
This should use `deps`, not `packages`, because Rix packages are Vix Registry dependencies.
```

Clear correction is better than humiliation.

## Language and accessibility

Use clear language.

Avoid unnecessary insults, sarcasm, or gatekeeping.

Remember that contributors may have different levels of experience with:

```txt id="y4m6qv"
C++
Vix.cpp
Rix
English
open source workflow
GitHub
package design
```

A welcoming project can still have high technical standards.

## Project identity

Rix is part of the Vix.cpp ecosystem.

Discussions should respect the separation between Vix.cpp and Rix:

```txt id="f9x3ka"
Vix.cpp owns runtime and project workflow.
Rix owns optional userland packages.
```

Healthy discussion should help keep that model clear.

## No harassment

Harassment is not tolerated.

This includes harassment based on:

```txt id="m7c5vx"
experience level
language
nationality
race
ethnicity
religion
gender
sexual orientation
disability
age
personal background
```

Everyone should be able to participate without being targeted.

## No private information sharing

Do not share someone's private information without permission.

This includes:

```txt id="q3p8za"
private email addresses
phone numbers
home addresses
private messages
private account details
private identity information
```

If private information appears accidentally, notify maintainers so it can be removed.

## Security-sensitive discussions

For security-sensitive issues, use private reporting channels when possible.

Do not publicly post exploit details, secrets, tokens, private keys, or sensitive user data.

Security issues may include:

```txt id="v8n2hr"
auth bypass
password hashing problems
token leakage
session validation problems
secret exposure
unsafe defaults
```

## Documentation and examples

Documentation contributions should also follow this code of conduct.

When correcting docs, be precise and respectful.

Good:

```txt id="a6q9mx"
This example should use `~/rix-example` instead of `/tmp` because the docs prefer home-folder paths.
```

Good:

```txt id="r4v8kb"
This dependency should be in `deps`, not `packages`.
```

Not acceptable:

```txt id="x9m2pd"
Who wrote this? This is stupid.
```

## Maintainer moderation

Maintainers may moderate content that violates this code of conduct.

Moderation can include removing:

```txt id="c5w9qa"
insults
harassment
private information
threats
spam
off-topic attacks
repeated disruptive comments
```

Maintainers may also close discussions when they are no longer productive.

## Appeals

If someone believes a moderation decision was made in error, they may contact the maintainers respectfully.

An appeal should explain:

```txt id="z8q2vm"
what decision is being appealed
why the decision may be incorrect
what outcome is requested
```

Appeals that include harassment or threats may be ignored.

## What you should remember

Rix is built by people.

Treat people with respect.

Keep discussions technical and constructive.

Disagree with ideas, not personal identity.

Help improve the project.

Do not harass, threaten, insult, or expose private information.

The goal is a healthy community around useful C++ libraries for Vix.cpp.
