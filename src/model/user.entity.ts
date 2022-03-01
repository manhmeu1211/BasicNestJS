import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Users extends Model<Users> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "The field cannot be empty"
      }
    }
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "The field cannot be empty"
      }
    }
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "The field cannot be empty"
      }
    }
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "The field cannot be empty"
      }
    }
  })
  birthday: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "The field cannot be empty"
      }
    }
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  avatar_url: string;

  @Column({
    type: DataType.INTEGER,
  })
  company_id: number;

  @Column({
    type: DataType.INTEGER,
  })
  role: number;
}