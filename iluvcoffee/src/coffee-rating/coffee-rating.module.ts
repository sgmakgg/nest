import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import {CoffeesModule} from "../coffees/coffees.module";
import {DatabaseModule} from "../database/database.module";
import * as process from "process";

// console.log(process.env);
@Module({
  imports: [DatabaseModule.register({ // 👈 passing in dynamic values
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    // 👇👇👇👇 Make sure these are included 👇👇👇
    // 👇👇👇👇 Make sure these are included 👇👇👇
    // 👇👇👇👇 Make sure these are included 👇👇👇
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  }), CoffeesModule],
  providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}
