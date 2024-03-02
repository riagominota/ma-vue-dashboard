import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import routes from './routes';
import constants from '@/boot/constants';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// const createHistory = process.env.SERVER ? createMemoryHistory : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory;

const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(constants.MA_BASE_URL)
});
/* Router.beforeEach((to, from, next) => {
    if (to.name === 'login') {
        next(); // login route is always  okay (we could use the requires auth flag below). prevent a redirect loop
     } else if (to.meta && to.meta.requiresAuth === true && !useUserState().isLoggedIn) {
        next({ name: 'login' }); // always put your redirect as the default case
      } else if (to.meta && to.meta.requiresAuth === false) {
        next(); // requires auth is explicitly set to false
      } else if (useUserState().isLoggedIn) {
        if (to.name !== '') {
          next(); // Logged in. carry on
        } else {
          next({ name: 'dashboard' });
        }
      } else {
        next({ name: 'login' }); // always put your redirect as the default case
      }

}); */
export default Router;
