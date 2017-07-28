var mongoose = require('mongoose');

var QuoteSchema = new mongoose.Schema({
	todo: {
		type: String,
		required: true,
		trim: true
	},
	status: {
		type: Number,
        default: 0
	}
});

var Quote = mongoose.model('Quote', QuoteSchema);
module.exports = Quote;