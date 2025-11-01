// # ============================================================================
// # Browser Connection Pool (Per-Domain Concurrency Limit) - Python Version
// # ============================================================================
// # This module simulates a browser-like connection pool in Python.
// # It limits concurrent requests per domain using asyncio semaphores.
// # Works well for async HTTP workloads using aiohttp.
// #
// # -----------------------------------------------------------------------------
// # USAGE OVERVIEW
// # -----------------------------------------------------------------------------
// # 1️⃣ Create an instance of `DomainPoolManager` with a concurrency limit.
// # 2️⃣ Call `fetch(url)` to schedule async HTTP requests.
// # 3️⃣ Excess tasks are queued automatically and executed when slots open.
// # -----------------------------------------------------------------------------

import asyncio
import aiohttp
from urllib.parse import urlparse
from collections import defaultdict


class ConnectionPool:
    """
    A simple async connection pool controlling concurrent tasks.
    """

    def __init__(self, concurrency: int = 6):
        self._semaphore = asyncio.Semaphore(concurrency)

    async def enqueue(self, coro_func):
        """
        Runs a coroutine respecting the concurrency limit.
        Example: await pool.enqueue(lambda: fetch(...))
        """
        async with self._semaphore:
            return await coro_func()


class DomainPoolManager:
    """
    Manages multiple per-domain ConnectionPools.
    """

    def __init__(self, default_concurrency: int = 6):
        self.default_concurrency = default_concurrency
        self.pools = defaultdict(lambda: ConnectionPool(default_concurrency))
        self.session = aiohttp.ClientSession()

    def _get_domain_from_url(self, url: str) -> str:
        """
        Extracts the domain from a URL.
        """
        try:
            return urlparse(url).hostname or "default"
        except Exception:
            return "default"

    def get_pool_for_url(self, url: str) -> ConnectionPool:
        """
        Returns or creates a ConnectionPool for the given domain.
        """
        domain = self._get_domain_from_url(url)
        return self.pools[domain]

    async def fetch(self, url: str, **kwargs):
        """
        Fetch wrapper enforcing per-domain concurrency control.
        """
        pool = self.get_pool_for_url(url)

        async def _do_fetch():
            async with self.session.get(url, **kwargs) as response:
                data = await response.read()
                print(f"✅ Downloaded {url} ({len(data)} bytes)")
                return data

        return await pool.enqueue(_do_fetch)

    async def close(self):
        """
        Gracefully closes the aiohttp session.
        """
        await self.session.close()


// # -----------------------------------------------------------------------------
// # Example Usage
// # -----------------------------------------------------------------------------
async def main():
    manager = DomainPoolManager(default_concurrency=6)

    urls = [
        "https://httpbin.org/image/png",
        "https://httpbin.org/image/jpeg",
        "https://httpbin.org/get",
        "https://httpbin.org/bytes/512",
        "https://httpbin.org/uuid",
        "https://httpbin.org/base64/SFRUUEJJTiBpcyBhd2Vzb21l",
        "https://httpbin.org/headers",
        "https://httpbin.org/xml"
    ]

    tasks = [manager.fetch(url) for url in urls]
    await asyncio.gather(*tasks)

    await manager.close()
    print("🎉 All downloads finished!")


if __name__ == "__main__":
    asyncio.run(main())

// # -----------------------------------------------------------------------------
// # Notes & Best Practices
// # -----------------------------------------------------------------------------
// # - Uses aiohttp for async requests (install with `pip install aiohttp`)
// # - Each domain has its own concurrency semaphore.
// # - Ideal for web crawlers, scrapers, or APIs with rate limits.
// # - Extend with retry logic or exponential backoff for resilience.
// # - For heavy workloads, use connection reuse (aiohttp TCPConnector).
// # -----------------------------------------------------------------------------
