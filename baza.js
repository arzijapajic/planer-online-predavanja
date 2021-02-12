const { Sequelize, DataTypes } = require("sequelize");
const imeBaze = "bwt2043ST"

const sequelize = new Sequelize(imeBaze, "root", "root", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Tip = sequelize.define("tip", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    naziv: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
db.Predmet = sequelize.define("predmet", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    naziv: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
db.Grupa = sequelize.define("grupa", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    naziv: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});
db.Dan = sequelize.define("dan", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    naziv: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

db.Aktivnost = sequelize.define("aktivnost", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    naziv: {
        type: DataTypes.STRING
    },
    pocetak: {
        type: DataTypes.FLOAT
    },
    kraj: {
        type: DataTypes.FLOAT
    }
});


db.Student = sequelize.define("student", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    naziv: {
        type: DataTypes.STRING,
        allowNull: false
    },
    index: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

db.Predmet.hasMany(db.Grupa, {
    foreginKey: {
        allowNull: false
    }
});

db.Grupa.belongsTo(db.Predmet);

db.Dan.hasMany(db.Aktivnost, {
    foreginKey: {
        allowNull: false
    }
});
db.Predmet.hasMany(db.Aktivnost, {
    foreginKey: {
        allowNull: false
    }
});

db.Tip.hasMany(db.Aktivnost, {
    foreginKey: {
        allowNull: false
    }
});

db.Grupa.hasMany(db.Aktivnost);
db.Aktivnost.belongsTo(db.Predmet);
db.Aktivnost.belongsTo(db.Grupa);
db.Aktivnost.belongsTo(db.Tip);
db.Aktivnost.belongsTo(db.Dan);


db.Student.belongsToMany(db.Grupa, { through: "veza" });
db.Grupa.belongsToMany(db.Student, { through: "veza" });

module.exports = db;