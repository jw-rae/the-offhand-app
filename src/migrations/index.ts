import * as migration_20260817_135602 from './20260817_135602';
import * as migration_20260817_170000 from './20260817_170000';
import * as migration_20260817_171000 from './20260817_171000';
import * as migration_20260817_181500 from './20260817_181500';
import * as migration_20260819_045600 from './20260819_045600';

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
];
