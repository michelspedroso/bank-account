import 'source-map-support/register';
import 'reflect-metadata';

module.exports = async () => {
  process.env.APP_ENV = 'test';
  process.env.npm_package_version = '1.0.0';
  process.env.npm_package_name = 'test_service';
};
