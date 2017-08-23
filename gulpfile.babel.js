////import gulp configs
import Develop from './configs/gulp-dev.config.js';
import Production from './configs/gulp-production.config.js';


// export each develop task.
// Example of using the "dev_styles" task, like `npm run singleTask dev_styles`
export * from './configs/gulp-dev.config.js';
// export each production task.
// Example of using the "prod_styles" task, like `npm run singleTask prod_styles`
export * from './configs/gulp-production.config.js';


// Develop task (default task) = `npm run dev`
export default Develop;
// Production task = `npm run production`
export { Production };
