import { Users } from '../model/user.entity';
import { USER_REPOSITORY } from '../common/constants';

export const usersProviders = [{
    provide: USER_REPOSITORY,
    useValue: Users,
}];