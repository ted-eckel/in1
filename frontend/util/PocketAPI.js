export const pocketRetrieve = options => {
	return $.ajax({
		method: 'POST',
		url: '/api/pocket_retrieve',
		data: options
	});
};

export const pocketModify = options => {
	return $.ajax({
		method: 'POST',
		url: 'api/pocket_modify',
		data: options
	})
}

export const pocketAdd = options => {
	return $.ajax({
		method: 'POST',
		url: 'api/pocket_add',
		data: options
	})
}
