const config = { host: null, baseUrl: null };

export class BaseUrl {
    static updateUrl(uri) {
        config.host = uri;
        config.baseUrl = `${config.host}/api/v1/`;
    }
}

export default config;
