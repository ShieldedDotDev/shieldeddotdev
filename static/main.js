var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("AbstractController", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var AbstractBaseController = (function () {
        function AbstractBaseController(container, name) {
            this.container = container;
            this.name = name;
            this.container.classList.add(this.name + "--controller");
        }
        AbstractBaseController.prototype.attach = function (elm) {
            elm.appendChild(this.container);
        };
        AbstractBaseController.prototype.detach = function (elm) {
            try {
                elm.removeChild(this.container);
            }
            catch (e) {
                return false;
            }
            return true;
        };
        AbstractBaseController.prototype.getContainer = function () {
            return this.container;
        };
        AbstractBaseController.prototype.getName = function () {
            return this.name;
        };
        return AbstractBaseController;
    }());
    exports.AbstractBaseController = AbstractBaseController;
});
define("EventEmitter", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var EventEmitter = (function () {
        function EventEmitter() {
            this.listeners = new Set();
        }
        EventEmitter.prototype.add = function (callback) {
            this.listeners.add(callback);
        };
        EventEmitter.prototype.trigger = function (event) {
            this.listeners.forEach(function (fn) { return fn(event); });
        };
        return EventEmitter;
    }());
    exports.EventEmitter = EventEmitter;
});
define("api/request", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    function doRequest(endpoint, method, body, mods) {
        if (method === void 0) { method = 'GET'; }
        if (body === void 0) { body = null; }
        if (mods === void 0) { mods = function () { }; }
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, doRawRequest(endpoint, method, body, mods)];
                    case 1:
                        text = _a.sent();
                        return [2, new Promise(function (resolve) {
                                var data = JSON.parse(text);
                                resolve(data);
                            })];
                }
            });
        });
    }
    exports.doRequest = doRequest;
    function doRawRequest(endpoint, method, body, mods) {
        if (method === void 0) { method = 'GET'; }
        if (body === void 0) { body = null; }
        if (mods === void 0) { mods = function () { }; }
        var request = new XMLHttpRequest();
        request.open(method, "/" + endpoint, true);
        mods(request);
        return new Promise(function (resolve, reject) {
            request.addEventListener('load', function (e) {
                if (this.status >= 200 && this.status < 400) {
                    resolve(this.responseText);
                }
                else {
                    reject({ ctx: this, event: e });
                }
            });
            request.withCredentials = true;
            request.addEventListener('error', function (e) {
                reject({ ctx: this, event: e });
            });
            if (body) {
                request.send(body);
            }
            else {
                request.send();
            }
        });
    }
    exports.doRawRequest = doRawRequest;
});
define("api/authed", ["require", "exports", "api/request"], function (require, exports, request_1) {
    "use strict";
    exports.__esModule = true;
    var AuthedApi = (function () {
        function AuthedApi() {
        }
        AuthedApi.prototype.isAuthed = function () {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, request_1.doRequest('api/authed', 'GET', null)];
                        case 1:
                            _a.sent();
                            return [2, true];
                        case 2:
                            e_1 = _a.sent();
                            return [2, false];
                        case 3: return [2];
                    }
                });
            });
        };
        return AuthedApi;
    }());
    exports.AuthedApi = AuthedApi;
});
define("api/shields", ["require", "exports", "api/request"], function (require, exports, request_2) {
    "use strict";
    exports.__esModule = true;
    var ShieldsApi = (function () {
        function ShieldsApi() {
        }
        ShieldsApi.prototype.getShields = function () {
            return request_2.doRequest('api/shields', 'GET', null);
        };
        ShieldsApi.prototype.saveShield = function (n) {
            if (n.ShieldID) {
                return request_2.doRequest("api/shield/" + n.ShieldID, 'PUT', JSON.stringify(n));
            }
            else {
                return request_2.doRequest('api/shields', 'POST', JSON.stringify(n));
            }
        };
        return ShieldsApi;
    }());
    exports.ShieldsApi = ShieldsApi;
});
define("model/ShieldsModel", ["require", "exports", "EventEmitter"], function (require, exports, EventEmitter_1) {
    "use strict";
    exports.__esModule = true;
    var ShieldsModel = (function () {
        function ShieldsModel(shieldsApi) {
            this.shieldsApi = shieldsApi;
            this.shieldEventEmitter = new EventEmitter_1.EventEmitter();
            this.shields = [];
            this.timeouts = {};
        }
        ShieldsModel.prototype.getShields = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(this.shields.length < 1)) return [3, 2];
                            _a = this;
                            return [4, this.shieldsApi.getShields()];
                        case 1:
                            _a.shields = _b.sent();
                            _b.label = 2;
                        case 2: return [2, this.shields];
                    }
                });
            });
        };
        ShieldsModel.prototype.updateShield = function (note, debounce) {
            var _this = this;
            if (debounce === void 0) { debounce = 2000; }
            var noteId = note.ShieldID;
            if (!noteId) {
                throw Error("Attempting to update unpersisted note");
            }
            var updated = false;
            this.shields.map(function (n) {
                if (n.ShieldID == noteId) {
                    updated = true;
                    return note;
                }
                return n;
            });
            if (!updated) {
                throw Error("Failed to update note");
            }
            if (this.timeouts[noteId]) {
                clearTimeout(this.timeouts[noteId].timeout);
            }
            this.shieldEventEmitter.trigger({ shield: note, event: "changed" });
            return new Promise(function (resolve) {
                var resolves = [resolve];
                if (_this.timeouts[noteId]) {
                    resolves = __spread(_this.timeouts[noteId].resolves, resolves);
                }
                _this.timeouts[noteId] = {
                    timeout: setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, r;
                        var e_2, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    this.shieldEventEmitter.trigger({ shield: note, event: "updating" });
                                    return [4, this.shieldsApi.saveShield(note)];
                                case 1:
                                    _d.sent();
                                    this.shieldEventEmitter.trigger({ shield: note, event: "updated" });
                                    try {
                                        for (_a = __values(this.timeouts[noteId].resolves), _b = _a.next(); !_b.done; _b = _a.next()) {
                                            r = _b.value;
                                            r();
                                        }
                                    }
                                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                    finally {
                                        try {
                                            if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                                        }
                                        finally { if (e_2) throw e_2.error; }
                                    }
                                    this.timeouts[noteId].resolves = [];
                                    return [2];
                            }
                        });
                    }); }, debounce),
                    resolves: resolves
                };
            });
        };
        ShieldsModel.prototype.newShield = function () {
            return __awaiter(this, void 0, void 0, function () {
                var shield;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.shieldsApi.saveShield({
                                Name: 'New Shield',
                                Title: 'New',
                                Text: 'Shield'
                            })];
                        case 1:
                            shield = _a.sent();
                            this.shields.push(shield);
                            this.shieldEventEmitter.trigger({ shield: shield, event: "created" });
                            return [2, shield];
                    }
                });
            });
        };
        return ShieldsModel;
    }());
    exports.ShieldsModel = ShieldsModel;
});
define("Controllers/ShieldController", ["require", "exports", "AbstractController", "EventEmitter"], function (require, exports, AbstractController_1, EventEmitter_2) {
    "use strict";
    exports.__esModule = true;
    var ShieldController = (function (_super) {
        __extends(ShieldController, _super);
        function ShieldController(shield) {
            var _this = _super.call(this, document.createElement("div"), "shield") || this;
            _this.shield = shield;
            _this.nameInput = document.createElement('input');
            _this.shieldImg = document.createElement('img');
            _this.updateBtn = document.createElement('button');
            _this.events = new EventEmitter_2.EventEmitter();
            _this.nameInput.value = shield.Name;
            _this.container.appendChild(_this.nameInput);
            _this.nameInput.addEventListener('input', function () {
                shield.Name = _this.nameInput.value;
            });
            _this.shieldImg.src = "https://img.shielded.dev/s/" + shield.ShieldID;
            _this.container.appendChild(_this.shieldImg);
            _this.container.appendChild(_this.updateBtn);
            _this.updateBtn.addEventListener('click', function () {
                _this.events.trigger('updated');
            });
            return _this;
        }
        return ShieldController;
    }(AbstractController_1.AbstractBaseController));
    exports.ShieldController = ShieldController;
    function ShieldURL(shield) {
        return "https://img.shielded.dev/s/" + shield.ShieldID;
    }
    exports.ShieldURL = ShieldURL;
    function ShieldMarkdown(shield) {
        return "![" + shield.Name + "](" + ShieldURL(shield) + ")";
    }
    exports.ShieldMarkdown = ShieldMarkdown;
});
define("Controllers/DashboardController", ["require", "exports", "AbstractController", "Controllers/ShieldController"], function (require, exports, AbstractController_2, ShieldController_1) {
    "use strict";
    exports.__esModule = true;
    var DashboardController = (function (_super) {
        __extends(DashboardController, _super);
        function DashboardController(model) {
            var _this = _super.call(this, document.createElement('div'), 'dashboard') || this;
            _this.model = model;
            _this.addBtn = document.createElement('button');
            _this.shieldsElm = document.createElement('div');
            _this.container.appendChild(_this.shieldsElm);
            _this.addBtn.innerText = '+';
            _this.addBtn.classList.add('add-button');
            _this.container.appendChild(_this.addBtn);
            _this.addBtn.addEventListener('click', function () {
                _this.model.newShield();
            });
            _this.render();
            return _this;
        }
        DashboardController.prototype.render = function () {
            return __awaiter(this, void 0, void 0, function () {
                var shields, _loop_1, this_1, shields_1, shields_1_1, shield;
                var e_3, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.shieldsElm.innerHTML = '';
                            return [4, this.model.getShields()];
                        case 1:
                            shields = _b.sent();
                            _loop_1 = function (shield) {
                                var sc = new ShieldController_1.ShieldController(shield);
                                sc.attach(this_1.shieldsElm);
                                sc.events.add(function (e) {
                                    switch (e) {
                                        case "updated":
                                            _this.model.updateShield(sc.shield);
                                            break;
                                    }
                                });
                            };
                            this_1 = this;
                            try {
                                for (shields_1 = __values(shields), shields_1_1 = shields_1.next(); !shields_1_1.done; shields_1_1 = shields_1.next()) {
                                    shield = shields_1_1.value;
                                    _loop_1(shield);
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (shields_1_1 && !shields_1_1.done && (_a = shields_1["return"])) _a.call(shields_1);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            return [2];
                    }
                });
            });
        };
        return DashboardController;
    }(AbstractController_2.AbstractBaseController));
    exports.DashboardController = DashboardController;
});
define("dashboard", ["require", "exports", "api/authed", "api/shields", "Controllers/DashboardController", "model/ShieldsModel"], function (require, exports, authed_1, shields_2, DashboardController_1, ShieldsModel_1) {
    "use strict";
    exports.__esModule = true;
    function Dashboard(elm) {
        return __awaiter(this, void 0, void 0, function () {
            var authApi, sapi, sm, dc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authApi = new authed_1.AuthedApi();
                        return [4, authApi.isAuthed()];
                    case 1:
                        if (!(_a.sent())) {
                            window.location.href = '/';
                        }
                        sapi = new shields_2.ShieldsApi();
                        sm = new ShieldsModel_1.ShieldsModel(sapi);
                        dc = new DashboardController_1.DashboardController(sm);
                        dc.attach(elm);
                        sm.shieldEventEmitter.add(function () {
                            dc.render();
                        });
                        return [2];
                }
            });
        });
    }
    exports.Dashboard = Dashboard;
});
