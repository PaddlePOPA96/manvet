"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMutationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../products/product.entity");
const stock_mutation_entity_1 = require("./stock-mutation.entity");
const stock_mutations_controller_1 = require("./stock-mutations.controller");
const stock_mutations_service_1 = require("./stock-mutations.service");
let StockMutationsModule = class StockMutationsModule {
};
exports.StockMutationsModule = StockMutationsModule;
exports.StockMutationsModule = StockMutationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([stock_mutation_entity_1.StockMutation, product_entity_1.Product])],
        controllers: [stock_mutations_controller_1.StockMutationsController],
        providers: [stock_mutations_service_1.StockMutationsService]
    })
], StockMutationsModule);
//# sourceMappingURL=stock-mutations.module.js.map