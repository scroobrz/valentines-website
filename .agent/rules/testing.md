---
trigger: model_decision
description: Test-Driven Development practices and testing standards across all languages.
---

# Testing Standards (TDD-First Approach)

## Core Philosophy
**Think about tests BEFORE writing implementation.**

The TDD cycle:
1. 🔴 **Red**: Write a failing test
2. 🟢 **Green**: Write minimal code to pass
3. 🔵 **Refactor**: Clean up, keep tests green

---

## 1. Test Structure (AAA Pattern)

All tests should follow **Arrange-Act-Assert**:

```python
def test_user_creation():
    # Arrange - Set up test data
    name = "John"
    email = "john@example.com"
    
    # Act - Execute the code under test
    user = User.create(name, email)
    
    # Assert - Verify the result
    assert user.name == name
    assert user.email == email
```

---

## 2. What to Test

### Must Test ✅
*   **Public API**: All public methods and functions
*   **Edge Cases**: Empty input, null, boundaries
*   **Error Paths**: Exception handling, invalid input
*   **Business Logic**: Core algorithms and rules

### Don't Test ❌
*   **Private Methods**: Test through public interface
*   **Framework Code**: Trust the framework
*   **Trivial Code**: Simple getters/setters without logic
*   **External Services**: Mock them instead

---

## 3. Language-Specific Testing

### Java (JUnit 5 + AssertJ)

**Setup:**
```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.assertj</groupId>
    <artifactId>assertj-core</artifactId>
    <version>3.24.2</version>
    <scope>test</scope>
</dependency>
```

**Test Example:**
```java
import org.junit.jupiter.api.*;
import static org.assertj.core.api.Assertions.*;

class UserServiceTest {
    
    private UserService userService;
    
    @BeforeEach
    void setUp() {
        userService = new UserService();
    }
    
    @Test
    @DisplayName("should create user with valid data")
    void shouldCreateUser() {
        // Arrange
        String name = "John";
        String email = "john@example.com";
        
        // Act
        User user = userService.create(name, email);
        
        // Assert
        assertThat(user.getName()).isEqualTo(name);
        assertThat(user.getEmail()).isEqualTo(email);
    }
    
    @Test
    @DisplayName("should throw exception for invalid email")
    void shouldThrowForInvalidEmail() {
        assertThatThrownBy(() -> userService.create("John", "invalid"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("email");
    }
    
    @ParameterizedTest
    @CsvSource({
        "john@example.com, true",
        "invalid, false",
        "'', false"
    })
    void shouldValidateEmail(String email, boolean expected) {
        assertThat(userService.isValidEmail(email)).isEqualTo(expected);
    }
}
```

**Run:**
```bash
mvn test                           # All tests
mvn test -Dtest=UserServiceTest    # Specific class
mvn test -Dtest=UserServiceTest#shouldCreateUser  # Specific method
```

---

### Python (pytest)

**Setup:**
```bash
pip install pytest pytest-cov pytest-asyncio
```

**Test Example:**
```python
import pytest
from myapp.services import UserService
from myapp.exceptions import InvalidEmailError

class TestUserService:
    
    @pytest.fixture
    def service(self):
        return UserService()
    
    def test_create_user_with_valid_data(self, service):
        # Arrange
        name = "John"
        email = "john@example.com"
        
        # Act
        user = service.create(name, email)
        
        # Assert
        assert user.name == name
        assert user.email == email
    
    def test_create_user_raises_for_invalid_email(self, service):
        with pytest.raises(InvalidEmailError) as exc_info:
            service.create("John", "invalid")
        
        assert "email" in str(exc_info.value)
    
    @pytest.mark.parametrize("email,expected", [
        ("john@example.com", True),
        ("invalid", False),
        ("", False),
    ])
    def test_email_validation(self, service, email, expected):
        assert service.is_valid_email(email) == expected


# Async tests
@pytest.mark.asyncio
async def test_async_fetch():
    result = await fetch_user(1)
    assert result is not None
```

**Run:**
```bash
pytest                             # All tests
pytest tests/test_user.py          # Specific file
pytest -k "test_create"            # Tests matching pattern
pytest --cov=src --cov-report=html # With coverage
pytest -v                          # Verbose output
```

---

### TypeScript (Vitest)

**Setup:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

**Test Example:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from './UserService'

describe('UserService', () => {
  let service: UserService

  beforeEach(() => {
    service = new UserService()
  })

  it('should create user with valid data', () => {
    // Arrange
    const name = 'John'
    const email = 'john@example.com'

    // Act
    const user = service.create(name, email)

    // Assert
    expect(user.name).toBe(name)
    expect(user.email).toBe(email)
  })

  it('should throw for invalid email', () => {
    expect(() => service.create('John', 'invalid'))
      .toThrow('Invalid email')
  })

  it.each([
    ['john@example.com', true],
    ['invalid', false],
    ['', false],
  ])('validates email %s as %s', (email, expected) => {
    expect(service.isValidEmail(email)).toBe(expected)
  })
})

