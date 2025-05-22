# Error Handling

## Approach

The framework:

- **Throw errors** for all API contract violations (invalid args, missing deps).

- **Console warnings** for non-blocking issues (deprecations, perf hints).

This approach gives the framework:
- Strict behavior in production.
- Rich debugging in development.
- Clear upgrade paths for deprecated features.
- Better performance than console-heavy approaches.

## Examples

| Module | Code	                 | Description                    |
|--------|-----------------------|--------------------------------|
| DOM	 | INVALID_NODE	Expected | valid DOM Node                 |
| DOM	 | INVALID_CONTAINER	 | Container must be DOM element  |
| EVENT	 | UNSUPPORTED_EVENT	 | Event type not in allowed list |
| EVENT	 | INVALID_CALLBACK	     | Callback is not a function     |
