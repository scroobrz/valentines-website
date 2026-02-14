---
trigger: model_decision
description: Systematic debugging protocols and root-cause analysis techniques.
---

# Debugging & Troubleshooting Standards

## Core Philosophy
**Debugging is a skill, not guesswork.** Follow a systematic approach: (**Reproduce** → **Isolate** → **Identify** → **Fix** → **Verify**)

---

## 1. The Debugging Protocol

### Step 1: Reproduce the Issue
Before fixing, you **must** be able to reproduce the bug consistently.

```bash
# Gather information
- What is the exact error message?
- What are the steps to reproduce?
- Is it consistent or intermittent?
- When did it start happening?
- What changed recently?
```

### Step 2: Isolate the Problem
Narrow down where the issue occurs.

**Techniques:**
*   **Binary Search**: Comment out half the code, see if issue persists
*   **Minimal Reproduction**: Create smallest possible example that fails
*   **Input Reduction**: Simplify inputs until failure disappears

### Step 3: Identify Root Cause
Find the actual cause, not just symptoms.

**Questions to ask:**
*   Why does this happen here?
*   What assumption was wrong?
*   What changed to trigger this?
*   Is this the only place this can occur?

### Step 4: Fix and Verify
*   Fix the root cause, not symptoms
*   Write a test that would have caught this bug
*   Verify the fix in the same environment

---

## 2. Language-Specific Debugging

### Java
```bash
# Enable verbose output
java -verbose:class YourApp

# Remote debugging
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar app.jar

# Heap dump on OOM
java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/heap.hprof -jar app.jar
```

**Common Issues:**
| Symptom | Likely Cause | Check |
|---------|--------------|-------|
| NullPointerException | Uninitialized object | Trace null reference back |
| ClassNotFoundException | Missing dependency | Check classpath/pom.xml |
| OutOfMemoryError | Memory leak | Analyze heap dump |
| ConcurrentModificationException | Iterating while modifying | Use Iterator.remove() |

### Python
```python
# Enable verbose tracebacks
import traceback
traceback.print_exc()

# Interactive debugging
import pdb; pdb.set_trace()  # Python < 3.7
breakpoint()  # Python 3.7+

# Print variable state
print(f"DEBUG: {variable=}")  # Python 3.8+ f-string debugging
```

**Common Issues:**
| Symptom | Likely Cause | Check |
|---------|--------------|-------|
| AttributeError | Wrong type / typo | Check object type with `type()` |
| ImportError | Missing package / path | Check venv, PYTHONPATH |
| IndentationError | Mixed tabs/spaces | Run `python -tt` |
| RecursionError | Infinite recursion | Check base case |

### JavaScript/TypeScript
```javascript
// Console debugging
console.log({ variable });  // Object form shows name
console.table(arrayOfObjects);  // Tabular display
console.trace();  // Stack trace

// Breakpoints
debugger;  // Pauses if DevTools open

// Node.js debugging
node --inspect app.js
node --inspect-brk app.js  // Break at start
```

**Common Issues:**
| Symptom | Likely Cause | Check |
|---------|--------------|-------|
| undefined | Uninitialized / async timing | Check initialization order |
| TypeError: X is not a function | Wrong import / scope | Check imports |
| CORS error | Missing headers | Check server config |
| Memory leak | Event listeners / closures | Check for cleanup |

### Go
```go
// Print debugging
fmt.Printf("DEBUG: %+v\n", variable)  // Struct with field names
fmt.Printf("DEBUG: %#v\n", variable)  // Go syntax representation

// Stack trace
import "runtime/debug"
debug.PrintStack()

// Enable race detector
// go run -race main.go
// go test -race ./...
```

**Common Issues:**
| Symptom | Likely Cause | Check |
|---------|--------------|-------|
| panic: nil pointer | Uninitialized pointer | Check nil before use |
| deadlock | Goroutine waiting forever | Check channel/mutex usage |
| data race | Concurrent access | Run with `-race` flag |
| slice out of range | Index bounds | Check length before access |

### Rust
```rust
// Debug printing
println!("{:?}", variable);  // Debug trait
println!("{:#?}", variable);  // Pretty-printed
dbg!(variable);  // File/line + value

// Backtrace
// RUST_BACKTRACE=1 cargo run
// RUST_BACKTRACE=full cargo run
```

**Common Issues:**
| Symptom | Likely Cause | Check |
|---------|--------------|-------|
| borrow checker error | Lifetime/ownership issue | Trace ownership flow |
| panic at unwrap() | None/Err value | Use `?` or match instead |
| stack overflow | Infinite recursion | Check recursion base case |
| deadlock | Mutex poisoning | Handle MutexGuard properly |

---

## 3. Error Message Analysis

### Reading Stack Traces
1. **Start from the bottom**: That's where the error originated
2. **Find your code**: Skip framework/library lines initially
3. **Check the line number**: Actual error is often line above
4. **Read the message**: Error messages contain clues

```
java.lang.NullPointerException: Cannot invoke method on null
    at com.example.UserService.getUser(UserService.java:42)  ← YOUR CODE
    at com.example.UserController.show(UserController.java:15) ← YOUR CODE
    at sun.reflect.NativeMethodAccessorImpl.invoke(...)  ← FRAMEWORK
    ...
```

### Common Error Patterns
| Pattern | Meaning | Action |
|---------|---------|--------|
| "not found" | Missing resource | Check path/name/existence |
| "permission denied" | Access rights | Check file/network permissions |
| "timeout" | Slow operation | Check network/increase timeout |
| "out of memory" | Resource exhaustion | Profile memory usage |
| "connection refused" | Service unavailable | Check if service is running |

---

## 4. Logging Best Practices

### Log Levels
| Level | Use For |
|-------|---------|
| ERROR | Failures requiring attention |
| WARN | Unexpected but handled situations |
| INFO | Significant events (startup, config) |
| DEBUG | Detailed flow information |
| TRACE | Very detailed debugging |

### Effective Log Messages
```python
# Bad
logger.error("Error occurred")
logger.info("Processing")

# Good
logger.error(f"Failed to fetch user {user_id}: {error}")
logger.info(f"Processing batch of {len(items)} items for job {job_id}")
```

### What to Log
*   ✅ Function entry/exit for critical paths
*   ✅ External service calls (request/response)
*   ✅ State changes (before/after)
*   ✅ Error context (what were you trying to do?)
*   ❌ Sensitive data (passwords, tokens, PII)

---

## 5. Quick Debugging Checklist

When you encounter a bug:

- [ ] Can I reproduce it consistently?
- [ ] What is the exact error message?
- [ ] What is the stack trace?
- [ ] What was the input that caused this?
- [ ] Did this work before? What changed?
- [ ] Is this environment-specific?
- [ ] Have I checked the logs?
- [ ] Is this a known issue (search)?

---

## 6. Command Reference

| Task | Command |
|------|---------|
| **Java** | |
| Remote debug | `java -agentlib:jdwp=...` |
| Heap dump | `jmap -dump:format=b,file=heap.hprof <pid>` |
| Thread dump | `jstack <pid>` |
| **Python** | |
| Interactive debug | `breakpoint()` or `pdb.set_trace()` |
| Verbose traceback | `python -v script.py` |
| **JavaScript** | |
| Node debug | `node --inspect app.js` |
| **Go** | |
| Race detector | `go run -race main.go` |
| **Rust** | |
| Backtrace | `RUST_BACKTRACE=1 cargo run` |