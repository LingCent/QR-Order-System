import { OrderReceipt } from '../types';

const WAL_KEY = 'nexus_qr_wal_v1';

export type WalEntry = OrderReceipt & {
  isSynced: boolean;
  syncAttempts: number;
};

export const WalService = {
  // 1. Atomic Append (Log-First Strategy)
  persist: (receipt: OrderReceipt): void => {
    try {
      const logs = WalService.getLogs();
      // Initialize with sync status false
      const entry: WalEntry = { ...receipt, isSynced: false, syncAttempts: 0 };
      logs.push(entry);
      localStorage.setItem(WAL_KEY, JSON.stringify(logs));
      console.log(`[WAL] 🔒 Order ${receipt.id} secured to local disk. Hash: ${receipt.walHash}`);
    } catch (e) {
      console.error('[WAL] Disk Write Failure:', e);
      // In a real app, this might trigger a fallback memory-only mode or alert the user
    }
  },

  // 2. Retrieve the Ledger
  getLogs: (): WalEntry[] => {
    try {
      const raw = localStorage.getItem(WAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  // 3. Mark as Synced (Eventual Consistency)
  markSynced: (orderId: string): void => {
    const logs = WalService.getLogs();
    const updated = logs.map(log => 
      log.id === orderId ? { ...log, isSynced: true } : log
    );
    localStorage.setItem(WAL_KEY, JSON.stringify(updated));
    console.log(`[WAL] ✅ Order ${orderId} marked as synced.`);
  },

  // 4. Garbage Collection (Keep ledger lean)
  garbageCollection: (): void => {
    const logs = WalService.getLogs();
    // Keep data for 48 hours for dispute resolution/offline proof
    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    const filtered = logs.filter(log => log.timestamp > cutoff);
    if (filtered.length !== logs.length) {
        localStorage.setItem(WAL_KEY, JSON.stringify(filtered));
        console.log(`[WAL] 🧹 Garbage collection removed ${logs.length - filtered.length} old entries.`);
    }
  }
};