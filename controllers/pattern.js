const mongoose = require('mongoose');
const User = require('../models/user');
const Pattern = require('../models/pattern');
const validateEventInput = require('../validation/pattern');

mongoose.set('debug', true);

module.exports = {
	test: async (req, res) => {
		res.json({ msg: 'Pattern Work' });
	},

	createPattern: async (req, res) => {
		const { errors, isValid } = validateEventInput(req.body);
		if (!isValid) {
			res.status(400).json(errors);
		} else {
			User.findById(req.user.id).then((user) => {
				Pattern.find({ $and: [ { creator: user.id }, { name: req.body.name } ] }).then((pattern) => {
					if (!pattern.length) {
						const newPattern = new Pattern({
							creator: user,
							name: req.body.name,
							pattern: req.body.pattern
						});
						newPattern.save().then((pattern) => {
							res.json(pattern);
						});
					} else {
						return res.status(400).json('same name not allowed');
					}
				});
			});
		}
	},
	getPattern: async (req, res) => {
		User.findById(req.user.id).then((user) => {
			Pattern.find({ creator: { $all: user.id } }).then((patterns) => {
				return res.json(patterns);
			});
		});
	},
	getPatterns: async (req, res) => {
		User.findById(req.user.id).then((user) => {
			Pattern.find({ $and: [ { creator: user.id }, { name: req.body.name } ] }).then((pattern) => {
				return res.json(pattern);
			});
		});
	},
	deletePattern: async (req, res) => {
		Pattern.findByIdAndRemove(req.body.id, (err, tasks) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send('successfully deleted');
		});
	},

	renamePattern: async (req, res) => {
		User.findById(req.user.id).then((user) => {
			Pattern.findOne({ $and: [ { creator: user.id }, { _id: req.body.id } ] }).then((pattern) => {
				if (pattern.name !== req.body.name) {
					pattern.name = req.body.name;
					pattern.save().then((pattern) => {
						return res.status(200).json('name has been updated');
					});
				} else {
					return res.status(400).json('same name not allowed');
				}
			});
		});
	},

	updatePattern: async (req, res) => {
		Pattern.findById(req.body.id).then((pattern) => {
			pattern.pattern = req.body.pattern;
			pattern
				.save()
				.then(() => {
					return res.status(200).json('name has been updated');
				})
				.catch(() => {
					return res.status(400).json('something went wrong');
				});
		});
	}
	// fetchSingleUsers: async (req, res) => {
	// 	const { errors, isValid } = validateEventInput(req.body);
	// 	if (!isValid) {
	// 		res.status(400).json(errors);
	// 	} else {
	// 		User.findById(req.user.id).then((user) => {
	// 			const newPattern = new Pattern({
	// 				creator: user,
	// 				name: req.body.name,
	// 				pattern: req.body.pattern
	// 			});
	// 			newPattern.save().then((pattern) => {
	// 				res.json(pattern);
	// 			});
	// 		});
	// 	}
	// }
};
