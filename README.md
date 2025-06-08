# Task Manager App - Caching Feature

## Caching Approach

To improve performance and reduce redundant API calls, the frontend caches the task list in the browser's `localStorage`.

- On app load, it first checks if tasks exist in `localStorage`.
  - If found, it loads tasks from cache instantly.
  - Otherwise, it fetches tasks from the backend API and saves them in cache.
- When tasks are added or deleted, the app updates both the backend and the cached data to keep them in sync.
- A manual **Refresh Cache** button is provided to force re-fetch tasks from the server and update the cache.

This approach reduces network calls and speeds up app load, especially on repeat visits.

---

## How to Use

1. Open the app; it will load tasks from cache or server.
2. Add or delete tasks; changes are saved locally and remotely.
3. Use the **Refresh Cache from Server** button to manually update from the backend if needed.

---