// React component test
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  it('renders user name', () => {
    render(<UserCard user={{ name: 'John', email: 'john@example.com' }} />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('calls onEdit when button clicked', async () => {
    const onEdit = vi.fn()
    render(<UserCard user={{ id: 1, name: 'John' }} onEdit={onEdit} />)
    
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    
    expect(onEdit).toHaveBeenCalledWith(1)
  })
})
```

**Run:**
```bash
npm run test               # All tests
npm run test -- --watch    # Watch mode
npm run test -- --coverage # With coverage
```

---

### Go

**Test Example:**
```go
package user

import (
    "testing"
)

func TestCreateUser(t *testing.T) {
    // Arrange
    name := "John"
    email := "john@example.com"

    // Act
    user, err := Create(name, email)

    // Assert
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if user.Name != name {
        t.Errorf("got name %q, want %q", user.Name, name)
    }
}

// Table-driven tests (preferred)
func TestIsValidEmail(t *testing.T) {
    tests := []struct {
        name     string
        email    string
        expected bool
    }{
        {"valid email", "john@example.com", true},
        {"invalid email", "invalid", false},
        {"empty email", "", false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := IsValidEmail(tt.email)
            if result != tt.expected {
                t.Errorf("IsValidEmail(%q) = %v, want %v", 
                    tt.email, result, tt.expected)
            }
        })
    }
}

// Test error cases
func TestCreateUserInvalidEmail(t *testing.T) {
    _, err := Create("John", "invalid")
    
    if err == nil {
        t.Fatal("expected error, got nil")
    }
}
```

**Run:**
```bash
go test ./...              # All tests
go test -v ./...           # Verbose
go test -run TestCreate    # Pattern match
go test -cover ./...       # With coverage
go test -race ./...        # Race detection
```

---

### Rust

**Test Example:**
```rust
// In src/lib.rs or src/user.rs

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_user() {
        // Arrange
        let name = "John";
        let email = "john@example.com";

        // Act
        let user = User::new(name, email).unwrap();

        // Assert
        assert_eq!(user.name, name);
        assert_eq!(user.email, email);
    }

    #[test]
    fn test_invalid_email_returns_error() {
        let result = User::new("John", "invalid");
        
        assert!(result.is_err());
        assert!(matches!(result, Err(UserError::InvalidEmail)));
    }

    #[test]
    #[should_panic(expected = "email cannot be empty")]
    fn test_empty_email_panics() {
        User::new("John", "").unwrap();
    }
}

// Property-based testing with proptest (optional)
#[cfg(test)]
mod proptests {
    use proptest::prelude::*;

    proptest! {
        #[test]
        fn test_name_preserved(name in "[a-zA-Z]{1,50}") {
            let user = User::new(&name, "test@example.com").unwrap();
            assert_eq!(user.name, name);
        }
    }
}
```

**Run:**
```bash
cargo test                     # All tests
cargo test user                # Tests containing "user"
cargo test -- --nocapture      # Show print output
cargo test -- --test-threads=1 # Sequential
```

---

## 4. Mocking & Test Doubles

### When to Mock
*   ✅ External services (APIs, databases)
*   ✅ Non-deterministic behavior (time, random)
*   ✅ Slow operations
*   ❌ Simple value objects
*   ❌ Code you control that's fast

### Mocking Examples

**Python (pytest-mock):**
```python
def test_fetch_user_from_api(mocker):
    # Mock the HTTP call
    mock_get = mocker.patch('requests.get')
    mock_get.return_value.json.return_value = {"name": "John"}
    
    result = fetch_user(1)
    
    assert result["name"] == "John"
    mock_get.assert_called_once_with("https://api.example.com/users/1")
```

**TypeScript (Vitest):**
```typescript
import { vi } from 'vitest'

it('fetches user from API', async () => {
  // Mock fetch
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ name: 'John' })
  })

  const result = await fetchUser(1)

  expect(result.name).toBe('John')
  expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/1')
})
```

---

## 5. Test Naming Conventions

**Format:** `should_[expected behavior]_when_[condition]`

```java
// Java
void shouldReturnUser_whenIdExists()
void shouldThrowException_whenEmailIsInvalid()

// Python
def test_should_return_user_when_id_exists():
def test_should_raise_when_email_invalid():

// TypeScript
it('should return user when id exists', ...)
it('should throw when email is invalid', ...)
```

---

## 6. Coverage Guidelines

| Coverage Type | Target | Notes |
|--------------|--------|-------|
| Line Coverage | 80%+ | Minimum for business logic |
| Branch Coverage | 70%+ | Test all if/else paths |
| Function Coverage | 90%+ | All public functions |

**Remember:** 100% coverage ≠ bug-free code. Focus on meaningful tests.

---

## 7. Command Reference

| Language | Run All | Run One | Coverage |
|----------|---------|---------|----------|
| Java | `mvn test` | `mvn test -Dtest=ClassName` | `mvn test jacoco:report` |
| Python | `pytest` | `pytest tests/test_x.py` | `pytest --cov=src` |
| TypeScript | `npm test` | `npm test -- file.test.ts` | `npm test -- --coverage` |
| Go | `go test ./...` | `go test -run TestName` | `go test -cover` |
| Rust | `cargo test` | `cargo test test_name` | `cargo tarpaulin` |