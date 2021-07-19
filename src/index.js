import {Router} from '@vaadin/router';

const router = new Router();

const routes = [
	{
		name: 'home',
		path: '/',
		component: 'auth-home',
		action: () => import('./Home.js')
	},
	{
		name: 'login',
		path: '/login',
		component: 'auth-login',
		action: () => import('./Login.js')
	},
	{
		name: 'stats',
		path: '/stats',
		component: 'auth-stats',
		action: () => import('./Stats.js')
	}
];

router.setRoutes(routes);
router.setOutlet(document.body);
