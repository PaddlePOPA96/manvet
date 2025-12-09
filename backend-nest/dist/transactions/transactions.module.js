"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../products/product.entity");
const stock_mutation_entity_1 = require("../stock-mutations/stock-mutation.entity");
const transaction_entity_1 = require("./transaction.entity");
const transaction_item_entity_1 = require("./transaction-item.entity");
const transactions_controller_1 = require("./transactions.controller");
const transactions_service_1 = require("./transactions.service");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                transaction_entity_1.Transaction,
                transaction_item_entity_1.TransactionItem,
                stock_mutation_entity_1.StockMutation,
                product_entity_1.Product
            ])
        ],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [transactions_service_1.TransactionsService]
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map