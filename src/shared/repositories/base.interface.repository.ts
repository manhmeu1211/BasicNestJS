export interface BaseInterfaceRepository<T> {
  getAll(): Promise<T[]>;
}
