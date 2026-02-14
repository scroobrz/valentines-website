---
trigger: model_decision
description: Technical standards and best practices for Python, JavaScript/TypeScript, Go, Java, and Rust.
---

# Technical Stack & Standards

## Java

### Environment
*   **Version**: 21+ (LTS)
*   **Build System**: Maven (preferred) or Gradle
*   **Style Guide**: Google Java Style Guide

### Modern Features (Required)
```java
// Use Records for data carriers
public record User(String name, String email, int age) {}

// Use Pattern Matching for instanceof
if (obj instanceof String s) {
    System.out.println(s.toUpperCase());
}

// Use Pattern Matching for switch
String result = switch (status) {
    case "ACTIVE" -> "User is active";
    case "INACTIVE" -> "User is inactive";
    case null -> "Unknown status";
    default -> "Other: " + status;
};

// Use Sealed Classes for controlled hierarchies
public sealed interface Shape permits Circle, Rectangle, Triangle {}
```

### Testing
*   **Framework**: JUnit 5
*   **Assertions**: AssertJ (preferred) or Hamcrest
*   **Mocking**: Mockito

```java
@Test
void shouldCreateUser() {
    User user = new User("John", "john@example.com", 30);
    assertThat(user.name()).isEqualTo("John");
}
```

### Common Patterns
*   Use `Optional<T>` instead of returning null
*   Use `try-with-resources` for AutoCloseable resources
*   Prefer immutable collections (`List.of()`, `Map.of()`)

---

## Python

### Environment
*   **Version**: 3.11+
*   **Package Manager**: uv (recommended) or pip + venv
*   **Formatter**: Ruff (replaces Black)
*   **Linter**: Ruff (replaces Flake8, isort)

### Type Hints (Required)
```python
# All functions must have type hints
def process_users(users: list[dict[str, str]]) -> dict[str, int]:
    return {user["name"]: int(user["age"]) for user in users}

# Use modern syntax (3.10+)
def get_user(user_id: int) -> dict[str, str] | None:
    ...

# Use TypedDict for structured dicts
from typing import TypedDict

class User(TypedDict):
    name: str
    email: str
    age: int
```

### Testing
*   **Framework**: pytest
*   **Fixtures**: Use for setup/teardown
*   **Async**: pytest-asyncio for async tests

```python
import pytest

@pytest.fixture
def sample_user() -> dict[str, str]:
    return {"name": "John", "email": "john@example.com"}

def test_user_creation(sample_user):
    assert sample_user["name"] == "John"

@pytest.mark.asyncio
async def test_async_fetch():
    result = await fetch_data()
    assert result is not None
```

### Common Patterns
*   Use `pathlib.Path` instead of `os.path`
*   Use f-strings for formatting
*   Use `dataclasses` or Pydantic for data models
*   Use context managers (`with` statements)

---

## JavaScript / TypeScript

### Environment
*   **Node**: 20+ LTS
*   **TypeScript**: Strict mode enabled
*   **Formatter**: Prettier
*   **Linter**: ESLint

### TypeScript Config (Required)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Safety
```typescript
// No `any` unless absolutely necessary
// Bad
function process(data: any) { ... }

// Good
interface User {
  name: string;
  email: string;
  age: number;
}

function processUser(user: User): string {
  return `User: ${user.name}`;
}

// Use discriminated unions
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function fetchUser(id: number): Result<User> {
  // ...
}
```

### React Patterns
*   **Components**: Functional components only (no class components)
*   **Hooks**: Use built-in hooks, custom hooks for reusable logic
*   **State**: useState, useReducer for local; Zustand/Jotai for global

```tsx
interface UserCardProps {
  user: User;
  onEdit: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
};
```

### Testing
*   **Framework**: Vitest (preferred) or Jest
*   **React**: React Testing Library
*   **E2E**: Playwright

---

## Go (Golang)

### Environment
*   **Version**: 1.21+
*   **Formatter**: gofmt (mandatory)
*   **Linter**: golangci-lint

### Style & Conventions
```go
// Package names: lowercase, single word
package user

// Exported names start with uppercase
type User struct {
    Name  string
    Email string
}

// Unexported (private) start with lowercase
type userImpl struct { ... }

// Error handling: explicit, never swallow
if err != nil {
    return fmt.Errorf("failed to fetch user: %w", err)
}

// Defer for cleanup
func processFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close()
    // ...
}
```

### Error Handling (Critical)
```go
// Always check errors
result, err := doSomething()
if err != nil {
    return err  // or wrap with context
}

// Wrap errors for context
if err != nil {
    return fmt.Errorf("processing user %d: %w", userID, err)
}

// Custom error types for specific cases
type NotFoundError struct {
    Resource string
    ID       int
}

func (e NotFoundError) Error() string {
    return fmt.Sprintf("%s with ID %d not found", e.Resource, e.ID)
}
```

### Testing
```go
func TestUserCreation(t *testing.T) {
    user := NewUser("John", "john@example.com")
    
    if user.Name != "John" {
        t.Errorf("expected Name to be John, got %s", user.Name)
    }
}

// Table-driven tests (preferred)
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 1, 2, 3},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("got %d, want %d", result, tt.expected)
            }
        })
    }
}
```

---

## Rust

### Environment
*   **Formatter**: rustfmt (mandatory)
*   **Linter**: cargo clippy (address all warnings)
*   **Edition**: 2021+

### Safety & Style
```rust
// Avoid `unsafe` unless strictly necessary
// If used, document WHY it's safe

// Use Result for fallible operations
fn read_file(path: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
}

// Avoid .unwrap() and .expect() in production
// Bad
let content = read_file("config.txt").unwrap();

// Good
let content = read_file("config.txt")?;

// Or handle explicitly
let content = match read_file("config.txt") {
    Ok(c) => c,
    Err(e) => {
        eprintln!("Failed to read config: {}", e);
        return Err(e.into());
    }
};
```

### Error Handling
```rust
// Use thiserror for custom errors
use thiserror::Error;

#[derive(Error, Debug)]
pub enum UserError {
    #[error("User not found: {0}")]
    NotFound(u64),
    #[error("Invalid email format")]
    InvalidEmail,
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
}

fn get_user(id: u64) -> Result<User, UserError> {
    // ...
}
```

### Common Patterns
```rust
// Use Option for nullable values
fn find_user(name: &str) -> Option<User> {
    users.iter().find(|u| u.name == name).cloned()
}

// Use iterators, not loops where possible
let names: Vec<String> = users
    .iter()
    .filter(|u| u.age > 18)
    .map(|u| u.name.clone())
    .collect();

// Use derive macros
#[derive(Debug, Clone, PartialEq, Eq)]
struct User {
    name: String,
    email: String,
}
```

### Testing
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_creation() {
        let user = User::new("John", "john@example.com");
        assert_eq!(user.name, "John");
    }

    #[test]
    fn test_invalid_email() {
        let result = User::new("John", "invalid");
        assert!(result.is_err());
    }
}
```

---

## Quick Reference

| Language | Formatter | Linter | Test Framework | Type System |
|----------|-----------|--------|----------------|-------------|
| Java | Google Style | Checkstyle | JUnit 5 | Static |
| Python | Ruff | Ruff | pytest | Type hints |
| TypeScript | Prettier | ESLint | Vitest | Static |
| Go | gofmt | golangci-lint | go test | Static |
| Rust | rustfmt | clippy | cargo test | Static |