// WakuContext.tsx
import React, { createContext, useState, useEffect } from 'react';
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
        debugger
        if (waku) {
            console.log("waku already initialized")
            return
        };
        console.log("waku is there: " + !!waku)

        const initializeWaku = async () => {
            try {
                const _waku = await initWaku();
                console.log('🤯 INITIALIZED WAKU!!!');
                setWaku(_waku);
            } catch (e) {
                console.error('Failed to initiate Waku', e);
            }
        };

        initializeWaku();
    }, []);

    return (
        <WakuContext.Provider value={waku}>
            {children}
        </WakuContext.Provider>
    );
}
