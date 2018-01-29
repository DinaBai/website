/**
 * Primarily only used for genome persmisions right now.
 * See P3JsonRest.js for query related requests
 *
 */
define([
	"dojo/request", "dojo/_base/declare", "dojo/_base/lang",
	"dojo/_base/Deferred", "dojo/topic", "./jsonrpc", "dojo/Stateful",
	"dojo/promise/all"
], function(
	xhr, declare, lang,
	Deferred, Topic, RPC, Stateful, All){

	var DataAPI = (declare([Stateful], {
		token: null,
		apiUrl: null,
		postOpts: {
			handleAs: 'json',
			headers: {
				"content-type": "application/json",
				"X-Requested-With": null,
				"Authorization": ""
			}
		},

		addGenomePermission: function(id, user, perm){
			console.log('called add genome perm', id, user, perm)
			if(!id || !user || !perm){
				console.log('addGenomePermission expects id, user, and permission');
				return;
			}

			if( ['read', 'write', 'r', 'w'].indexOf(perm) == -1 || !perm ){
				console.log('Permission "' + perm +'" not valid!');
				return;
			}

			if(perm == 'r')
				perm = 'read';
			else if(permission == 'w')
				perm = 'write';

			var data = {
				op: 'add',
				user: user,
				permission: perm
			}

			this.post(id, data).then(function(res){
				console.log('add genome permissions res:', res)
			})
		},


		checkPermParams: function(id, user, perm){
			//implement
		},

		post: function(id, data){
			var params = Object.assign({data: JSON.stringify(data)}, this.postOpts),
				url = this.apiUrl + 'permissions/genome/' + id;

			return xhr.post(url, params)
		},

		get: function(data){
			// implement if needed
		},

		init: function(apiUrl, token){
			if(!apiUrl || !token){
				console.log("Unable to initialize data api. Args: ", arguments);
				return;
			}

			this.postOpts.headers.Authorization = token;
			this.apiUrl = apiUrl;
		}
	}))();

	return DataAPI;
});
