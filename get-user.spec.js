const { test, expect, request } = require('@playwright/test');

// API-GET-001 s/d API-GET-009 : GET /api/users/{id}
test.describe('GET /api/users/{id}', () => {
  test('API-GET-001 - user valid id=2', async ({ request }) => {
    const res = await request.get('/api/users/2');
    expect(res.status()).toBe(200);
    const { data, support } = await res.json();
    expect(data.id).toBe(2);
    expect(data.email).toBe('janet.weaver@reqres.in');
    expect(data.first_name).toBe('Janet');
    expect(data.last_name).toBe('Weaver');
    expect(data.avatar).toMatch(/^https?:\/\//);
    expect(support).toBeDefined();
  });

  test('API-GET-002 - user valid id=1', async ({ request }) => {
    const res = await request.get('/api/users/1');
    expect(res.status()).toBe(200);
    const { data } = await res.json();
    expect(data.id).toBe(1);
    expect(data.email).toBe('george.bluth@reqres.in');
    expect(data.first_name).toBe('George');
    expect(data.last_name).toBe('Bluth');
  });

  test('API-GET-003 - struktur dan tipe data respons', async ({ request }) => {
    const res = await request.get('/api/users/2');
    expect(res.headers()['content-type']).toContain('application/json');
    const { data } = await res.json();
    expect(typeof data.id).toBe('number');
    for (const key of ['email', 'first_name', 'last_name', 'avatar']) {
      expect(typeof data[key]).toBe('string');
    }
    expect(data.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  test('API-GET-004 - id tidak ditemukan (23)', async ({ request }) => {
    const res = await request.get('/api/users/23');
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({});
  });

  test('API-GET-005 - id bernilai 0', async ({ request }) => {
    const res = await request.get('/api/users/0');
    expect(res.status()).toBe(404);
  });

  test('API-GET-006 - id bukan angka', async ({ request }) => {
    const res = await request.get('/api/users/abc');
    expect([400, 404]).toContain(res.status());
  });

  test('API-GET-007 - tanpa x-api-key', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: 'https://reqres.in' });
    const res = await ctx.get('/api/users/2');
    expect(res.status()).toBe(401);
    await ctx.dispose();
  });

  test('API-GET-008 - x-api-key salah', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({
      baseURL: 'https://reqres.in',
      extraHTTPHeaders: { 'x-api-key': 'key_salah_123' },
    });
    const res = await ctx.get('/api/users/2');
    expect([401, 403]).toContain(res.status());
    await ctx.dispose();
  });

  test('API-GET-009 - waktu respons di bawah 2000 ms', async ({ request }) => {
    const start = Date.now();
    const res = await request.get('/api/users/2');
    const elapsed = Date.now() - start;
    expect(res.status()).toBe(200);
    expect(elapsed).toBeLessThan(2000);
  });
});
