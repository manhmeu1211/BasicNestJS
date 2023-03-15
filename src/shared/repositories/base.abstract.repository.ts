import { Model as OriginalModel } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { BaseInterfaceRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<T extends Model<T>> implements BaseInterfaceRepository<Model> {
  model: typeof OriginalModel;
  constructor(model: typeof OriginalModel) {
    this.model = model;
  }

  getAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
}
