import type { ProgressRepository } from './progressRepository';

/** Used whenever Supabase isn't configured. No cloud account exists, so there's nothing to do. */
export const localProgressRepository: ProgressRepository = {
  async loadCloudProgress() {
    return null;
  },
  async mirrorNewEntries() {
    // no-op — local/guest mode never has a cloud account to mirror into
  },
};
