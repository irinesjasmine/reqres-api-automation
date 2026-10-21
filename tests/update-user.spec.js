const { test, expect } = require('@playwright/test');

// API-PUT-001 s/d API-PUT-006 : PUT /api/users/{id}
test.describe('PUT /api/users/{id}', () => {
  test('API-PUT-001 - update name dan job', async ({ request }) => {
    const res = await request.put('/api/users/2', {
      data: { name: 'morpheus', job: 'zion resident' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('morpheus');
    expect(body.job).toBe('zion resident');
    expect(body.updatedAt).toBeDefined();
  });

  test('API-PUT-002 - update hanya name', async ({ request }) => {
    const res = await request.put('/api/users/2', { data: { name: 'neo' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('neo');
    expect(body.updatedAt).toBeDefined();
  });

  test('API-PUT-003 - body kosong', async ({ request }) => {
    const res = await request.put('/api/users/2', { data: {} });
    expect(res.status()).toBe(200);
    expect((await res.json()).updatedAt).toBeDefined();
  });

  test('API-PUT-004 - tanpa x-api-key', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: 'https://reqres.in' });
    const res = await ctx.put('/api/users/2', { data: { name: 'morpheus', job: 'zion resident' } });
    expect(res.status()).toBe(401);
    await ctx.dispose();
  });

  test('API-PUT-005 - updatedAt valid dan terbaru', async ({ request }) => {
    const res = await request.put('/api/users/2', { data: { name: 'morpheus', job: 'leader' } });
    expect(res.status()).toBe(200);
    const { updatedAt } = await res.json();
    const ts = new Date(updatedAt).getTime();
    expect(Number.isNaN(ts)).toBe(false);
    expect(Math.abs(Date.now() - ts)).toBeLessThan(60 * 1000);
  });

  test('API-PUT-006 - perubahan tidak tersimpan (data demo)', async ({ request }) => {
    await request.put('/api/users/2', { data: { name: 'morpheus' } });
    const res = await request.get('/api/users/2');
    expect(res.status()).toBe(200);
    expect((await res.json()).data.first_name).toBe('Janet');
  });
});
