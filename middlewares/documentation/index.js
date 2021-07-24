'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const path = require('path');
const _ = require('lodash');
const swaggerUi = require('swagger-ui-dist');
const koaStatic = require('koa-static');

// Variables.
const initialRoutes = [];

module.exports = siapi => {
  return {
    beforeInitialize() {
      siapi.config.middleware.load.before.push('documentation');

      initialRoutes.push(..._.cloneDeep(siapi.plugins.documentation.config.routes));
    },

    initialize() {
      // Find the plugins routes.
      siapi.plugins.documentation.config.routes = siapi.plugins.documentation.config.routes.map(
        (route, index) => {
          if (route.handler === 'Documentation.getInfos') {
            return route;
          }

          if (route.handler === 'Documentation.index' || route.path === '/login') {
            route.config.policies = initialRoutes[index].config.policies;
          }

          // Set prefix to empty to be able to customise it.
          if (_.get(siapi.plugins, ['documentation', 'config', 'x-siapi-config', 'path'])) {
            route.config.prefix = '';
            route.path = `/${siapi.plugins.documentation.config['x-siapi-config'].path}${route.path}`.replace(
              '//',
              '/'
            );
          }

          return route;
        }
      );

      siapi.router.get('/plugins/documentation/*', async (ctx, next) => {
        ctx.url = path.basename(ctx.url);

        return await koaStatic(swaggerUi.getAbsoluteFSPath(), {
          maxage: siapi.config.middleware.settings.public.maxAge,
          defer: true,
        })(ctx, next);
      });
    },
  };
};
