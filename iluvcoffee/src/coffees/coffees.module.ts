import {Module, Scope} from '@nestjs/common';
import {CoffeesController} from "./coffees.controller";
import {CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Coffee} from "./entities/cofees.entity";
import {Flavor} from "./entities/flavor.entity";
import {Event} from "../events/entities/event.entity";
import {COFFEE_BRANDS} from "./coffees.constants";
import {Connection} from "typeorm";
import {ConfigModule} from "@nestjs/config";
import coffeesConfig from "./config/coffees.config";

// class MockCoffeesService {}

// @Module({
//     imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
//     controllers: [CoffeesController],
//     providers: [{
//         provide: CoffeesService,
//         useValue: new MockCoffeesService()}], // <-- mock implementation
//     exports: [CoffeesService]
// })

// class ConfigService {}
// class DevelopmentConfigService {}
// class ProductionConfigService {}
// @Injectable()
// export class CoffeeBrandsFactory {
//     create(){
//         return ['buddy brew', 'nescafe'];
//     }
// }
// @Module({
//     imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
//     controllers: [CoffeesController],
//     providers: [
//         CoffeesService,
//         // {
//         //     provide: ConfigService,
//         //     useClass:
//         //         process.env.NODE_ENV === 'development'
//         //             ? DevelopmentConfigService
//         //             : ProductionConfigService,
//         // },
//         CoffeeBrandsFactory,
//         {
//             provide: COFFEE_BRANDS,
//             useFactory: (brandsFactory: CoffeeBrandsFactory) =>
//             brandsFactory.create(),
//             inject: [CoffeeBrandsFactory],
//         },
//     ], // <-- mock implementation
//     exports: [CoffeesService]
// })

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule, ConfigModule.forFeature(coffeesConfig)],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        // Asynchronous "useFactory" (async provider example)
        {
            provide: 'COFFEE_BRANDS',
            // Note "async" here, and Promise/Async event inside the Factory function
            // Could be a database connection / API call / etc.
            // In our case we're just "mocking" this type of event with a Promise
            useFactory: async (connection: Connection): Promise<string[]> => {
                // const coffeeBrands = await connection.query('SELECT * ...');
                const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
                console.log('[!] Async factory')
                return coffeeBrands;
            },
            scope: Scope.TRANSIENT,
            inject: [Connection],
        },
    ],
    exports: [CoffeesService]
})

export class CoffeesModule {}
