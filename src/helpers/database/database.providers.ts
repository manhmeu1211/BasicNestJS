import { Sequelize } from 'sequelize-typescript';
import { Users } from 'src/model/user.entity';
import { SEQUELIZE } from '../../common/constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config: any;
        config = databaseConfig.development;
        const sequelize = new Sequelize(config);
        sequelize.addModels([Users]);
        await sequelize.sync();
        return sequelize;
    },
}];