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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../products/product.entity");
const stock_mutation_entity_1 = require("../stock-mutations/stock-mutation.entity");
const transaction_entity_1 = require("./transaction.entity");
const transaction_item_entity_1 = require("./transaction-item.entity");
let TransactionsService = class TransactionsService {
    constructor(txRepo, itemRepo, mutationRepo, productRepo) {
        this.txRepo = txRepo;
        this.itemRepo = itemRepo;
        this.mutationRepo = mutationRepo;
        this.productRepo = productRepo;
    }
    async findFlat() {
        var _a, _b, _c, _d;
        const [txs, mutations] = await Promise.all([
            this.txRepo.find({
                order: { date: "DESC" },
                relations: ["items", "items.product"]
            }),
            this.mutationRepo.find({
                order: { date: "DESC" },
                relations: ["product"]
            })
        ]);
        const flat = [];
        for (const tx of txs) {
            const txDate = tx.date;
            const dateStr = txDate.toISOString().split("T")[0];
            const timestamp = txDate.toISOString();
            for (const item of tx.items) {
                const productName = ((_a = item.product) === null || _a === void 0 ? void 0 : _a.name) || "Unknown";
                flat.push({
                    id: item.id,
                    date: dateStr,
                    timestamp,
                    type: "OUT",
                    product: productName,
                    quantity: item.qty,
                    condition: "SALE",
                    reseller: "POS",
                    cost: item.cost,
                    price: item.price,
                    productionDate: ""
                });
            }
        }
        for (const m of mutations) {
            const dateStr = m.date.toISOString().split("T")[0];
            const timestamp = m.date.toISOString();
            flat.push({
                id: `M-${m.id}`,
                date: dateStr,
                timestamp,
                type: m.type,
                product: ((_b = m.product) === null || _b === void 0 ? void 0 : _b.name) || "Unknown",
                quantity: m.quantity,
                condition: m.condition,
                reseller: m.reseller || "",
                cost: ((_c = m.product) === null || _c === void 0 ? void 0 : _c.cost) || 0,
                price: ((_d = m.product) === null || _d === void 0 ? void 0 : _d.price) || 0,
                productionDate: m.productionDate
                    ? m.productionDate.toISOString().split("T")[0]
                    : ""
            });
        }
        return flat;
    }
    mapItemInput(input) {
        var _a, _b;
        const qty = Number((_b = (_a = input.qty) !== null && _a !== void 0 ? _a : input.quantity) !== null && _b !== void 0 ? _b : 0);
        const basePrice = Number.isFinite(input.basePrice)
            ? input.basePrice
            : Number(input.price) || 0;
        const price = Number(input.price) || 0;
        const cost = Number(input.cost) || 0;
        const discountPerUnit = input.discountPerUnit != null &&
            Number.isFinite(input.discountPerUnit)
            ? input.discountPerUnit
            : basePrice - price;
        return {
            type: input.type || "ITEM",
            qty,
            basePrice,
            price,
            cost,
            discountPerUnit,
            productId: input.productId != null ? Number(input.productId) : null,
            packageId: input.packageId != null ? Number(input.packageId) : null
        };
    }
    async create(dto) {
        if (!dto.items || dto.items.length === 0) {
            throw new Error("Payload harus berisi array 'items'.");
        }
        const txDate = dto.date ? new Date(dto.date) : new Date();
        const mappedItems = dto.items.map((item) => this.mapItemInput(item));
        const totalAmount = mappedItems.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 0), 0);
        const entity = this.txRepo.create({
            userId: dto.userId || 1,
            date: txDate,
            totalAmount,
            items: mappedItems
        });
        return this.txRepo.save(entity);
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_item_entity_1.TransactionItem)),
    __param(2, (0, typeorm_1.InjectRepository)(stock_mutation_entity_1.StockMutation)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map