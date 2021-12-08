import {Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {FamilyService} from 'src/family/family.service';
import {FamilyInterface} from 'src/family/family.interface';

@Controller()
export class FamilyController {
  constructor(private readonly FamilyService: FamilyService) {}

  @Post('create')
  createOne(@Body() body: FamilyInterface, @Query() query: any): FamilyInterface {
    return this.FamilyService.createOne(body, query.validation);
  }

  @Post('createAll')
  createAll(@Body() body: FamilyInterface[], @Query() query: any): FamilyInterface[] {
    body.map((person) => this.FamilyService.createOne(person, query.validation));
    return body;
  }

  @Get('incestuous')
  displayIncestuous() {
    return this.FamilyService.displayIncestuous();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number, @Query() query: any): FamilyInterface {
    return this.FamilyService.getOne(id, query.validation);
  }

  @Get()
  getAll(@Query() query: any): FamilyInterface[] {
    return this.FamilyService.getAll(query.validation);
  }

  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: FamilyInterface,
    @Query() query: any,
  ): FamilyInterface {
    return this.FamilyService.updateOne(id, body, query.validation);
  }

  @HttpCode(202)
  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number): FamilyInterface {
    return this.FamilyService.deleteOne(id);
  }

  @Get('progenies/:id')
  displayProgenies(@Param('id', ParseIntPipe) id: number): string | undefined {
    return this.FamilyService.displayProgenies(id);
  }

  @Get('brothers-and-sisters/:id')
  displayBrothersAndSisters(@Param('id', ParseIntPipe) id: number): string | undefined {
    return this.FamilyService.displayBrothersAndSisters(id);
  }
}
