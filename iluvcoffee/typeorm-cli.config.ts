import {DataSource} from "typeorm";
import {CoffeeRefactor1708535071596} from "./src/migrations/1708535071596-CoffeeRefactor";
import {Coffee} from "./src/coffees/entities/cofees.entity";
import {Flavor} from "./src/coffees/entities/flavor.entity";
import {SchemaSync1708535947356} from "./src/migrations/1708535947356-SchemaSync";


export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    entities: [Coffee, Flavor],
    migrations: [CoffeeRefactor1708535071596, SchemaSync1708535947356],
});