import { Module } from '@nestjs/common';
import {CoffeesController} from "./coffees.controller";
import {CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Coffee} from "./entities/cofees.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Coffee])],
    controllers: [CoffeesController],
    providers: [CoffeesService]
})
export class CoffeesModule {}
