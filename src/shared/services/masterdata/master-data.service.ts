import { Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { MasterPostalCodeRepository } from '../../../repositories/masterpostalCode.repository';
import { MasterPostalCodeDto } from '../../../modules/masterdata/dto/response/masterpostalcode-dto';
import { DataNotFoundException } from '../../../exceptions/data_not_found.excetion';

@Injectable()
export class MasterDataService {
  constructor(
    @Inject(MasterPostalCodeRepository.name)
    public readonly masterRepository: MasterPostalCodeRepository,
  ) {}

  async getAddressByPostalCode(postalCode: string): Promise<MasterPostalCodeDto> {
    const address = await this.masterRepository.getAddressByPostalcode(postalCode);
    if (isNil(address)) {
      throw new DataNotFoundException();
    }
    return address.toDto();
  }
}
