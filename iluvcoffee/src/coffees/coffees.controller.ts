import {
  Body,
  Controller,
  Delete,
  Get, Inject,
  Param, ParseIntPipe,
  Patch,
  Post,
  Query, SetMetadata, UsePipes, ValidationPipe
} from '@nestjs/common';
import {CoffeesService} from "./coffees.service";
import {CreateCoffeeDto} from "./dto/create-coffee.dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto/update-coffee.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {REQUEST} from "@nestjs/core";
import {Public} from "../common/decorators/public.decorator";
import {Protocol} from "../common/decorators/protocol.decorator";

// @UsePipes(ValidationPipe) // controller scoped pipe
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService,
              @Inject(REQUEST) private request: Request
              ) {
    console.log("CoffeesService created" + request.url);
  }

  @Public()
  @UsePipes(ValidationPipe) //method scoped pipe
  @Get()
  async findAll(@Protocol('https') protocol: string, @Query() paginationQuery: PaginationQueryDto) {
    console.log(protocol);
    //await new Promise(resolve => setTimeout(resolve, 5000));
    return this.coffeesService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    console.log(id)
    return this.coffeesService.findOne(id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
