const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');
const bodyParser = require('body-parser');
const Raspored = require('./raspored.js');

require("./priprema")();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// serviranje statickih fajlova iz foldera public
app.use(express.static('public'))

function vratiUkupnoMinuta (vrijeme) {
	let [sati, minute] = vrijeme.split(':');

	return parseInt(sati) * 60 + parseInt(minute);
}

app.post('/raspored', (req, res) => {
	// let {naziv,aktivnost,dan,pocetak,kraj} = req.body;
	let naziv = req.body.naziv;
	let aktivnost = req.body.aktivnost;
	let dan = req.body.dan;
	let pocetak = req.body.pocetak;
	let kraj = req.body.kraj;

	if (!naziv || !aktivnost || !dan || !pocetak || !kraj) {
		return res.status(400).send('Nedostaju parametri forme!');
	}
	var reNaziv = new RegExp('^[a-zA-Z]+\\d?$');
	if (!reNaziv.test(naziv)) {
		return res.status(400).send('Naziv nije ispravan!');
	}
	var reAktivnost = new RegExp('([Pp]redavanje|[Vv]je[zž]be)');
	if (!reAktivnost.test(aktivnost)) {
		return res.status(400).send('Aktivnost nije ispravna!');
	}

	var reDan = new RegExp('^([Pp]onedjeljak|[Uu]torak|[Ss]rijeda|[CČc]etvrtak|[Pp]etak)$');
	if (!reDan.test(dan)) {
		return res.status(400).send('Dan nije ispravna!');
	}

	var rePocetak = new RegExp('^([0-1][0-9]|[2][0-3]):([0-5][0-9])$');
	if (!rePocetak.test(pocetak)) {
		return res.status(400).send('Pocetak nije ispravna!');
	}

	var reKraj = new RegExp('^([0-1][0-9]|[2][0-3]):([0-5][0-9])$');
	if (!reKraj.test(kraj)) {
		return res.status(400).send('Kraj nije ispravna!');
	}

	fs.readFile('raspored.csv', 'utf-8', (err, data) => {
		let preklapanjeTermina = false;

		if (data) {
			let redovi = data.trim().split('\n');

			let noviTerminPocetakUkupnoMinuta = vratiUkupnoMinuta(pocetak);
			let noviTerminKrajUkupnoMinuta = vratiUkupnoMinuta(kraj);
			for (let red of redovi) {
				if (!red) continue;
				let [terminNaziv, terminAktivnost, terminDan, terminPocetak, terminKraj] = red.split(',');
				let terminPocetakUkupnoMinuta = vratiUkupnoMinuta(terminPocetak);
				let terminKrajUkupnoMinuta = vratiUkupnoMinuta(terminKraj);

				if (
					dan.toLowerCase() === terminDan.toLowerCase() &&
					((noviTerminPocetakUkupnoMinuta >= terminPocetakUkupnoMinuta &&
						noviTerminPocetakUkupnoMinuta < terminKrajUkupnoMinuta) ||
						(noviTerminKrajUkupnoMinuta > terminPocetakUkupnoMinuta &&
							noviTerminKrajUkupnoMinuta <= terminKrajUkupnoMinuta))
				) {
					preklapanjeTermina = true;
					break;
				}
			}
		}

		if (!preklapanjeTermina) {
			let novaLinija = `${naziv},${aktivnost},${dan},${pocetak},${kraj}\n`;

			fs.appendFile('raspored.csv', novaLinija, function (err) {
				if (err) return res.status(500).send('Greska prilikom upisa!');
				return res.status(201).send('Novi red uspjesno dodan!');
			});
		} else {
			return res.status(400).send('Novi termin se preklapa sa postojecim!');
		}
	});
});

app.get('/raspored', (req, res) => {
	
	fs.readFile('./raspored.csv', 'utf8', (err, data) => {
	
		if (err) {
			res.status(500).json({ greska: 'Datoteka raspored.csv nije kreirana!' });
	
			return;
		}
	
		let aktivnosti = (new Raspored(data.toString())).termini;
		let dan = req.query.dan;
		let sortiranjeString = req.query.sort;
		
		if (sortiranjeString) {
		
			let sortirajAscDesc = sortiranjeString.charAt(0).toLowerCase();
			let sortParametar = sortiranjeString.slice(1).toLowerCase();
			let sortParametarReg = new RegExp(/^(naziv|aktivnost|dan|pocetak|kraj)$/);
		
			let ascDescOk = sortirajAscDesc === "a" || sortirajAscDesc === "d";
			let sortParametarOk = sortParametarReg.test(sortParametar);

			if (sortParametarOk && ascDescOk) {
				
				let imenaParametara = ["naziv", "aktivnost", "dan", "pocetak", "kraj"];
				let imenaPoljaUKlasi = ["naziv", "aktivnost", "dan", "start", "end"];
				let i = imenaParametara.indexOf(sortParametar);
				let imePolja = imenaPoljaUKlasi[i];
				
				aktivnosti.sort((a, b) => sortirajAscDesc === "a" ? a[imePolja].localeCompare(b[imePolja]) : b[imePolja].localeCompare(a[imePolja]))
			}
		}

		if (dan) {
			
			aktivnosti = aktivnosti.filter(aktivnost => aktivnost.dan.toLowerCase() === dan.toLowerCase());
		}
		
		if (req.headers.accept === "text/csv") {
			
			let tekst = "";
			
			for (let i = 0; i < aktivnosti.length; i++) {
				let a = aktivnosti[i];
				let novaLinija = `${a.naziv},${a.aktivnost},${a.dan},${a.start},${a.end}\n`;
			
				tekst += novaLinija;
			}
			
			res.send(tekst.trim());

		} else {

			res.json(aktivnosti);

		}
	});
});

app.get('/predmet', dobaviPredmete, (req, res) => {
	return res.json(req.predmeti);
});

app.post('/predmet', dobaviPredmete, (req, res) => {
	const predmeti = req.predmeti;
	const noviPredmet = req.body.predmet;
	if (predmeti.includes(noviPredmet)) {
		return res.send('Predmet vec postoji')
	}
	// Dodavanje novog predmeta sa kodom 201
	predmeti.push(noviPredmet);
	fs.writeFile ('./predmeti.json', JSON.stringify(predmeti), (err) => {
		res.status(201).send("Novi predmet uspjesno dodan");
	})
})

app.delete('/predmet', dobaviPredmete, (req, res) => {
	const predmeti = req.predmeti;
	const predmet = req.body.predmet;
	const i = predmeti.indexOf(predmet);
	if (i != -1) {
		// Brisanje
		predmeti.splice(i, 1);
		fs.writeFile ('./predmeti.json', JSON.stringify(predmeti), (err) => {});
		return res.status(202).json(predmeti);
	}
	res.json(predmeti);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

// 

app.use("/v2/tip", require("./rute/tipRuta"));
app.use("/v2/predmet", require("./rute/predmetRuta"));
app.use("/v2/dan", require("./rute/danRuta"));
app.use("/v2/student", require("./rute/studentRuta"));
app.use("/v2/grupa", require("./rute/grupaRuta"));
app.use("/v2/aktivnost", require("./rute/aktivnostRuta"));



function dobaviPredmete (req, res, next) {
	fs.readFile('./predmeti.json', 'utf8', (err, data) => {
		if (err) {
			req.predmeti = [];
			return next();

		}
		const predmeti = JSON.parse(data.toString());
		req.predmeti = predmeti;
		next();
	})
}