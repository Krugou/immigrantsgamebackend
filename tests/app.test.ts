/// <reference types="vitest" />

import createApp from '../app';

// Node 18+ has built-in fetch; the tests run in node environment

describe('backend API', () => {
  let server: import('http').Server;
  let url: string;

  beforeAll(async () => {
    const app = createApp();
    server = await new Promise<import('http').Server>((resolve) => {
      const listener = app.listen(0, () => resolve(listener));
    });
    const addr = server.address() as { port: number } | null;
    url = addr ? `http://localhost:${addr.port}` : 'http://localhost:0';
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('root is reachable', async () => {
    const res = await fetch(url + '/');
    expect(res.status).toBe(200);
    const text = await res.text();
    // check for phrase added in app.ts
    expect(text).toContain('secret backend portal');
  });

  it('health endpoint returns JSON', async () => {
    const res = await fetch(url + '/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('uptime');
  });
});
