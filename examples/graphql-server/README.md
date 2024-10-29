# Minimal GraphQL Development Server Example

This is a minimal GraphQL development server example using [Actix Web](https://github.com/actix/actix-web) and [Juniper](https://github.com/graphql-rust/juniper). It provides a GraphQL API for querying and mutating humanoid creatures in a fictional universe.

> This server is intended for development purposes only. It has permissive CORS settings enabled.
>
> DO NOT USE in production environments.

## Getting Started

### Prerequisites

When testing this repository locally, make sure you have the following installed:

- [Rust](https://www.rust-lang.org/tools/install) (version 1.75 or higher)
- [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) (comes with Rust)

### Running the dev server

#### From the root of this project (Cargo workspace)

```bash
cargo run --bin gqlx-example-server
```

#### From within `/examples/graphql-server` directory

```bash
cargo run
```

By default, the server will start on <http://127.0.0.1:8080>.

## Example

```graphql
query {
  human(id: "1234") {
    id
    name
  }
}
```
