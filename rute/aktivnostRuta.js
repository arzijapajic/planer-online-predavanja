
const express = require("express");
const router = express.Router();
const { Aktivnost } = require("../baza");
const Main = Aktivnost;

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
    const {danId, grupaId, pocetak, kraj} = req.body;
    if (!(danId && pocetak && kraj)) {
        return res.status(400).json({err:"Nevalidna aktivnost!"});
    }
    const aktivnosti = await Aktivnost.findAll();
    let zauzeto = aktivnosti.some(a => {
        return (danId == a.danId && 
            grupaId == a.grupaId && 
            a.kraj > pocetak && a.kraj < kraj || 
            kraj>a.pocetak && kraj <= a.kraj) 
    });

    if (zauzeto) {
        return res.status(400).json({err:"Vrijeme nove i neke od aktivnosti se preklapa"});
    }
    
    try {
        const [main, kreiran] = await Main.findOrCreate({ where: { ...req.body } });
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
    const {danId, grupaId, pocetak, kraj} = req.body;
    if (!(danId && pocetak && kraj)) {
        return res.status(400).json({err:"Nevalidna aktivnost!"});
    }
    const aktivnosti = await Aktivnost.findAll();
    let zauzeto = aktivnosti.some(a => {
        return (req.params.id != a.id && danId == a.danId && 
            grupaId == a.grupaId && 
            a.kraj > pocetak && a.kraj < kraj || 
            kraj>a.pocetak && kraj <= a.kraj) 
    });
    if (zauzeto) {
        return res.status(400).json({err:"Vrijeme nove i neke od aktivnosti se preklapa"});
    }
    try {
        const brojPromjena = await Main.update({ ...req.body }, { where: { id: req.params.id } });
        return res.status(201).json({
            status: true,
            brojPromjena: brojPromjena[0]
        });
    } catch (err) {
        return res.status(400).json(err)
    }
});

module.exports = router;