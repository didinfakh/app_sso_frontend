---
name: access_check
description: Pengecekan hak akses (permission) di setiap menu dan aksi.
---

# Access Check Skill

Skill ini digunakan untuk memastikan konsistensi dalam pengecekan hak akses di seluruh aplikasi frontend proker.

## Instruksi Utama

1. **Persiapan Halaman**: Setiap halaman yang memiliki URL (terdaftar di menu) atau aksi (tambah/edit/hapus) wajib menguji izin aksesnya.
2. **Import Dependensi**:
   - `import { hasAccess } from "../services/Utils";`
   - `import AccessDenied from "../components/ui/AccessDenied";`
3. **Pencarian URL**: Gunakan `useLocation().pathname` untuk mendapatkan URL saat ini.
4. **Pengecekan Halaman (Index)**: Jika `hasAccess(path, "index")` adalah `false`, hentikan render dan tampilkan `<AccessDenied />`.
5. **Kontrol Tombol**: Sembunyikan elemen UI jika `hasAccess(path, action)` mengembalikan `false`.

## Referensi File

- [Utils.jsx](file:///mnt/hardisk1/manajemen_proker/frontend_manajemen_proker/src/services/Utils.jsx) - berisi fungsi `hasAccess`.
- [AccessDenied.jsx](file:///mnt/hardisk1/manajemen_proker/frontend_manajemen_proker/src/components/ui/AccessDenied.jsx) - komponen tampilan penolakan akses.
- [promt_frontend_2.txt](file:///mnt/hardisk1/manajemen_proker/frontend_manajemen_proker/promt_frontend_2.txt) - panduan lengkap dalam format teks.

## Contoh Penggunaan

```javascript
const location = useLocation();
const currentPath = location.pathname;
const canAdd = hasAccess(currentPath, "add");

if (!hasAccess(currentPath, "index")) return <AccessDenied />;

// ... render ...
{
  canAdd && <button>Tambah</button>;
}
```
