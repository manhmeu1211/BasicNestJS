import requestContext from 'request-context';
import UserEntity from '../entities/user.entity';

export class ContextProvider {
  private static readonly nameSpace = 'request';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  private static readonly authentication = 'authentication';

  private static readonly authenticationInfor = 'authentication_infor';

  private static readonly languageKey = 'language_key';

  private static get<T>(key: string): T {
    return requestContext.get(ContextProvider.getKeyWithNamespace(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static set(key: string, value: any): void {
    requestContext.set(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static getLanguage(): string {
    return ContextProvider.get(ContextProvider.languageKey);
  }

  static setAuthen(auth: string): void {
    ContextProvider.set(ContextProvider.authentication, auth);
  }

  static setAuthUser(user: UserEntity): void {
    ContextProvider.set(ContextProvider.authenticationInfor, user);
  }

  static getAuthUser(): UserEntity {
    return ContextProvider.get(ContextProvider.authenticationInfor);
  }
}
