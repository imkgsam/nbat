"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNSpotInSequence = exports.findOneSpotInSequence = exports.genEID = exports.generateNdigitRandomNumber = exports.addMillisToCurrentDate = exports.findIpAddress = void 0;
var moment_1 = require("moment");
var Logger_1 = require("../core/Logger");
var js_md5_1 = require("js-md5");
var crypto_1 = require("crypto");
/**
 * retrive ip address from request header
 * @param req
 * @returns ip or undifined
 */
function findIpAddress(req) {
    try {
        if (req.headers['x-forwarded-for']) {
            return req.headers['x-forwarded-for'].toString().split(',')[0];
        }
        else if (req.connection && req.connection.remoteAddress) {
            return req.connection.remoteAddress;
        }
        return req.ip;
    }
    catch (e) {
        Logger_1.default.error(e);
        return undefined;
    }
}
exports.findIpAddress = findIpAddress;
/**
 * add mili-sec to current time
 * @param millis
 * @returns Date
 */
function addMillisToCurrentDate(millis) {
    return (0, moment_1.default)().add(millis, 'ms').toDate();
}
exports.addMillisToCurrentDate = addMillisToCurrentDate;
function generateNdigitRandomNumber(n, min, max) {
    if (n < 1) {
        throw new Error('N should be greater than 0');
    }
    else {
        var nmin = Math.pow(10, n - 1);
        var nmax = Math.pow(10, n) - 1;
        if (n == 1) {
            nmin--;
        }
        if (min && max && min <= max) {
            if (min > nmin) {
                nmin = min;
            }
            if (max < nmax) {
                nmax = max;
            }
        }
        return crypto_1.default.randomInt(nmin, nmax).toString().padEnd(n, '0');
    }
}
exports.generateNdigitRandomNumber = generateNdigitRandomNumber;
//员工编号-(唯一识别号, [年]-[h3/1]-[月]-[h3/2]-[日]-[h3/3]-[性别] md5-hash后三位975 陈双鹏2024年01月01日入职男 2490170151 )
function genEID(name, inaugurationDate, sex) {
    inaugurationDate = new Date(inaugurationDate);
    var md5hash = selectFirstNdigits(3, (0, js_md5_1.md5)(name).toString(), '000');
    var year = inaugurationDate.getFullYear().toString().slice(-2);
    var month = ('0' + inaugurationDate.getMonth()).slice(-2);
    var date = ('0' + inaugurationDate.getDate()).slice(-2);
    var sexCode = sex === 'Male' ? 1 : sex === 'Female' ? 0 : 2;
    console.log(md5hash, year, month, date, sexCode);
    return "".concat(year).concat(md5hash[0]).concat(month).concat(md5hash[1]).concat(date).concat(md5hash[2]).concat(sexCode);
}
exports.genEID = genEID;
function selectFirstNdigits(count, input, defaultRt) {
    if (!count || !input)
        return defaultRt;
    if (count > input.length)
        return defaultRt;
    var rt = '';
    for (var i = 0; i < input.length; i++) {
        if (isDigit(input[i])) {
            rt = rt + input[i];
            if (rt.length === count)
                break;
        }
    }
    if (rt.length === count) {
        return rt;
    }
    return defaultRt;
}
var isDigit = function (character) {
    var DIGIT_EXPRESSION = /^\d$/;
    if (!character)
        return false;
    return DIGIT_EXPRESSION.test(character);
};
function findOneSpotInSequence(arr, min) {
    console.log(arr, min);
    var rt = min;
    if (arr && arr.length > 0) {
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] - arr[i - 1] != 1) {
                rt = arr[i - 1] + 1;
                break;
            }
        }
    }
    return rt;
}
exports.findOneSpotInSequence = findOneSpotInSequence;
function findNSpotInSequence(arr, min, max, n) {
    var rt = [];
    if (n && n > 0 && arr && arr.length > 0) {
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] - arr[i - 1] != 1) {
                var diff = arr[i] - arr[i - 1];
                var start_1 = 1;
                while (diff > 1) {
                    rt.push(arr[i - 1] + start_1);
                    diff = diff - 1;
                    n = n - 1;
                    start_1 = start_1 + 1;
                    if (n === 0) {
                        return rt;
                    }
                }
            }
        }
        var start = 1;
        while (n > 0) {
            rt.push(max + start);
            start = start + 1;
            n = n - 1;
        }
    }
    return rt;
}
exports.findNSpotInSequence = findNSpotInSequence;
