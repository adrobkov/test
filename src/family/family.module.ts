import {Module} from '@nestjs/common';
import {FamilyService} from 'src/family/family.service';
import {FamilyController} from 'src/family/family.controller';

@Module({
  providers: [FamilyService],
  controllers: [FamilyController],
})
export class FamilyModule {
}
