const { test, expect } = require('@playwright/test');

// API-POST-001 s/d API-POST-008 : POST /api/login
test.describe('POST /api/login', () => {
  test('API-POST-001 - login kredensial valid', async ({ request }) => {
    const res = await request.post('/api/login', {
      data: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('API-POST-002 - tanpa password', async ({ request }) => {
    const res = await request.post('/api/login', { data: { email: 'eve.holt@reqres.in' } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe('Missing password');
  });

  test('API-POST-003 - tanpa email', async ({ request }) => {
    const res = await request.post('/api/login', { data: { password: 'cityslicka' } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe('Missing email or username');
  });

  test('API-POST-004 - body kosong', async ({ request }) => {
    const res = await request.post('/api/login', { data: {} });
    expect(res.status()).toBe(400);
    expect((await res.json()).token).toBeUndefined();
  });

  test('API-POST-005 - email tidak terdaftar', async ({ request }) => {
    const res = await request.post('/api/login', {
      data: { email: 'tidakada@reqres.in', password: 'cityslicka' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('user not found');
    expect(body.token).toBeUndefined();
  });

  test('API-POST-006 - format email tidak valid', async ({ request }) => {
    const res = await request.post('/api/login', {
      data: { email: 'bukan-email', password: 'cityslicka' },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).token).toBeUndefined();
  });

  test('API-POST-007 - tanpa x-api-key', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: 'https://reqres.in' });
    const res = await ctx.post('/api/login', {
      data: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
    });
    expect(res.status()).toBe(401);
    await ctx.dispose();
  });

  test('API-POST-008 - body bukan JSON valid', async ({ request }) => {
    const res = await request.post('/api/login', {
      headers: { 'Content-Type': 'application/json' },
      data: '{email: eve.holt@reqres.in',
    });
    expect(res.status()).toBeLessThan(500);
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
