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
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer = require('puppeteer');
var readline = require('readline'); //사용자의 입력을 받을때 사용하는 모듈
var r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function getData(In) {
    return __awaiter(this, void 0, void 0, function () {
        var mails, browser, page, e_1, e_2, names, subjects, _a, _b, _i, index, data, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    mails = []; //변수에 배열 할당
                    return [4 /*yield*/, puppeteer.launch({ headless: true })];
                case 1:
                    browser = _e.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _e.sent();
                    return [4 /*yield*/, page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, page.goto('https://accounts.google.com/ServiceLogin/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=AddSession', { waitUntill: 'networkidle' })];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, page.type('input[type=email]', In.id)];
                case 5:
                    _e.sent(); // 첫번째 인자(셀렉터) 를찾아 아이디(In.id)를 type 한다.
                    return [4 /*yield*/, page.click('#identifierNext')];
                case 6:
                    _e.sent(); //다음버튼 클릭
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, page.waitForNavigation({
                            waitUntil: 'networkidle2',
                            timeout: 2000,
                            visible: true
                        })];
                case 8:
                    _e.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_1 = _e.sent();
                    console.log("아이디 가 없습니다.");
                    browser.close();
                    return [3 /*break*/, 10];
                case 10: return [4 /*yield*/, page.evaluate(//참조한 pass를 가지고 패스워드입력창에 대입 
                    "document.querySelector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input').value = \"" + In.password + "\";")];
                case 11:
                    _e.sent(); //왜부변수 pass의 값참조
                    return [4 /*yield*/, page.click('#passwordNext')];
                case 12:
                    _e.sent(); //로그인 버튼 클릭
                    _e.label = 13;
                case 13:
                    _e.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, page.waitForSelector('.mb', { timeout: 6500, visible: true })];
                case 14:
                    _e.sent();
                    return [3 /*break*/, 16];
                case 15:
                    e_2 = _e.sent();
                    console.log("비밀번호가 맞지않습니다.");
                    browser.close();
                    return [3 /*break*/, 16];
                case 16: return [4 /*yield*/, page.$$('.yW')];
                case 17:
                    names = _e.sent();
                    return [4 /*yield*/, page.$$('.y6')];
                case 18:
                    subjects = _e.sent();
                    _a = [];
                    for (_b in names)
                        _a.push(_b);
                    _i = 0;
                    _e.label = 19;
                case 19:
                    if (!(_i < _a.length)) return [3 /*break*/, 23];
                    index = _a[_i];
                    data = void 0;
                    data = { subject: '', sender: '' }; //data 변수에 빈객체 선언 
                    _c = data;
                    return [4 /*yield*/, names[index].$eval('span', function (element) { return element.textContent; })];
                case 20:
                    _c.sender = _e.sent(); //1.names배열에서 names[index](ElementHandle) 의 원소를 받아서  2.$eval() 을 실행하면 해당원소에서 span 셀렉터를 찾아 element 에 넣고 element.outerText를 브라우저 콘솔창에서 실행한후 3.나오는 값을 반환하여 빈객체 data.sender에 넣는다.
                    _d = data;
                    return [4 /*yield*/, subjects[index].$eval('span', function (element) { return element.textContent; })];
                case 21:
                    _d.subject = _e.sent();
                    //위와 같은방식
                    mails.push(data);
                    _e.label = 22;
                case 22:
                    _i++;
                    return [3 /*break*/, 19];
                case 23:
                    browser.close(); //브라우저 창을 닫는다.
                    return [2 /*return*/, mails]; //mails (items 타입들의 배열) 을 반환한다.
            }
        });
    });
}
// async function authentication(){
//     let In: input= {
//         id :"",
//         password :""
//     };
//     await new Promise((resolove,reject)=>{
//          r.question("your gmail id: ",function(id: string){
//          console.log(id);
//          In.id=id;
//          r.question("password: ",function(password: string){
//           console.log(password);
//           In.password=password;
//          r.close();
//          resolve();
//         })
//       })
//     })
//       return In;
//  }
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var In, output, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    In = {
                        id: "",
                        password: ""
                    };
                    output = {
                        mails: []
                    };
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            r.question("your gmail id: ", function (id) {
                                In.id = id;
                                r.question("password: ", function (password) {
                                    In.password = password;
                                    r.close();
                                    resolve();
                                });
                            });
                        })
                        // In=await authentication();
                    ];
                case 1:
                    _b.sent();
                    // In=await authentication();
                    _a = output;
                    return [4 /*yield*/, getData(In)];
                case 2:
                    // In=await authentication();
                    _a.mails = _b.sent();
                    return [2 /*return*/, output];
            }
        });
    });
}
exports.main = main;
