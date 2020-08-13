'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getConfig = undefined;

var getConfig = exports.getConfig = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return _models2.default.Config.find({
                            where: {
                                key: key
                            }
                        });

                    case 3:
                        return _context.abrupt('return', _context.sent);

                    case 6:
                        _context.prev = 6;
                        _context.t0 = _context['catch'](0);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 6]]);
    }));

    return function getConfig(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _models = require('./models.js');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Config = function Config(sequelize, DataTypes) {
    var Config = sequelize.define('Config', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING,
            unique: true
        },
        value: {
            type: DataTypes.JSON
        }
    });

    return Config;
};

exports.default = Config;