import {Module} from '@nestjs/common';
import {FamilyModule} from "./family/family.module";

@Module({
  imports: [FamilyModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
