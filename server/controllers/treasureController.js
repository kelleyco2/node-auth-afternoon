module.exports = {
    dragonTreasure: async (req, res) => {
        const db = req.app.get('db')

        const dragonTreasure = await db.get_dragon_treasure(1)
        return res.send(dragonTreasure)
    },

    getMyTreasure: async (req, res) => {
        const db = req.app.get('db')

        const myTreasure = await db.get_my_treasure(req.session.user.id)
        res.send(myTreasure)
    }, 

    getAllTreasure: async (req, res) => {
        const db = req.app.get('db')

        const allTreasure = await db.get_all_treasure()
        res.send(allTreasure)
    },

    addMyTreasure: async (req, res) => {
        const { treasureUrl } = req.body
        const { id } = req.session.user
        const db = req.app.get('db')

        const a = await db.add_user_treasure([treasureUrl, id])
        res.status(201).send(a)
    }
}