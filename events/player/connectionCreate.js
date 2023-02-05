module.exports = {
	name: 'conectionCreate',
	once: false,
	async execute(queue, connection) {
        // console.log('Player Log : Successfully created connection!');
		console.log("EventPlayer | ConnectionCreate :");
		// console.log(queue);
		console.log(connection);
	},
};