// WakuContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LightNode } from '@waku/interfaces';
import { initWaku } from '../utils/waku';

// Define a context for waku
export const WakuContext = createContext<LightNode | undefined>(undefined);

// Provider component that initializes and provides the waku instance
export function WakuProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [waku, setWaku] = useState<LightNode | undefined>(undefined);

    // Waku initialization
    useEffect(() => {
        if (waku) return;

        const initializeWaku = async () => {
            try {
                const _waku = await initWaku();
                console.log('Waku ready');
                setWaku(_waku);
            } catch (e) {
                console.error('Failed to initiate Waku', e);
            }
        };

        initializeWaku();
    }, [waku]);

    return (
        <WakuContext.Provider value={waku}>
            {children}
        </WakuContext.Provider>
    );
}
