# Dashboard Cache Configuration

## Cache Duration
- **Frontend Cache**: 5 minutes (300 seconds)
- **Backend Cache**: 5 minutes (300 seconds)

## Behavior
- Data dashboard akan di-cache selama 5 menit
- Selama tetap di halaman dashboard dan tidak ganti filter, **tidak ada request ke server**
- Cache otomatis di-refresh jika:
  - Lebih dari 5 menit sejak data terakhir di-fetch
  - Filter period berubah (7d → 30d, custom dates, dll)
  - User refresh halaman browser

## Benefits
✅ Mengurangi beban server  
✅ Response lebih cepat (instant dari cache)  
✅ Hemat bandwidth  
✅ User experience lebih baik  

## Files Modified
- `frontend/src/hooks/useDashboardStats.js` - Frontend cache (5 min)
- `backend-laravel/app/Http/Controllers/Api/DashboardController.php` - Backend cache (5 min)
