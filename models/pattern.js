const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create a schema
const pattern = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	name: {
		type: String,
		required: true
	},
	pattern: {
		type: Array,
		required: true
	}
});

// Create a model
const Pattern = mongoose.model('pattern', pattern);

// Export the model
module.exports = Pattern;
