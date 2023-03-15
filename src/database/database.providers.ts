import { Sequelize } from 'sequelize-typescript';

import { ApiConfigService } from '../shared/services/api-config.service';

export const databaseProviders = [
  {
    provide: Sequelize.name,
    // eslint-disable-next-line @typescript-eslint/require-await
    useFactory: async (configService: ApiConfigService): Promise<Sequelize> => configService.databaseConfig,
    inject: [ApiConfigService],
  },
];
