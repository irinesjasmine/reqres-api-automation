# ReqRes API Automation

Automasi pengujian API untuk https://reqres.in menggunakan Playwright Test.

Endpoint yang diuji:
- GET  /api/users/{id}
- POST /api/login
- PUT  /api/users/{id}

Total 23 test case, sesuai tab "API Test Cases" di Google Sheet.

## Persiapan
1. Install Node.js 18 atau lebih baru.
2. Buat API key gratis di https://app.reqres.in (menu API Keys).
3. Install dependency:
   ```
   npm install
   ```
4. Salin `.env.example` menjadi `.env`, lalu isi:
   ```
   REQRES_API_KEY=isi_api_key_kamu
   ```

## Menjalankan test
```
npm test                                   # semua test
npx playwright test tests/login.spec.js    # satu file
npm run report                             # buka laporan HTML
```

## Struktur
```
tests/
  get-user.spec.js      API-GET-001 .. 009
  login.spec.js         API-POST-001 .. 008
  update-user.spec.js   API-PUT-001 .. 006
playwright.config.js    base URL dan header default (x-api-key dari .env)
```

## Catatan
- Plan gratis ReqRes dibatasi 250 request per hari. Satu kali jalan memakai sekitar 25 request.
- Test untuk skenario tanpa API key dibuat dengan context terpisah supaya header default tidak ikut terkirim.
- Beberapa assertion (mis. id bukan angka) menerima lebih dari satu status code karena perilaku server tidak didokumentasikan secara pasti.
