"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuckyProfileService = void 0;
var fs = require("fs");
var path = require("path");
//const profileDirectoryPath = "./bucky_profile/profiles";
var profileDirectoryPath = "profiles";
var BuckyProfileService = /** @class */ (function () {
    function BuckyProfileService() {
    }
    BuckyProfileService.prototype.profileExists = function (id) {
        try {
            var directoryPath = path.join(__dirname, profileDirectoryPath, id);
            if (fs.existsSync(directoryPath)) {
                return true;
            }
        }
        catch (err) {
            console.error(err);
            return false;
        }
        return false;
    };
    BuckyProfileService.prototype.getLocalBuckyProfile = function (id) {
        var _this = this;
        var directoryPath = path.join(__dirname, profileDirectoryPath, id);
        // `${directoryPath}/${files}`
        var buckyProfile = { id: id, name: "", description: "", behaviours: new Array() };
        var imageList = fs.readdirSync(directoryPath)
            .map(function (files) { return ({
            actionType: files.replace('.png', ''),
            imageBytes: ""
        }); });
        imageList.forEach(function (val, index) {
            val.imageBytes = _this.getFileContentByPath("".concat(directoryPath, "/").concat(val.actionType, ".png"));
            buckyProfile.behaviours.push(val);
        });
        return buckyProfile;
    };
    BuckyProfileService.prototype.getFileContentByPath = function (imgPath) {
        return fs.readFileSync(imgPath, { encoding: 'base64' });
    };
    return BuckyProfileService;
}());
exports.BuckyProfileService = BuckyProfileService;
//# sourceMappingURL=bucky-profile.service.js.map