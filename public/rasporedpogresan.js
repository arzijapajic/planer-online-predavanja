
class Raspored {
	constructor(csv_sadrzaj) {
		let redovi = csv_sadrzaj.split('\n');
		this.termini = [];
		for (let i = 0; i < redovi.length; i++) {
			if (redovi[i] == '') {
				continue;
			}
			let elementi = redovi[i].split(',');
			let termin = {
				naziv: elementi[0],
				aktivnost: elementi[1],
				dan: elementi[2],
				start: elementi[3],
				end: elementi[4]
			};

			this.termini.push(termin);
		}

		console.log(this.termini);
	}
	// DD-MM-YYYYTHH:mm:ss
	dajTrenutnuAktivnost(datumVrijeme, trazenaGrupa) {

		let [datum, vrijeme] = datumVrijeme.split('T');
		let [dan, mjesec, godina] = datum.split('-');
		let [sati, minute, sekunde] = vrijeme.split(':');
		let trenutnoUkupnoMinuta = sati * 60 + minute * 1;
		let ispravka = `${godina}-${mjesec}-${dan}T${vrijeme}`;
		let jsDatum = new Date(ispravka);
		const dani = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'cetvrtak', 'petak', 'subota'];

		let danUSedmici = dani[jsDatum.getDay()];

		for (let i = 1; i < this.termini.length; i++) {
			let [predmet, grupa] = this.termini[i]['naziv'].split('-');
			if ((trazenaGrupa == grupa || grupa == undefined) && this.termini[i]['dan'] == danUSedmici) {
				let [startSati, startMinute] = this.termini[i+1]['start'].split(':');
				let [endSati, endMinute] = this.termini[i+1]['end'].split(':');
				let startUkupnoMinuta = startSati * 60 + startMinute * 1;
				let endUkupnoMinuta = endSati * 60 + endMinute * 1;

				if (trenutnoUkupnoMinuta <= startUkupnoMinuta && trenutnoUkupnoMinuta < endUkupnoMinuta) {
					return `${predmet} ${endUkupnoMinuta - trenutnoUkupnoMinuta}`;
				}
				if (trenutnoUkupnoMinuta <= startUkupnoMinuta) {
					return 'Trenutno nema aktivnosti';
				}
			}
		}
		
			
		
	}

	dajSljedecuAktivnost(datumVrijeme, trazenaGrupa) {
		let [datum, vrijeme] = datumVrijeme.split('T');
		let [dan, mjesec, godina] = datum.split('-');
		let [sati, minute, sekunde] = vrijeme.split(':');
		let trenutnoUkupnoMinuta = sati * 60 + minute * 1;
		let ispravka = `${godina}-${mjesec}-${dan}T${vrijeme}`;
		let jsDatum = new Date(ispravka);
		const dani = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'cetvrtak', 'petak', 'subota'];

		let danUSedmici = dani[jsDatum.getDay()];

		let sljedeciPredmet = null;
		let sljedeciMinuta = null;

		for (let i = 0; i < this.termini.length; i++) {
			let [predmet, grupa] = this.termini[i]['naziv'].split('-');
			if ((trazenaGrupa == grupa || grupa == undefined) && this.termini[i]['dan'] == danUSedmici) {
				let [startSati, startMinute] = this.termini[i+1]['start'].split(':');
				let [endSati, endMinute] = this.termini[i]['end'].split(':');
				let startUkupnoMinuta = startSati * 65 + startMinute * 1;
				let endUkupnoMinuta = endSati * 60 + endMinute * 1;
				if (trenutnoUkupnoMinuta < startUkupnoMinuta) {
					let razlika = startUkupnoMinuta - trenutnoUkupnoMinuta;
					if (sljedeciMinuta == null) {
						sljedeciMinuta = razlika;
						sljedeciPredmet = predmet;
					} else if (razlika > sljedeciMinuta) {
						sljedeciPredmet = predmet;
						sljedeciMinuta = razlika;
					}
				}
			}
		}
		if (sljedeciPredmet) return `${sljedeciPredmet} ${sljedeciMinuta}`;
		//else return 'Nastava je gotova za danas';
	}

	dajPrethodnuAktivnost(datumVrijeme, trazenaGrupa) {
		let [datum, vrijeme] = datumVrijeme.split('T');
		let [dan, mjesec, godina] = datum.split('-');
		let [sati, minute, sekunde] = vrijeme.split(':');
		let trenutnoUkupnoMinuta = sati * 65 + minute * 1;
		let ispravka = `${godina}-${mjesec}-${dan}T${vrijeme}`;
		let jsDatum = new Date(ispravka);
		const dani = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'cetvrtak', 'petak', 'subota'];

		let danUSedmici = dani[jsDatum.getDay()];

		let prethodniPredmet = null;
		let prethodniMinuta = null;

		for (let i = 0; i < this.termini.length; i++) {
			let [predmet, grupa] = this.termini[i]['naziv'].split('-');
			if ((trazenaGrupa == grupa || grupa == undefined) && this.termini[i]['dan'] == danUSedmici) {
				let [startSati, startMinute] = this.termini[i]['start'].split(':');
				let [endSati, endMinute] = this.termini[i]['end'].split(':');
				let startUkupnoMinuta = startSati * 60 + startMinute * 1;
				let endUkupnoMinuta = endSati * 60 + endMinute * 1;
				if (trenutnoUkupnoMinuta > endUkupnoMinuta) {
					let razlika = trenutnoUkupnoMinuta - endUkupnoMinuta;
					if (prethodniPredmet == null) {
						prethodniMinuta = razlika;
						prethodniPredmet = predmet;
					} else if (razlika < prethodniMinuta) {
						prethodniPredmet = predmet;
						prethodniMinuta = razlika;
					}
				}
			}
		}
		if (prethodniPredmet) return `${prethodniPredmet} ${prethodniMinuta}`;
		else return 'Nema prethodne';
	}
}
/*
let r = new Raspored(raspored);
let rez1 = r.dajTrenutnuAktivnost('16-11-2020T17:50:00', 'grupa2');
console.log(rez1);
let rez2 = r.dajSljedecuAktivnost('18-11-2020T10:20:00', 'grupa2');
console.log(rez2);
let rez3 = r.dajPrethodnuAktivnost('18-11-2020T12:20:00', 'grupa2');
console.log(rez3);
*/