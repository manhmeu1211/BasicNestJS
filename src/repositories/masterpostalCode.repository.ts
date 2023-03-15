import { Inject } from '@nestjs/common';
import { BaseAbstractRepository } from '../shared/repositories/base.abstract.repository';
import MasterPostalCodesEntity from '../entities/masterpostalcode.entity';

export class MasterPostalCodeRepository extends BaseAbstractRepository<MasterPostalCodesEntity> {
  constructor(
    @Inject(MasterPostalCodesEntity.name)
    public readonly masterPostalCodeRepository: typeof MasterPostalCodesEntity,
  ) {
    super(masterPostalCodeRepository);
  }

  async getAddressByPostalcode(postalCode: string): Promise<MasterPostalCodesEntity | null> {
    const address = await this.masterPostalCodeRepository.findOne({
      where: {
        postal_code: postalCode,
      },
    });
    return address;
  }
}
