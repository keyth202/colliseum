exports.DATABASE_URL = process.env.DATABASE_URL ||
					   global.DATABASE_URL ||
					   'mongodb://localhost/colliseumdb';
exports.PORT = process.env.PORT || 8080;
/*
exports.TEST_DATABASE_URL = process.env.DATABASE_URL ||
					   global.DATABASE_URL ||
					   'mongodb://localhost/tempTestDb';
					   */