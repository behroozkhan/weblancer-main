"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Response = function Response() {
    var success = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var _this = this;

    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

    _classCallCheck(this, Response);

    this.success = success;
    this.message = message;
    this.data = data;

    this.json = function () {
        return {
            success: _this.success,
            message: _this.message,
            data: _this.data
        };
    };
};

exports.default = Response;