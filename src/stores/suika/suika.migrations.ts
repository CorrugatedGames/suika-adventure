import { ISuika } from '../../interfaces/suika';

export const suikaStoreMigrations = [
  {
    version: 0,
    migrate: (state: ISuika) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'suika' }));
