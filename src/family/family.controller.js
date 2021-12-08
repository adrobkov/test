"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.FamilyController = void 0;
var common_1 = require("@nestjs/common");
var FamilyController = /** @class */ (function () {
    function FamilyController(FamilyService) {
        this.FamilyService = FamilyService;
    }
    FamilyController.prototype.validateNotJSON = function () {
        return this.FamilyService.validateNotJSON();
    };
    FamilyController.prototype.createAll = function (body) {
        var _this = this;
        body.map(function (person) { return _this.FamilyService.createOne(person); });
        return body;
    };
    FamilyController.prototype.createOne = function (body) {
        return this.FamilyService.createOne(body);
    };
    FamilyController.prototype.getAll = function () {
        return this.FamilyService.getAll();
    };
    FamilyController.prototype.getOne = function (id) {
        return this.FamilyService.getOne(id);
    };
    FamilyController.prototype.updateOne = function (id, body) {
        return this.FamilyService.updateOne(id, body);
    };
    FamilyController.prototype.deleteOne = function (id) {
        return this.FamilyService.deleteOne(id);
    };
    FamilyController.prototype.displayProgenies = function () {
        return this.FamilyService.displayProgenies();
    };
    FamilyController.prototype.validateAll = function () { };
    FamilyController.prototype.validateOne = function (id) { };
    __decorate([
        (0, common_1.Get)('validateNotJSON')
    ], FamilyController.prototype, "validateNotJSON");
    __decorate([
        (0, common_1.Post)('createAll'),
        __param(0, (0, common_1.Body)())
    ], FamilyController.prototype, "createAll");
    __decorate([
        (0, common_1.Post)('create'),
        __param(0, (0, common_1.Body)())
    ], FamilyController.prototype, "createOne");
    __decorate([
        (0, common_1.Get)()
    ], FamilyController.prototype, "getAll");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe))
    ], FamilyController.prototype, "getOne");
    __decorate([
        (0, common_1.Patch)(':id'),
        __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
        __param(1, (0, common_1.Body)())
    ], FamilyController.prototype, "updateOne");
    __decorate([
        (0, common_1.HttpCode)(202),
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe))
    ], FamilyController.prototype, "deleteOne");
    __decorate([
        (0, common_1.Get)('progenies/:id')
    ], FamilyController.prototype, "displayProgenies");
    __decorate([
        (0, common_1.Post)('validate')
    ], FamilyController.prototype, "validateAll");
    __decorate([
        (0, common_1.Post)('validate/:id'),
        __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe))
    ], FamilyController.prototype, "validateOne");
    FamilyController = __decorate([
        (0, common_1.Controller)()
    ], FamilyController);
    return FamilyController;
}());
exports.FamilyController = FamilyController;
