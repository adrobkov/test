"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FamilyService = void 0;
var common_1 = require("@nestjs/common");
var array_1 = require("@src/array");
var FamilyService = /** @class */ (function () {
    function FamilyService() {
        this.list = array_1.array;
        this.trees = [];
    }
    FamilyService.prototype.createOne = function (newPerson) {
        var person = this.trees.find(function (p) { return p.id === newPerson.id; });
        if (person) {
            throw new common_1.HttpException('Член родословной с таким id уже существует', common_1.HttpStatus.NOT_FOUND);
        }
        this.trees.push(newPerson);
        return newPerson;
    };
    FamilyService.prototype.getOne = function (id) {
        var person = this.trees.find(function (p) { return p.id === id; });
        if (!person) {
            throw new common_1.HttpException('Член родословной с таким id не найден', common_1.HttpStatus.NOT_FOUND);
        }
        return person;
    };
    FamilyService.prototype.getAll = function () {
        return this.trees;
    };
    FamilyService.prototype.updateOne = function (id, body) {
        var idx = this.trees.findIndex(function (p) { return p.id === id; });
        if (idx < 0) {
            throw new common_1.HttpException('Член родословной с таким id не найден', common_1.HttpStatus.NOT_FOUND);
        }
        this.trees[idx] = body;
        return body;
    };
    FamilyService.prototype.deleteOne = function (id) {
        var idx = this.trees.findIndex(function (p) { return p.id === id; });
        if (idx < 0) {
            throw new common_1.HttpException('Член родословной с таким id не найден', common_1.HttpStatus.NOT_FOUND);
        }
        var person = this.trees.find(function (p) { return p.id === id; });
        this.trees.splice(idx, 1);
        return person;
    };
    FamilyService.prototype.validate = function () { };
    FamilyService.prototype.validateNotJSON = function () {
        var set = new Set();
        this.list.map(function (_a) {
            var id = _a.id, gender = _a.gender, parents = _a.parents;
            set.add(gender === 'MALE' ? -id : id);
            if (parents.length > 2) {
                throw new Error("\u0423 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0447\u043B\u0435\u043D\u0430 \u0440\u043E\u0434\u043E\u0441\u043B\u043E\u0432\u043D\u043E\u0439 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C \u0434\u0432\u0430 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044F. \u041E\u0448\u0438\u0431\u043A\u0430 \u0432 id: ".concat(id));
                //TODO Ошибка никогда не выскочит, так как для входных данных определен интерфейс
            }
            parents.map(function (parentId) {
                if (id === parentId) {
                    throw new Error("\u0427\u043B\u0435\u043D \u0440\u043E\u0434\u043E\u0441\u043B\u043E\u0432\u043D\u043E\u0439 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u043C \u0441\u0430\u043C \u0441\u0435\u0431\u0435. \u041E\u0448\u0438\u0431\u043A\u0430 \u0432 id: ".concat(id));
                }
            });
        });
        var _loop_1 = function (v) {
            this_1.list.map(function (_a) {
                var id = _a.id, parents = _a.parents;
                if (v === id || v === -id) {
                    var arrayParent_1 = [];
                    var father_1 = false;
                    var mather_1 = false;
                    parents.map(function (parentId) {
                        if (set.has(-parentId)) {
                            if (father_1) {
                                throw new Error("\u0423 \u0447\u043B\u0435\u043D\u0430 \u0440\u043E\u0434\u043E\u0441\u043B\u043E\u0432\u043D\u043E\u0439 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u0432\u0430 \u043E\u0442\u0446\u0430. \u041E\u0448\u0438\u0431\u043A\u0430 \u0432 id: ".concat(id));
                            }
                            father_1 = true;
                            arrayParent_1.push(parentId);
                        }
                        if (set.has(parentId)) {
                            if (mather_1) {
                                throw new Error("\u0423 \u0447\u043B\u0435\u043D\u0430 \u0440\u043E\u0434\u043E\u0441\u043B\u043E\u0432\u043D\u043E\u0439 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u0432\u0435 \u043C\u0430\u0442\u0435\u0440\u0438. \u041E\u0448\u0438\u0431\u043A\u0430 \u0432 id: ".concat(id));
                            }
                            mather_1 = true;
                            arrayParent_1.push(-parentId);
                        }
                    });
                    if (arrayParent_1.length !== parents.length) {
                        throw new Error("\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044F \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442. \u041E\u0448\u0438\u0431\u043A\u0430 \u0432 id: ".concat(id));
                    }
                }
            });
        };
        var this_1 = this;
        for (var _i = 0, set_1 = set; _i < set_1.length; _i++) {
            var v = set_1[_i];
            _loop_1(v);
        }
    };
    FamilyService.prototype.displayProgenies = function () { };
    FamilyService = __decorate([
        (0, common_1.Injectable)()
    ], FamilyService);
    return FamilyService;
}());
exports.FamilyService = FamilyService;
