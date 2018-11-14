const bcrypt = require('bcryptjs')

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get('db')

        let userResult = await db.get_user(username)
        let user = userResult[0]

        if(!user) {
            return res.status(401).send('User not found. Please register as a new user before loggin in')
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        if(!isAuthenticated) {
            return res.status(403).send('Incorrect Password')
        }

        req.session.user = {
            isAdmin: user.isAdmin,
            id: user.id,
            username: user.username
        }

        return res.send(req.session.user)
    },

    register: async (req, res) => {
        const { username, password, isAdmin } = req.body
        const db = req.app.get('db')

        let userResponse = await db.check_existing_user(username)
        if(userResponse[0]){
            return res.status(409).send('Username Taken')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let createdUserResponse = await db.register_user([isAdmin, username, hash])
        let user = createdUserResponse[0]

        req.session.user = {
            isAdmin: user.isAdmin,
            id: user.id,
            username: user.username
        }

        return res.status(200).send(req.session.user)
    },

    logout: () => {
        req.session.destroy()
        res.sendStatus(200)
    }
}