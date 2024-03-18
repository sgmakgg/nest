import {
  Body,
  Controller,
  Delete,
  Get, Inject,
  Param,
  Patch,
  Post,
  Query, UsePipes, ValidationPipe
} from '@nestjs/common';
import {CoffeesService} from "./coffees.service";
import {CreateCoffeeDto} from "./dto/create-coffee.dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto/update-coffee.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {REQUEST} from "@nestjs/core";

// @UsePipes(ValidationPipe) // controller scoped pipe
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService,
              @Inject(REQUEST) private request: Request
              ) {
    console.log("CoffeesService created" + request.url);
  }

  @UsePipes(ValidationPipe) //method scoped pipe
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
