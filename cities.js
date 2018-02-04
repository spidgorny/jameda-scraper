"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var fs = require("fs");
var puppeteer = require('puppeteer');
function getCities(page) {
    return __awaiter(this, void 0, void 0, function () {
        var cities, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cities = {};
                    if (!fs.existsSync('cities.json')) return [3 /*break*/, 1];
                    json = fs.readFileSync('cities.json');
                    cities = JSON.parse(json.toString());
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, page.$$eval('div.left-innen div ul li a', function (set) {
                        var cities = {};
                        set.forEach(function (a) {
                            console.log(a);
                            var name = a.innerText;
                            cities[name] = a.href;
                        });
                        return cities;
                    })];
                case 2:
                    cities = _a.sent();
                    fs.writeFileSync('cities.json', JSON.stringify(cities));
                    _a.label = 3;
                case 3: return [2 /*return*/, cities];
            }
        });
    });
}
function getDoctors(page, cityLink) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('cityLink', cityLink);
                    return [4 /*yield*/, page.goto(cityLink)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.$$eval('div.ergebnis', function (set) {
                            // console.log('set', set.length);
                            return set.map(function (div) {
                                var img = div.querySelector('div.portrait-small img');
                                var face = img ? img.getAttribute('src') : null;
                                var a = div.querySelector('div.ergebnis-info h2 a');
                                var addr = div.querySelector('div.ergebnis-info h2 + div');
                                var address = addr ? addr.innerText.trim() : null;
                                var job = div.querySelector('div.ergebnis-info p.grau');
                                job = job ? job.innerText.trim() : null;
                                //console.log(a.innerText);
                                return {
                                    name: a.innerText,
                                    details: a.getAttribute('href'),
                                    address: address,
                                    face: face,
                                    job: job
                                };
                            });
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var browser, page, cities, _a, _b, _i, city, cityLink, doctors;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, puppeteer.launch()];
            case 1:
                browser = _c.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _c.sent();
                return [4 /*yield*/, page.goto('https://www.jameda.de/arztsuche/fachgebiete/staedte/aerzte/augenaerzte/')];
            case 3:
                _c.sent();
                page.on('console', function (msg) {
                    for (var i = 0; i < msg.args.length; ++i)
                        console.log(i + ": " + msg.args[i]);
                });
                return [4 /*yield*/, getCities(page)];
            case 4:
                cities = _c.sent();
                console.log('cities', cities);
                _a = [];
                for (_b in cities)
                    _a.push(_b);
                _i = 0;
                _c.label = 5;
            case 5:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                city = _a[_i];
                console.log('== ', city);
                cityLink = cities[city];
                return [4 /*yield*/, getDoctors(page, cityLink)];
            case 6:
                doctors = _c.sent();
                console.log(doctors);
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8: return [4 /*yield*/, browser.close()];
            case 9:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); })();
