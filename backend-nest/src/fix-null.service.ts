import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class FixNullService implements OnApplicationBootstrap {
    constructor(private dataSource: DataSource) { }

    async onApplicationBootstrap() {
        try {
            await this.dataSource.query(`UPDATE "Product" SET name='Unnamed' WHERE name IS NULL`);
            await this.dataSource.query(`UPDATE "TransactionItem" SET type='UNKNOWN' WHERE type IS NULL`);
            await this.dataSource.query(`UPDATE "Role" SET name='guest' WHERE name IS NULL`);
            console.log('✅ Fixed null values in Product, TransactionItem, and Role tables');
        } catch (e) {
            console.error('❌ Error fixing null values:', e);
        }
    }
}
