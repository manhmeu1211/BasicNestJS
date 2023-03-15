import { Inject } from '@nestjs/common';
import { BaseAbstractRepository } from '../shared/repositories/base.abstract.repository';
import { PageDto } from '../common/dto/page.dto';
import { isEmpty, isNil } from 'lodash';
import { Op } from 'sequelize';
import { PaymentRepositoryInterface } from '../modules/payment/interfaces/payment.repository.interfaces';
import PaymentEntity from '../entities/payment.entity';
import { PaymentDto } from '../modules/payment/dto/response/payment-dto';
import { PaymentPageOptionsDto } from '../modules/payment/dto/response/payment-options.dto';
import { CreatePaymentDto } from '../modules/payment/dto/request/create-payment-dto';
import OfficeEntity from '../entities/office.entity';
import { WherePaymentType } from '../common/constants/where-payment.type';
import { PaymentExitsException } from '../exceptions/payment-exits.exception';

export class PaymentRepository extends BaseAbstractRepository<PaymentEntity> implements PaymentRepositoryInterface {
  constructor(
    @Inject(PaymentEntity.name)
    public readonly paymentRepository: typeof PaymentEntity,
  ) {
    super(paymentRepository);
  }

  async getPayments(paymentOptionDto: PaymentPageOptionsDto): Promise<PageDto<PaymentDto>> {
    let condition = {};
    let where = {};
    if (!isNil(paymentOptionDto.q) && !isNil(paymentOptionDto.whereOption)) {
      switch (paymentOptionDto.whereOption) {
        case WherePaymentType.OFFICENAME:
          condition = {
            [Op.and]: [{ '$office.name$': { [Op.substring]: paymentOptionDto.q } }, { deletedAt: null }],
          };
          break;
        case WherePaymentType.BANKNAME:
          condition = {
            [Op.and]: [{ bankName: { [Op.substring]: paymentOptionDto.q } }, { deletedAt: null }],
          };
          break;
        case WherePaymentType.BRANCHNAME:
          condition = {
            [Op.and]: [{ branchName: { [Op.substring]: paymentOptionDto.q } }, { deletedAt: null }],
          };
          break;
        case WherePaymentType.ACCOUNTNAME:
          condition = {
            [Op.and]: [{ accountName: { [Op.substring]: paymentOptionDto.q } }, { deletedAt: null }],
          };
          break;
        case WherePaymentType.ACCOUNTNUMBER:
          condition = {
            [Op.and]: [{ accountNumber: { [Op.substring]: paymentOptionDto.q } }, { deletedAt: null }],
          };
          break;
        case WherePaymentType.ACCOUNTTYPE:
          condition = {
            [Op.and]: [{ accountType: { [Op.substring]: paymentOptionDto.q } }, { deletedAt: null }],
          };
          break;
        default:
          condition = {
            deletedAt: null,
          };
          break;
      }
    } else {
      condition = {
        deletedAt: null,
      };
    }

    if (!isNil(paymentOptionDto.officeIds) && !isEmpty(paymentOptionDto.officeIds)) {
      where = {
        id: paymentOptionDto.officeIds,
      };
    }

    const [items, pageMetaDto] = await this.paymentRepository.paginate(paymentOptionDto, condition, {
      model: OfficeEntity,
      require: false,
      where,
      as: 'office',
    });
    return items.toPageDto(pageMetaDto);
  }

  async findOnePaymentByPK(id: number): Promise<PaymentEntity | null> {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
      },
      include: [
        {
          model: OfficeEntity,
          as: 'office',
        },
      ],
    });
    return payment;
  }

  async findOnePaymentByAccNumber(paymentAccNumber: string): Promise<PaymentEntity | null> {
    const payment = await this.paymentRepository.findOne({
      where: {
        deletedAt: null,
        accountNumber: paymentAccNumber,
      },
    });
    return payment;
  }

  async createPayment(paymentCreateDto: CreatePaymentDto): Promise<PaymentEntity> {
    const paymentExits = await this.findOnePaymentByAccNumber(paymentCreateDto.accountNumber);
    if (!isNil(paymentExits)) {
      throw new PaymentExitsException();
    }
    const payment = await this.paymentRepository.create({ ...paymentCreateDto });
    return payment;
  }
}
