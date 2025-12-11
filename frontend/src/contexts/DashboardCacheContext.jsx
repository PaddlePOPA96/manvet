import React, { createContext, useContext, useState, useCallback } from 'react';

const DashboardCacheContext = createContext(null);

export function DashboardCacheProvider({ children }) {
    const [cache, setCache] = useState({});

    const getCachedData = useCallback((key) => {
        return cache[key];
    }, [cache]);

    const setCachedData = useCallback((key, data) => {
        setCache(prev => ({
            ...prev,
            [key]: {
                data,
                timestamp: Date.now()
            }
        }));
    }, []);

    const isCacheValid = useCallback((key, maxAge = 30000) => { // 30 seconds default
        const cached = cache[key];
        if (!cached) return false;
        return (Date.now() - cached.timestamp) < maxAge;
    }, [cache]);

    return (
        <DashboardCacheContext.Provider value={{ getCachedData, setCachedData, isCacheValid }}>
            {children}
        </DashboardCacheContext.Provider>
    );
}

export function useDashboardCache() {
    const context = useContext(DashboardCacheContext);
    if (!context) {
        throw new Error('useDashboardCache must be used within DashboardCacheProvider');
    }
    return context;
}
