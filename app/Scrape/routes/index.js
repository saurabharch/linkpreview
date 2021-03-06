'use strict';
import {codeLoading, codeLoaded, codeLoadError} from 'actions/app';
import { routeErrorHandler, routeModuleHandler } from 'routes/index';
import App from 'Scrape/App';
import Index from 'Scrape/Index';
import { polyfill } from 'es6-promise';
import NotFound from 'Scrape/NotFound';
polyfill();

//this handler can only be used if a module is to be resolved from 'containers/Footer' folder
const getComponentHandler = ({store, options, modulePath}) => (location, cb) => {
  store.dispatch(codeLoading());
  import(/* webpackChunkName: "Scrape-[request]" */`Scrape/${modulePath}`)
  .then(routeModuleHandler({store, cb, options}))
  .catch(routeErrorHandler({store, cb, options}));
};

export const SCRAPE_BASE_ROUTE = '/';

export default (store, options) => {
    return {
        path: SCRAPE_BASE_ROUTE,
        name: 'scrape-home',
        component: App,
        getChildRoutes(location, cb) {
            const docs = import(/* webpackChunkName: "docs-routes" */'./docs');
            const otherRoutes = import(/* webpackChunkName: "other-routes" */'./others');

            Promise.all([docs, otherRoutes])
            .then(routeModuleHandler({store, cb, isMultiple: true, options}))
            .catch(routeErrorHandler({store, cb, options: {orginated: 'child routes', ...options}}));
        },
        indexRoute: {component: Index}
    };
}
