const mysql = require("mysql2/promise");
const db = require("./baza");
const imeBaze = "bwt2043ST"

const DANI = [{
        naziv: "Ponedjeljak"
    },
    {
        naziv: "Utorak"
    },
    {
        naziv: "Srijeda"
    },
    {
        naziv: "Četvrtak"
    },
    {
        naziv: "Petak"
    },
];

const PREDMETI = [{
        naziv: "MUR1"
    },
    {
        naziv: "FWT"
    },
    {
        naziv: "PJP"
    }
];

const TIPOVI = [{
        naziv: "Predavanje"
    },
    {
        naziv: "Vjezba"
    }
];

const GRUPE = [{
        naziv: "MUR1grupa1",
        predmetId: "1"
    },
    {
        naziv: "BWTgrupa1",
        predmetId: "2"
    },
    {
        naziv: "PJPgrupa1",
        predmetId: "3"
    }
];

module.exports = async() => {
    const konekcija = await mysql.createConnection({ host: "localhost", port: "3306", user: "root", password: "root" });
    console.log("Konektovan na sql server");
    await konekcija.query(`CREATE DATABASE IF NOT EXISTS ${imeBaze};`);
    await db.sequelize.sync({ force: true });
    console.log("Kreirane potrebne tabele");
    await db.Dan.bulkCreate(DANI);
    await db.Tip.bulkCreate(TIPOVI);
    await db.Predmet.bulkCreate(PREDMETI);
    await db.Grupa.bulkCreate(GRUPE);
    console.log("Ubaceni pocetni podaci");
}