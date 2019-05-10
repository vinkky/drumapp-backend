const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';

	if (!Validator.isLength(data.name, { min: 2, max: 35 })) {
		errors.name = 'Title must be between 2 and 35 characters';
	}

	if (Validator.isEmpty(data.name)) {
		errors.name = 'Title field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

// const Validator = require('validator');
// const isEmpty = require('./is-empty');

// module.exports = function validatePostInput(data) {
//   let errors = {};

//   data.title = !isEmpty(data.title) ? data.title : '';
//   data.text = !isEmpty(data.text) ? data.text : '';

//   if (!Validator.isLength(data.title, { min: 2, max: 35 })) {
//     errors.title = 'Title must be between 2 and 35 characters';
//   }
//   if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
//     errors.text = 'Post must be between 10 and 300 characters';
//   }

//   if (Validator.isEmpty(data.text)) {
//     errors.text = 'Text field is required';
//   }

//   if (Validator.isEmpty(data.title)) {
//     errors.title = 'Title field is required';
//   }

//   return {
//     errors,
//     isValid: isEmpty(errors)
//   };
// };
