const DB_NAME = 'FEZ_SaveData';
const STORE_NAME = 'files';
const DB_VERSION = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function persistFile(key, data) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    // data arrives as Uint8Array from C# byte[] marshaling
    tx.objectStore(STORE_NAME).put(new Uint8Array(data), key);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => { db.close(); reject(tx.error); };
    });
}

export async function loadFile(key) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            db.close();
            // Return empty Uint8Array if not found (C# checks length)
            resolve(req.result ? new Uint8Array(req.result) : new Uint8Array(0));
        };
        req.onerror = () => { db.close(); reject(req.error); };
    });
}

export async function loadFileBase64(key) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            db.close();
            if (!req.result) { resolve(''); return; }
            const bytes = new Uint8Array(req.result);
            let binary = '';
            for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
            resolve(btoa(binary));
        };
        req.onerror = () => { db.close(); reject(req.error); };
    });
}

export async function deleteFile(key) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => { db.close(); reject(tx.error); };
    });
}

export function openUrl(url) {
    window.open(url, '_blank') || (window.location.href = url);
}

export async function getAllKeys() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAllKeys();
    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            db.close();
            // Return pipe-separated string (simpler than array marshaling)
            resolve(req.result.join('|'));
        };
        req.onerror = () => { db.close(); reject(req.error); };
    });
}
