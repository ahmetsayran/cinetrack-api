# Cinetrack API

Cinetrack API, modern ve tip güvenli (type-safe) bir backend altyapısı sunmayı hedefleyen bir film ve dizi izleme/puanlama sistemi platformudur.

## 🏗️ Kullanılan Teknolojiler

- **Runtime**: [Bun](https://bun.sh) (hızlı ve hafif)
- **Framework**: [ElysiaJS](https://elysiajs.com)
- **Veritabanı ORM**: [Prisma](https://prisma.io)
- **Veritabanı**: PostgreSQL
- **Doğrulama / Schema**: TypeBox (Prismabox eklentisi yardımıyla statik DTOSlar)

## 📌 Mimari Standartlar

Sistem, `modules/posts` referans alınarak dizayn edilmiştir. Her bir entity (Movie, Watchlist, Review) için ayrı bir klasörleme yapılmış ve aşağıdaki API katmanları birbirine izole edilmiştir:
1. **Controller**: API uç noktaları (`/movies`, `/reviews` vs.) yönetilir. Sadece DTO ve Service katmanlarıyla konuşur. `auth()`, `withPermission()`, `withAuditLog()` middleware'leri tüm süreçlere entegredir.
2. **Service**: İş mantığının kalbidir. Prisma yardımıyla veri tabanına CRUD atar.
3. **DTOs**: Elysia swagger ve Request/Param yüklerinin geçerliliğini denetler. Güvenlik için kullanıcının hassas verileri buradan silinir (`userId` vb).
4. **Types**: DTO'lardan faydalanıp statik `Type` güvenceleri çıkarır.
5. **Formatters**: Sunucudan çıkan cevabı (Response) client'ın ihtiyacı olan son json nesnesine çevirir.

Önemli Not: API servislerinin veritabanı ile haberleşmesi için projede standart olarak yer alan `docker-compose.yml` altyapısı mevcuttur. Ancak **Docker zorunlu bir bağımlılık değildir**. Doğrudan Postgres yüklü bilgisayarlarda veya sunucularda `.env` üzerinden `DATABASE_URL` değişkeni verilerek API herhangi bir sanallaştırmaya gerek kalmaksızın sorunsuz çalışabilmektedir.

## 🚀 Başlangıç ve Kurulum

### 1) Bağımlılıkların Yüklenmesi
```bash
bun install
```

### 2) Çevresel Değişkenlerin Ayarlanması
`config/apps/api/.env` dosyanıza kendi veritabanı bilgilerinizi sağlayın.
```env
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/cinetrack"
```

### 3) Veritabanı Migration & Client Yaratma
Prisma schema'sındaki yeni değişiklikleri kurmak için:
```bash
bun run prisma generate
cd packages/database && bun run prisma db push # veya migrate dev
```

### 4) Uygulamayı Başlatma
Projeyi gelişim (dev) ortamında ayağa kaldırmak için api dizininden:
```bash
bun run dev
```

> REST API dökümantasyonu için `http://localhost:3000/docs` rotasını izleyebilirsiniz (Swagger UI).
