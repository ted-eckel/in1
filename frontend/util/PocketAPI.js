export const pocketRetrieve = options => {
	// return fetch('api/pocket_retrieve', {
	// 	method: 'post',
	// 	body: JSON.stringify(options)
	// }).then(response => response.json());
	return $.ajax({
		method: 'POST',
		url: '/api/pocket_retrieve',
		data: options
	});
};
