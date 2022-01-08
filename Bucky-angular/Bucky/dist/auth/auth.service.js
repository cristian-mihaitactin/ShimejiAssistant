"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var environment_1 = require("../environments/environment");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var axios_observable_1 = require("axios-observable");
var jwt_decode_1 = require("jwt-decode");
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.initalState = { profile: null, tokens: null, authReady: false };
        this.authReady$ = new rxjs_2.BehaviorSubject(false);
        this.state = new rxjs_2.BehaviorSubject(this.initalState);
        this.state$ = this.state.asObservable();
        this.tokens$ = this.state.pipe((0, operators_1.filter)(function (state) { return state.authReady; }), (0, operators_1.map)(function (state) { return state.tokens; }));
        this.profile$ = this.state.pipe((0, operators_1.filter)(function (state) { return state.authReady; }), (0, operators_1.map)(function (state) { return state.profile; }));
        this.loggedIn$ = this.tokens$.pipe((0, operators_1.map)(function (tokens) { return !!tokens; }));
    }
    AuthService.prototype.init = function () {
        var _this = this;
        return this.startupTokenRefresh().pipe((0, operators_1.tap)(function () { return _this.scheduleRefresh(); }));
    };
    AuthService.prototype.register = function (data) {
        var config = {
            baseURL: "".concat(environment_1.environment.baseApiUrl),
            url: '/account/register',
            method: "POST",
            data: data,
        };
        return axios_observable_1.Axios.request(config)
            .pipe((0, rxjs_1.catchError)(function (res) { return (0, rxjs_1.throwError)(function () {
            console.log(res);
            new Error(res.json());
        }); }));
    };
    AuthService.prototype.login = function (user) {
        var _this = this;
        return this.getTokens(user, 'password').pipe((0, rxjs_1.catchError)(function (res) { return (0, rxjs_1.throwError)(res.json()); }), (0, operators_1.tap)(function (res) { return _this.scheduleRefresh(); }));
    };
    AuthService.prototype.logout = function () {
        this.updateState({ profile: null, tokens: null });
        if (this.refreshSubscription$) {
            this.refreshSubscription$.unsubscribe();
        }
        this.removeToken();
    };
    AuthService.prototype.refreshTokens = function () {
        var _this = this;
        return this.state.pipe((0, rxjs_1.first)(), (0, operators_1.map)(function (state) { return state.tokens; }), (0, operators_1.flatMap)(function (tokens) { return _this.getTokens({ refresh_token: tokens.refresh_token }, 'refresh_token').pipe((0, rxjs_1.catchError)(function (error) { return (0, rxjs_1.throwError)('Session Expired'); })); }), (0, operators_1.map)(function (res) { return res.data.json(); }));
    };
    AuthService.prototype.storeToken = function (tokens) {
        var previousTokens = this.retrieveTokens();
        if (previousTokens != null && tokens.refresh_token == null) {
            tokens.refresh_token = previousTokens.refresh_token;
        }
        localStorage.setItem('auth-tokens', JSON.stringify(tokens));
    };
    AuthService.prototype.retrieveTokens = function () {
        var tokensString = localStorage.getItem('auth-tokens');
        var tokensModel = tokensString == null ? null : JSON.parse(tokensString);
        return tokensModel;
    };
    AuthService.prototype.removeToken = function () {
        localStorage.removeItem('auth-tokens');
    };
    AuthService.prototype.updateState = function (newState) {
        var previousState = this.state.getValue();
        this.state.next(Object.assign({}, previousState, newState));
    };
    AuthService.prototype.getTokens = function (data, grantType) {
        //const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        //const options = new RequestOptions({ headers: headers });
        var _this = this;
        Object.assign(data, { grant_type: grantType, scope: 'openid offline_access' });
        var params = new URLSearchParams();
        Object.keys(data)
            .forEach(function (key) { return params.append(key, data[key]); });
        var options = {
            baseURL: "".concat(environment_1.environment.baseApiUrl),
            url: '/connect/token',
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: params,
        };
        // return this.http.post(`${environment.baseApiUrl}/connect/token`, params.toString(), options).pipe(
        return axios_observable_1.Axios.request(options)
            .pipe((0, operators_1.tap)(function (res) {
            var tokens = res.data.json();
            var now = new Date();
            tokens.expiration_date = new Date(now.getTime() + tokens.expires_in * 1000).getTime().toString();
            var profile = (0, jwt_decode_1.default)(tokens.id_token);
            _this.storeToken(tokens);
            _this.updateState({ authReady: true, tokens: tokens, profile: profile });
        }));
        //});
    };
    AuthService.prototype.startupTokenRefresh = function () {
        var _this = this;
        return (0, rxjs_1.of)(this.retrieveTokens()).pipe((0, operators_1.flatMap)(function (tokens) {
            if (!tokens) {
                _this.updateState({ authReady: true });
                return (0, rxjs_1.throwError)('No token in Storage');
            }
            var profile = (0, jwt_decode_1.default)(tokens.id_token);
            _this.updateState({ tokens: tokens, profile: profile });
            if (+tokens.expiration_date > new Date().getTime()) {
                _this.updateState({ authReady: true });
            }
            return _this.refreshTokens();
        }), (0, rxjs_1.catchError)(function (error) {
            _this.logout();
            _this.updateState({ authReady: true });
            return (0, rxjs_1.throwError)(error);
        }));
    };
    AuthService.prototype.scheduleRefresh = function () {
        var _this = this;
        this.refreshSubscription$ = this.tokens$.pipe((0, rxjs_1.first)(), 
        // refresh every half the total expiration time
        (0, operators_1.flatMap)(function (tokens) { return (0, rxjs_1.interval)(tokens.expires_in / 2 * 1000); }), (0, operators_1.flatMap)(function () { return _this.refreshTokens(); }))
            .subscribe();
    };
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map