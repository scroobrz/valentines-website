---
trigger: model_decision
description: Protocols for verifying information and preventing hallucinations.
---

# Research & Verification Standards

## Core Mandate: Verify Before Implement
**NEVER implement code based on a "hunch" or "memory" of an API.**
If you are not 100% certain about a method signature, configuration, or library feature, you **must** research it first.

---

## 1. The Anti-Hallucination Protocol

### When to Research
*   ❓ Using a library/framework for the first time
*   ❓ Unsure about exact method signature or parameters
*   ❓ Working with version-specific features
*   ❓ Error messages you don't recognize
*   ❓ Best practices for a specific pattern

### Research Steps
1. **Search**: Use `search_web` with specific query
2. **Fetch**: Use `read_url_content` on official docs
3. **Verify**: Confirm version matches project
4. **Implement**: Only then write the code

---

## 2. Search Query Best Practices

### ❌ Bad Queries
```
"how to use python library"
"javascript error fix"
"api not working"
```

### ✅ Good Queries
```
"FastAPI Pydantic v2 model_validate example"
"TypeScript 5.0 satisfies operator documentation"
"Go 1.21 slices package sort function"
"Rust tokio spawn async block move"
"Spring Boot 3.2 security filter chain configuration"
```

### Query Formula
```
[Language] [Version] [Library] [Specific Feature] [documentation/example]
```

---

## 3. Source Hierarchy

**Trust Level (High → Low):**

1. 🥇 **Official Documentation**
   - ReadTheDocs, official websites
   - Example: docs.python.org, react.dev, go.dev

2. 🥈 **GitHub Source Code**
   - README files, source code comments
   - Especially for API signatures

3. 🥉 **Reputable Blogs/Tutorials**
   - From known authors or companies
   - With recent dates

4. ⚠️ **Stack Overflow**
   - Check answer age and votes
   - Verify against docs

5. ❌ **Random Forum Posts**
   - Last resort only
   - Always verify elsewhere

---

## 4. Version Verification

**Always check versions match:**

```bash
# Python
pip show package-name  # Check installed version

# JavaScript/TypeScript
npm list package-name  # Check installed version

# Java
mvn dependency:tree | grep package  # Check Maven deps

# Go
go list -m all | grep package  # Check module version

# Rust
cargo tree | grep package  # Check crate version
```

**Then verify docs are for that version:**
- Look for version selector on docs site
- Check URL for version numbers
- Read changelog for breaking changes

---

## 5. The "Hello World" Test

When unsure about how something works:

1. **Create minimal example**
   ```python
   # test_library.py
   from unknown_lib import feature
   
   result = feature.do_thing("test")
   print(result)
   ```

2. **Run it**
   ```bash
   python test_library.py
   ```

3. **Verify behavior**
   - Does it work as expected?
   - What's the actual return type?
   - What errors occur?

4. **Then integrate**
   - Only after proving the concept

---

## 6. Documentation Patterns by Language

### Python
- **PyPI**: https://pypi.org/project/{package}/
- **Docs**: Usually linked from PyPI
- **Type Stubs**: Check for `types-{package}` on PyPI

### JavaScript/TypeScript
- **npm**: https://www.npmjs.com/package/{package}
- **GitHub**: Usually linked from npm
- **Types**: Check `@types/{package}` or built-in

### Java
- **Maven Central**: https://search.maven.org/
- **Javadoc**: Usually at {domain}/apidocs/
- **Spring**: https://docs.spring.io/

### Go
- **pkg.go.dev**: https://pkg.go.dev/{module}
- **Source**: Directly readable on pkg.go.dev

### Rust
- **crates.io**: https://crates.io/crates/{crate}
- **docs.rs**: https://docs.rs/{crate}

---

## 7. Error Research

When you encounter an error:

1. **Copy exact error message**
2. **Search with quotes**
   ```
   "exact error message" language library
   ```
3. **Check GitHub Issues**
   ```
   site:github.com "error message" repo:author/project
   ```
4. **Check Stack Overflow**
   ```
   site:stackoverflow.com "error message"
   ```

---

## 8. Prohibited Practices

*   ❌ Guessing API method names
*   ❌ Assuming behavior from similar methods
*   ❌ Using deprecated APIs without checking
*   ❌ Copying code without understanding it
*   ❌ Ignoring version mismatches
*   ❌ Trusting outdated tutorials (check dates!)

---

## 9. Quick Checklist

Before implementing with a library/API:

- [ ] Do I know the exact method signature?
- [ ] Have I verified with official docs?
- [ ] Does the docs version match my version?
- [ ] Have I tested the concept in isolation?
- [ ] Do I understand the return types?
- [ ] Do I know the error cases?