import {Inject, Injectable, NotFoundException, Scope} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {Coffee} from "./entities/cofees.entity";
import {CreateCoffeeDto} from "./dto/create-coffee.dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto/update-coffee.dto";
import {Flavor} from "./entities/flavor.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Event} from "../events/entities/event.entity";
import {COFFEE_BRANDS} from "./coffees.constants";
import {ConfigService, ConfigType} from "@nestjs/config";
import coffeesConfig from "./config/coffees.config";

@Injectable(/*{scope: Scope.TRANSIENT}*/{scope: Scope.REQUEST})
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly dataSource: DataSource,
        // @Inject(COFFEE_BRANDS) coffeeBrands: string[],
        // private readonly configService: ConfigService,
        @Inject(coffeesConfig.KEY)
        private coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    ) {
        console.log("CoffeesService instantiated");
        // const databaseHost = this.configService.get<string>('DATABASE_HOST');
        // const databaseHost = this.configService.get('database.host');
        // const coffeesConfig = this.configService.get('coffees.foo');
        // console.log(databaseHost);
        console.log(coffeesConfiguration.foo);
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        return this.coffeeRepository.find({
            relations: {
                flavors: true
            },
            skip: offset,
            take: limit
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({
            where: {id: +id},
            relations: {
                flavors: true
            },
        })
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors =
            updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
            ));

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }

        return this.coffeeRepository.save(coffee);
    }

    async remove(id: string) {
        const coffee  = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({ where: { name } }); // 👈 notice the "where"
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepository.create({ name });
    }
}
