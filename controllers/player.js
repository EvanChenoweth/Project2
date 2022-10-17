// Import Dependencies
const express = require('express')
const Player = require('../models/player')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', (req, res) => {
	Player.find({})
		.then(players => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('players/index', { players, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's players
router.get('/players?q=red', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Player.find({ owner: userId })
		.then(players => {
			res.render('players/634d512a3b8b16e426d2b203', { players, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's players
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Player.find({ owner: userId })
		.then(players => {
			res.render('players/index', { players, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('players/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Player.create(req.body)
		.then(player => {
			console.log('this was returned from create', player)
			res.redirect('/players')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const playerId = req.params.id
	Player.findById(playerId)
		.then(player => {
			res.render('players/edit', { player })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// alphabetical route
router.get('/players?q=red', (req, res) => {
	const playerId = req.params.id
	Player.findById(playerId)
		.then(player => {
            const {username, loggedIn, userId} = req.session
			res.redirect('players/634d512a3b8b16e426d2b203', { player, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const playerId = req.params.id
	Player.findById(playerId)
		.then(player => {
            const {username, loggedIn, userId} = req.session
			res.render('players/show', { player, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

router.put("/:id", (req, res) => {
    console.log("req.body initially", req.body)
    const id = req.params.id

    Player.findById(id)
        .then(player => {
            if (player.owner == req.session.userId) {
                // must return the results of this query
                return player.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            // console.log('returned from update promise', data)
            res.redirect(`/players/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// delete route
router.delete('/:id', (req, res) => {
	const playerId = req.params.id
	Player.findByIdAndRemove(playerId)
		.then(player => {
			res.redirect('/players')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
