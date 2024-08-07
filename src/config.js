"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationCodeInfo = exports.caching = exports.redis = exports.logDirectory = exports.tokenInfo = exports.corsUrl = exports.db = exports.timezone = exports.port = exports.environment = void 0;
// Mapper for environment variables
exports.environment = process.env.NODE_ENV;
exports.port = process.env.PORT;
exports.timezone = process.env.TZ;
exports.db = {
    name: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_USER_PWD || '',
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
};
exports.corsUrl = process.env.CORS_URL;
exports.tokenInfo = {
    accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
    refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
    issuer: process.env.TOKEN_ISSUER || '',
    audience: process.env.TOKEN_AUDIENCE || '',
};
exports.logDirectory = process.env.LOG_DIR;
exports.redis = {
    host: process.env.REDIS_HOST || '',
    port: parseInt(process.env.REDIS_PORT || '0'),
    password: process.env.REDIS_PASSWORD || '',
};
exports.caching = {
    contentCacheDuration: parseInt(process.env.CONTENT_CACHE_DURATION_MILLIS || '600000'),
};
exports.verificationCodeInfo = {
    codeValidity: parseInt(process.env.VERIFICATION_CODE_VALIDITY_SEC || '600')
};
