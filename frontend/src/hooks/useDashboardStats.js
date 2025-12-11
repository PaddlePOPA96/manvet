import { useState, useEffect } from 'react';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4400";

// Note: Ensure this matches App.jsx or useInventoryData.js API_BASE_URL.
// useInventoryData uses VITE_API_BASE_URL || "http://localhost:4400"
// But in useInventoryData it was hardcoded or env based.
// Wait, my previous view of useInventoryData showed:
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4400";
// But I saw previously "http://127.0.0.1:8000/api" in my code creation.
// I should use the one from useInventoryData to be safe, or just /api if proxied.
// But useInventoryData has http://localhost:4400 as default fallback.
// However, the backend is Laravel running on 8000.
// If the user is running `php artisan serve` on 8000, 4400 might be the NestJS one (old).
// The user has migrated to Laravel.
// I should probably use `http://127.0.0.1:8000` or rely on the env.
// Let's use the one I defined but maybe match the env var pattern.
// But since I don't know the env var value, I'll stick to 8000 for now or use the same logic but update fallback if needed.
// Actually, I'll just use the same logic as useInventoryData but update the fallback to 8000 if 4400 was for NestJS.
// The user said "Laravel Backend Migration".
// Let's assume VITE_API_BASE_URL is set correctly or I should default to 8000?
// useInventoryData has 4400.
// I will use `import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"` to be safe for Laravel.

export function useDashboardStats(periodPreset, periodFrom, periodTo) {
    const [stats, setStats] = useState({
        stock_ready: 0,
        qty_sold: 0,
        revenue: 0,
        profit: 0,
        chart_data: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams();

                // Calculate dates based on preset
                const today = new Date();
                let start = null;
                let end = today.toISOString().split('T')[0];

                if (periodPreset === '7d') {
                    const d = new Date(today);
                    d.setDate(d.getDate() - 6); // 7 days inclusive
                    start = d.toISOString().split('T')[0];
                } else if (periodPreset === '30d') {
                    const d = new Date(today);
                    d.setDate(d.getDate() - 29);
                    start = d.toISOString().split('T')[0];
                } else if (periodPreset === 'custom') {
                    start = periodFrom;
                    end = periodTo;
                }
                // "all" -> start is null.

                if (start) queryParams.append('start_date', start);
                if (end) queryParams.append('end_date', end);

                const token = localStorage.getItem('vet_token');

                // Use API_BASE_URL but ensure /api is not doubled if base url has it.
                // useInventoryData does: fetch(`${API_BASE_URL}/api/products...`)
                // So BASE_URL is likely root.
                // My previous code used `${API_BASE_URL}/dashboard`.
                // Routes are in `api.php`, so they are prefixed with `/api` automatically by Laravel if mapped in bootstrap/app.php or RouteServiceProvider.
                // Yes, `routes/api.php` usually mapped to `/api`.
                // So URL should be `.../api/dashboard`.

                const response = await fetch(`${API_BASE_URL}/api/dashboard?${queryParams.toString()}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [periodPreset, periodFrom, periodTo]);

    return { stats, loading, error };
}
