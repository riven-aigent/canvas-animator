export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "canvas-animator/_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BdQZv7t6.js",app:"_app/immutable/entry/app.B2boRmEB.js",imports:["_app/immutable/entry/start.BdQZv7t6.js","_app/immutable/chunks/up6IS91Z.js","_app/immutable/chunks/BCmFIbmc.js","_app/immutable/chunks/Cf9gXw06.js","_app/immutable/chunks/BrvNypCE.js","_app/immutable/chunks/CaN-eVNQ.js","_app/immutable/entry/app.B2boRmEB.js","_app/immutable/chunks/BCmFIbmc.js","_app/immutable/chunks/Cf9gXw06.js","_app/immutable/chunks/BrvNypCE.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
