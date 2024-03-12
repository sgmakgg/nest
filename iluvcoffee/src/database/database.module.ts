import {DynamicModule, Module} from '@nestjs/common';
import {DataSource, DataSourceOptions} from "typeorm";

@Module({
    providers:[
        {
            provide: 'CONNECTION',
            useValue: new DataSource({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres', // username
                password: 'pass123', // user password
                database: 'postgres', // name of our database,
            }).initialize(),
        }
    ]
})
export class DatabaseModule {
    static register(options: DataSourceOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: new DataSource(options),
                }
            ]
        }
    }
}

