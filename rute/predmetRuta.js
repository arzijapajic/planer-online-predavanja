
const express = require("express");
const router = express.Router();
const { Predmet } = require("../baza");
const Main = Predmet;

router.get("/", async (req, res, next) => {
    try {
        const main = await Main.findAll();
        return res.json({ status: true, data: main });
    } catch (err) {
        return res.status(400).json(err)
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const main = await Main.findByPk(req.params.id);
        return res.json({ status: true, data: main });
    } catch (err) {
        return res.status(400).json(err)
    }
});
router.post("/", async (req, res, next) => {
    try {
        const [main, kreiran] = await Main.findOrCreate({ where: { naziv: req.body.naziv } });
        return res.status(201).json({
            status: true,
            novi: kreiran,
            data: main
        });

    } catch (err) {
        return res.status(400).json(err)
    }
});
router.delete("/:id", async (req, res, next) => {
    try {
        const brojObrisanih = await Main.destroy({ where: { id: req.params.id } });
        return res.json({
            status: true,
            brojObrisanih: brojObrisanih
        });
    } catch (err) {
        return res.status(400).json(err)
    }
});
router.put("/:id", async (req, res, next) => {
    try {
        const brojPromjena = await Main.update({ naziv: req.body.naziv }, { where: { id: req.params.id } });
        return res.status(201).json({
            status: true,
            brojPromjena: brojPromjena[0]
        });
    } catch (err) {
        return res.status(400).json(err)
    }
});

module.exports = router;