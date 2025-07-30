# 250729-biome-ignored-nofloatingpromises-nursery

Temporary repo to showcase the biomejs bug where `lint/nursery/noFloatingPromises` config is ignored when configured in a non-root biomejs file.

## Repo Setup

```text
/250729-biome-ignored-nofloatingpromises-nursery
├── biome-config-dir
│   └── biome.jsonc     <- the non-root biome config
├── src
│   └── sample-code.ts  <- sample code
├── biome.jsonc         <- root biome config
└── package.json
```

## Replicating the bug

Running `yarn lint` gives the following output

```
src/sample-code.ts:2:9 lint/nursery/noBitwiseOperators ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Unexpected use of '|'.
  
    1 │ // should raise a lint/nursery/noBitwiseOperators error. Works as expected
  > 2 │ let x = 1 | 0;
      │         ^^^^^
    3 │ 
    4 │ // should raise a lint/nursery/noFloatingPromises error.
  
  ℹ Did you mean || instead? If you want to use the bitwise operator, consider suppressing this diagnostic.
  

Checked 2 files in 3ms. No fixes applied.
Found 1 error.
lint ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Some errors were emitted while running checks.
```
The error from the `lint/nursery/noBitwiseOperators` rule is expected. The problem is that we **don't** see any errors for the floating promise at [./src/sample-code.ts:7](./src/sample-code.ts)

If you uncomment the same rule in the root [biome.jsonc file](./biome.jsonc), then we get the expected output:

```
➜  250729-biome-ignored-nofloatingpromises-nursery git:(main) ✗ yarn biome lint
src/sample-code.ts:2:9 lint/nursery/noBitwiseOperators ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Unexpected use of '|'.
  
    1 │ // should raise a lint/nursery/noBitwiseOperators error. Works as expected
  > 2 │ let x = 1 | 0;
      │         ^^^^^
    3 │ 
    4 │ // should raise a lint/nursery/noFloatingPromises error.
  
  ℹ Did you mean || instead? If you want to use the bitwise operator, consider suppressing this diagnostic.
  

src/sample-code.ts:7:1 lint/nursery/noFloatingPromises ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ A "floating" Promise was found, meaning it is not properly handled and could lead to ignored errors or unexpected behavior.
  
    5 │ // however, doesn't raise one if lint/nursery/noFloatingPromises is configured in a non-root biome.jsonc file
    6 │ const promise = new Promise((resolve) => resolve("value"));
  > 7 │ promise.then(() => {});
      │ ^^^^^^^^^^^^^^^^^^^^^^^
    8 │ 
  
  ℹ This happens when a Promise is not awaited, lacks a `.catch` or `.then` rejection handler, or is not explicitly ignored using the `void` operator.
  

Checked 2 files in 4ms. No fixes applied.
Found 2 errors.
lint ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Some errors were emitted while running checks.
```

## Biome rage

```
$ yarn biome rage --linter

CLI:
  Version:                      2.1.3
  Color support:                true

Platform:
  CPU Architecture:             aarch64
  OS:                           macos

Environment:
  BIOME_LOG_PATH:               unset
  BIOME_LOG_PREFIX_NAME:        unset
  BIOME_CONFIG_PATH:            unset
  BIOME_THREADS:                unset
  NO_COLOR:                     unset
  TERM:                         xterm-256color
  JS_RUNTIME_VERSION:           v22.13.1
  JS_RUNTIME_NAME:              node
  NODE_PACKAGE_MANAGER:         yarn/4.9.2

Biome Configuration:
  Status:                       Loaded successfully
  Path:                         biome.jsonc
  Formatter enabled:            true
  Linter enabled:               true
  Assist enabled:               true
  VCS enabled:                  true

Linter:
  JavaScript enabled:           unset
  JSON enabled:                 unset
  CSS enabled:                  unset
  GraphQL enabled:              unset
  Recommended:                  false
  Enabled rules:
    nursery/noBitwiseOperators
    nursery/noFloatingPromises

Workspace:
  Open Documents:               0
```
