// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const playerSchema = new Schema(
	{
		name: { type: String, required: true },
		game: { type: String, required: true },
        amount: { type: Number, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Player = model('Player', playerSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Player
