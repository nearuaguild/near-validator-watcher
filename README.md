To install dependencies:

```bash
bun install
```

To compile:

```bash
bun build --require ./src/env.ts src/index.ts --compile --outfile watcher
```

To run:

```bash
./watcher
```

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
