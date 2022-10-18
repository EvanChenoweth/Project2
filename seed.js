const mongoose = require('./models/connection')
const Player = require('./models/player')
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of starter fruits
    const startPlayers = [
        { name: "adkljglk", game: "ldfkjglsg", amount: 202020 },
        { name: "testuser", game: "testusers2", amount: 1020020 },
        { name: "blue", game: "football", amount: 20020202 },
        { name: "red", game: "soccer", amount: 10104404 },
        { name: "rrr", game: "rrr", amount: 10104404},
        { name: "best soccer player", game: "football", amount: 10110},
    ]

    // delete all the existing fruits
    Player.deleteMany({ owner: null })
        .then(deletedPlayers => {
            console.log('this is what .deleteMany returns', deletedPlayers)

            // create a bunch of new fruits from startFruits
            Player.create(startPlayers)
                .then(data => {
                    console.log('here are the newly created fruits', data)
                    // always close connection to the db
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    // always close connection to the db
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // always close connection to the db
            db.close()
        })
})