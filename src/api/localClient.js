const DB_NAME = 'MemoAppDB';
const DB_VERSION = 1;
const STORES = ['laundryLoads', 'spendings', 'notes', 'reminders', 'customBlocks'];

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      STORES.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const getStore = (db, storeName, mode = 'readonly') => {
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
};

// Helper to migrate data from localStorage if needed (optional)
const migrateFromLocalStorage = async () => {
  const db = await openDB();
  for (const storeName of STORES) {
    const localData = localStorage.getItem(storeName);
    if (localData) {
      const items = JSON.parse(localData);
      if (Array.isArray(items) && items.length > 0) {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        for (const item of items) {
          try {
            store.put(item);
          } catch (e) {
            console.error(`Failed to migrate item to ${storeName}`, item);
          }
        }
        // Optional: localStorage.removeItem(storeName);
      }
    }
  }
};

// Auto-migrate once
try {
  if (!localStorage.getItem('migrated_to_idb')) {
    migrateFromLocalStorage().then(() => {
      localStorage.setItem('migrated_to_idb', 'true');
    });
  }
} catch (e) {
  console.error("Migration failed", e);
}


const makeEntity = (storeName) => ({
  list: async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = getStore(db, storeName);
      const request = store.getAll();
      request.onsuccess = () => {
        const result = request.result || [];
        // Sort by created_date desc by default to match previous behavior
        result.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  },

  create: async (data) => {
    const db = await openDB();
    const newItem = {
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
      ...data,
    };
    return new Promise((resolve, reject) => {
      const store = getStore(db, storeName, 'readwrite');
      const request = store.add(newItem);
      request.onsuccess = () => resolve(newItem);
      request.onerror = () => reject(request.error);
    });
  },

  update: async (id, data) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = getStore(db, storeName, 'readwrite');
      // complex merge: get, then put
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const item = getReq.result;
        if (!item) {
          // IF item not found, maybe create it? No, error.
          reject(new Error("Item not found"));
          return;
        }
        const updatedItem = { ...item, ...data };
        const putReq = store.put(updatedItem);
        putReq.onsuccess = () => resolve(updatedItem);
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  },

  delete: async (id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = getStore(db, storeName, 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
});

export const base44 = {
  LaundryLoad: makeEntity("laundryLoads"),
  Spending: makeEntity("spendings"),
  Note: makeEntity("notes"),
  Reminder: makeEntity("reminders"),
  CustomBlock: makeEntity("customBlocks"),
};
