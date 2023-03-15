import { Inject } from '@nestjs/common';
import { BaseAbstractRepository } from '../shared/repositories/base.abstract.repository';
import OfficeEntity from '../entities/office.entity';
import { OfficeRepositoryInterface } from '../modules/office/interfaces/office.repository.interfaces';
import { OfficeDto } from '../modules/office/dto/response/office-dto';
import { PageDto } from '../common/dto/page.dto';
import ElderliesEntity from '../entities/elderlies.entity';
import { isEmpty, isNil } from 'lodash';
import { Op } from 'sequelize';
import { OfficesPageOptionsDto } from '../modules/office/dto/response/offices-option-dto';
import { CreateOfficeDto } from '../modules/office/dto/request/createofficel.dto';
import { WhereOfficeType } from '../common/constants/where-office.type';
import { OfficeExitsException } from '../exceptions/office-exits.exception';
import PaymentEntity from '../entities/payment.entity';

export class OfficeRepository extends BaseAbstractRepository<OfficeEntity> implements OfficeRepositoryInterface {
  constructor(
    @Inject(OfficeEntity.name)
    public readonly officeRepository: typeof OfficeEntity,
  ) {
    super(officeRepository);
  }

  async getOfficesWithOutCondition(officeOptionDto: OfficesPageOptionsDto): Promise<OfficeEntity[]> {
    let where = {};

    if (!isNil(officeOptionDto.officeIds) && !isEmpty(officeOptionDto.officeIds)) {
      where = { deletedAt: null, id: officeOptionDto.officeIds };
    } else {
      where = { deletedAt: null };
    }
    const offices = await this.officeRepository.findAll({
      where,
      include: [
        {
          model: ElderliesEntity,
          as: 'elderlies',
        },
        {
          model: PaymentEntity,
          as: 'payment',
        },
      ],
    });
    return offices;
  }

  async getOffices(officeOptionDto: OfficesPageOptionsDto): Promise<PageDto<OfficeDto>> {
    let condition = {};
    if (!isNil(officeOptionDto.q) && !isNil(officeOptionDto.whereOption)) {
      switch (officeOptionDto.whereOption) {
        case WhereOfficeType.NAME:
          if (!isNil(officeOptionDto.officeIds) && !isEmpty(officeOptionDto.officeIds)) {
            condition = {
              [Op.and]: [
                { name: { [Op.substring]: officeOptionDto.q } },
                { deletedAt: null },
                { id: officeOptionDto.officeIds },
              ],
            };
          } else {
            condition = {
              [Op.and]: [{ name: { [Op.substring]: officeOptionDto.q } }, { deletedAt: null }],
            };
          }
          break;
        case WhereOfficeType.CODE:
          if (!isNil(officeOptionDto.officeIds) && !isEmpty(officeOptionDto.officeIds)) {
            condition = {
              [Op.and]: [
                { code: { [Op.substring]: officeOptionDto.q } },
                { deletedAt: null },
                { id: officeOptionDto.officeIds },
              ],
            };
          } else {
            condition = {
              [Op.and]: [{ code: { [Op.substring]: officeOptionDto.q } }, { deletedAt: null }],
            };
          }
          break;
        case WhereOfficeType.PHONENUMBER:
          if (!isNil(officeOptionDto.officeIds) && !isEmpty(officeOptionDto.officeIds)) {
            condition = {
              [Op.and]: [
                { phoneNumber: { [Op.substring]: officeOptionDto.q } },
                { deletedAt: null },
                { id: officeOptionDto.officeIds },
              ],
            };
          } else {
            condition = {
              [Op.and]: [{ phoneNumber: { [Op.substring]: officeOptionDto.q } }, { deletedAt: null }],
            };
          }
          break;
        case WhereOfficeType.ADDRESS:
          if (!isNil(officeOptionDto.officeIds) && !isEmpty(officeOptionDto.officeIds)) {
            condition = {
              [Op.and]: [
                {
                  [Op.or]: [
                    { zipcode: { [Op.substring]: officeOptionDto.q } },
                    { city: { [Op.substring]: officeOptionDto.q } },
                    { province: { [Op.substring]: officeOptionDto.q } },
                    { building: { [Op.substring]: officeOptionDto.q } },
                    { addressOther: { [Op.substring]: officeOptionDto.q } },
                  ],
                },
                { deletedAt: null },
                { id: officeOptionDto.officeIds },
              ],
            };
          } else {
            condition = {
              [Op.and]: [
                {
                  [Op.or]: [
                    { zipcode: { [Op.substring]: officeOptionDto.q } },
                    { city: { [Op.substring]: officeOptionDto.q } },
                    { province: { [Op.substring]: officeOptionDto.q } },
                    { building: { [Op.substring]: officeOptionDto.q } },
                    { addressOther: { [Op.substring]: officeOptionDto.q } },
                  ],
                },
                { deletedAt: null },
              ],
            };
          }
          break;
        default:
          if (!isNil(officeOptionDto.officeIds) && !isEmpty(officeOptionDto.officeIds)) {
            condition = {
              id: officeOptionDto.officeIds,
              deletedAt: null,
            };
          } else {
            condition = {
              deletedAt: null,
            };
          }
          break;
      }
    } else {
      if (!isNil(officeOptionDto.officeIds) && !isEmpty(officeOptionDto.officeIds)) {
        condition = {
          id: officeOptionDto.officeIds,
          deletedAt: null,
        };
      } else {
        condition = {
          deletedAt: null,
        };
      }
    }
    const [items, pageMetaDto] = await this.officeRepository.paginate(officeOptionDto, condition, [
      {
        model: ElderliesEntity,
        limit: officeOptionDto.take,
        require: false,
        as: 'elderlies',
      },
      {
        model: PaymentEntity,
        require: false,
        as: 'payment',
      },
    ]);
    return items.toPageDto(pageMetaDto);
  }

  async findOneOfficeById(officeId: number): Promise<OfficeEntity | null> {
    const office = await this.officeRepository.findOne({
      where: {
        id: officeId,
      },
      include: [
        {
          model: PaymentEntity,
          as: 'payment',
        },
      ],
    });
    return office;
  }

  async findOneOfficeByCode(officeCode: string): Promise<OfficeEntity | null> {
    const office = await this.officeRepository.findOne({
      where: {
        [Op.and]: [{ code: officeCode }, { deletedAt: null }],
      },
    });
    return office;
  }

  async createOffice(officeCreateDto: CreateOfficeDto): Promise<OfficeEntity> {
    const officeExits = await this.findOneOfficeByCode(officeCreateDto.code);
    if (!isNil(officeExits) && isNil(officeExits.deletedAt)) {
      throw new OfficeExitsException();
    }
    const office = await this.officeRepository.create({
      ...officeCreateDto,
    });
    return office;
  }
}
