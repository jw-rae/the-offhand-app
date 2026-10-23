import * as migration_20260817_135602 from './20260817_135602';
import * as migration_20260817_170000 from './20260817_170000';
import * as migration_20260817_171000 from './20260817_171000';
import * as migration_20260817_181500 from './20260817_181500';
import * as migration_20260819_045600 from './20260819_045600';
import * as migration_20261021_185122_add_user_roles_and_post_authors from './20261021_185122_add_user_roles_and_post_authors';
import * as migration_20261024_010000_add_homepage_post_queue from './20261024_010000_add_homepage_post_queue';
import * as migration_20261024_011500_backfill_published_post_dates from './20261024_011500_backfill_published_post_dates';

export const migrations = [
  {
    up: migration_20260817_135602.up,
    down: migration_20260817_135602.down,
    name: '20260817_135602'
  },
  {
    up: migration_20260817_170000.up,
    down: migration_20260817_170000.down,
    name: '20260817_170000'
  },
  {
    up: migration_20260817_171000.up,
    down: migration_20260817_171000.down,
    name: '20260817_171000'
  },
  {
    up: migration_20260817_181500.up,
    down: migration_20260817_181500.down,
    name: '20260817_181500'
  },
  {
    up: migration_20260819_045600.up,
    down: migration_20260819_045600.down,
    name: '20260819_045600'
  },
  {
    up: migration_20261021_185122_add_user_roles_and_post_authors.up,
    down: migration_20261021_185122_add_user_roles_and_post_authors.down,
    name: '20261021_185122_add_user_roles_and_post_authors'
  },
  {
    up: migration_20261024_010000_add_homepage_post_queue.up,
    down: migration_20261024_010000_add_homepage_post_queue.down,
    name: '20261024_010000_add_homepage_post_queue'
  },
  {
    up: migration_20261024_011500_backfill_published_post_dates.up,
    down: migration_20261024_011500_backfill_published_post_dates.down,
    name: '20261024_011500_backfill_published_post_dates'
  },
];
