import { useState, useEffect, useRef } from 'react';
import { useDashboardCache } from '../contexts/DashboardCacheContext';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4400";

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

    const { getCachedData, setCachedData, isCacheValid } = useDashboardCache();
    const fetchingRef = useRef(false);

    useEffect(() => {
        // Prevent multiple simultaneous fetches
        if (fetchingRef.current) return;

        async function fetchStats() {
            // Create cache key based on period parameters
            const cacheKey = `dashboard-${periodPreset}-${periodFrom}-${periodTo}`;

            // Check if we have valid cached data (5 minutes cache)
            if (isCacheValid(cacheKey, 300000)) { // Cache for 5 minutes instead of 30 seconds
                const cached = getCachedData(cacheKey);
                if (cached && cached.data) {
                    setStats(cached.data);
                    return;
                }
            }

            fetchingRef.current = true;
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

                // Cache the fetched data
                setCachedData(cacheKey, data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError(err);
            } finally {
                setLoading(false);
                fetchingRef.current = false;
            }
        }

        fetchStats();
    }, [periodPreset, periodFrom, periodTo]); // Only depend on period params

    return { stats, loading, error };
}
