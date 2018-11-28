const env = process.env;
const currentPath = process.cwd();

const Config = module.exports = exports = {
  STORAGE_LOCATION: env.STORAGE_LOCATION || `${currentPath}/storage`,
  PORT: env.PORT || 8080,
};