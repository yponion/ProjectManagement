const {override, overrideDevServer} = require('customize-cra');

const devServerConfig = () => (config) => {
    return {
        ...config,
        allowedHosts: 'all',  // 모든 호스트에서 접근을 허용
        headers: {'Access-Control-Allow-Origin': '*'},
        historyApiFallback: true,  // SPA 라우팅을 위한 설정
        proxy: {
            '/api': 'http://localhost:8080'
        }
    };
};

module.exports = {
    webpack: override(
        // 여기에 추가 웹팩 설정
    ),
    devServer: overrideDevServer(
        devServerConfig()
    )
};
