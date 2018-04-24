// Config file for PM2
// Install PM2: http://pm2.keymetrics.io/
// Then run with $ pm2 start ecosystem.config.js

module.exports = {
	apps : [{
		name: "cvserver",
		script: "./index.js",
		watch: true,
		env: {
			"NODE_ENV": "development",
		},
		env_production: {
			"NODE_ENV": "production"
		}
	}]
}