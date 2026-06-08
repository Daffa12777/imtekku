import { get, set, keys, del, clear } from 'idb-keyval';

class ImtekkuStorage {
    constructor() {
        this.memoryMap = new Map();
        this.isReady = false;
    }

    async init() {
        try {
            // Load everything from IndexedDB into memory
            const allKeys = await keys();
            for (const key of allKeys) {
                const val = await get(key);
                this.memoryMap.set(key, val);
            }
            
            // Migrate legacy localStorage data to IndexedDB if present
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('imtekku') || key === 'applicants' || key === 'adminLoggedIn') {
                    if (!this.memoryMap.has(key)) {
                        const val = localStorage.getItem(key);
                        this.memoryMap.set(key, val);
                        await set(key, val); // sync to IDB
                    }
                }
            }
            this.isReady = true;
        } catch (error) {
            console.error("Failed to init ImtekkuStore", error);
            // Fallback to empty memory map
            this.isReady = true;
        }
    }

    getItem(key) {
        if (!this.isReady) console.warn('ImtekkuStore.getItem called before ready');
        return this.memoryMap.has(key) ? this.memoryMap.get(key) : null;
    }

    setItem(key, value) {
        const strValue = String(value);
        this.memoryMap.set(key, strValue);
        // Async write
        set(key, strValue).catch(e => console.error("IDB Set Error", e));
        
        // Dispatch standard storage event so window.addEventListener('storage') catches it natively-like
        // Only if we are running in browser
        if (typeof window !== 'undefined') {
            const event = new StorageEvent('storage', {
                key: key,
                newValue: strValue,
                storageArea: window.localStorage // Mock storageArea
            });
            window.dispatchEvent(event);
        }
    }

    removeItem(key) {
        this.memoryMap.delete(key);
        del(key).catch(e => console.error("IDB Del Error", e));
        
        if (typeof window !== 'undefined') {
            const event = new StorageEvent('storage', {
                key: key,
                newValue: null,
                storageArea: window.localStorage
            });
            window.dispatchEvent(event);
        }
    }

    clear() {
        this.memoryMap.clear();
        clear().catch(e => console.error("IDB Clear Error", e));
    }
}

const store = new ImtekkuStorage();
window.ImtekkuStore = store;
export default store;
