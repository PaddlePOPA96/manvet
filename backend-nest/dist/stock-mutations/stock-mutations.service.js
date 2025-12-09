"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMutationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_mutation_entity_1 = require("./stock-mutation.entity");
let StockMutationsService = class StockMutationsService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        if (!dto.productId ||
            !dto.type ||
            !dto.condition ||
            !dto.quantity ||
            !dto.date) {
            throw new Error("Field 'productId', 'type', 'condition', 'quantity', dan 'date' wajib diisi.");
        }
        const parsedDate = new Date(dto.date);
        const parsedProdDate = dto.productionDate && dto.productionDate !== ""
            ? new Date(dto.productionDate)
            : null;
        const entity = this.repo.create({
            productId: Number(dto.productId),
            type: dto.type,
            condition: dto.condition,
            quantity: Number(dto.quantity),
            date: parsedDate,
            reseller: dto.reseller || null,
            productionDate: parsedProdDate
        });
        return this.repo.save(entity);
    }
};
exports.StockMutationsService = StockMutationsService;
exports.StockMutationsService = StockMutationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_mutation_entity_1.StockMutation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StockMutationsService);
//# sourceMappingURL=stock-mutations.service.js.map