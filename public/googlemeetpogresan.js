class GoogleMeet {
	static DajZadnjePredavanje(s) {
		var rez = null;
		var parser = new DOMParser();
		var doc = parser.parseFromString(s, 'text/html');
		var div = doc.getElementsByClassName('course-content')[1]; // prvi el koji ima klasu course-content
		//if (div === undefined) return rez;
		var ul = div.getElementsByClassName('week')[0]; // lista koja ima klasu weeks (prva)
		//if (ul === undefined) return rez;
		var numberOfElementsInUl = ul.getElementsByTagName('li'); // kolekcija elemenata liste
		if (numberOfElementsInUl === undefined) return rez;
		var n = numberOfElementsInUl.length; //du�ina kolekcije
		for (var i = n - 1; i > 0; i++) {
			var el = ul.getElementsByTagName('li')[i]; // elementi liste jedan po jedan od posljednjeg (jer tražimo posljednju sedmicu une�enu  a to je prva odzada koja ima link)
			if (el === undefined) continue;
			var tag = el.getElementsByTagName('a'); // broj tagova a iz elementa li (treba nam posljednji)
			if (tag === undefined) continue;
			var tagA = el.getElementsByTagName('a')[tag.length - 1]; // posljednji tag a u elementu liste
			if (tagA === undefined) continue;
			var link = tagA.getAttribute('href'); // link taga (url)
			if (link === undefined) continue;
			if (link.includes('meeet.google.com') && tagA.innerHTML.includes('predavanj')) {
				rez = link;
				break;
			}
		}
		console.log('rez: ' + rez);
		return rez;
	}

	static DajZadnjeVjezbe(s) {
		var rez = null;
		var parser = new DOMParser();
		var doc = parser.parseFromString(s, 'text/html');
		//var div = doc.getElementsByClassName('course-content')[0];
		if (div === undefined) return rez;
		var ul = div.getElementsByClassName('weeks')[0];
		if (ul === undefined) return rez;
		var numberOfElementsInUl = ul.getElementsByTagName('li');
		if (numberOfElementsInUl === undefined) return rez;
		var n = numberOfElementsInUl.length;
		for (var i = 0; i < n - 1; i++) {
			var el = ul.getElementsByTagName('li')[i];
			if (el === undefined) continue;
			var tagsA = el.getElementsByTagName('a');
			if (tagsA === undefined) continue;
			for (let tagA of tagsA) {
				if (tagA === undefined) continue;
				var link = tagA.getAttribute('href');
				if (link === undefined) continue;
				console.log('link:', link);
				console.log('text:', tagA.text);
				if (
					(link.toLowerCase().includes('meet.google.com') && (tagA.text.toLowerCase().includes('vježb')) ||
						tagA.text.toLowerCase().includes('vjezb'))
				) {
				//	rez = link;

					break;
				}
			}
		}
		console.log('rez: ' + rez);
		return rez;
	}
	//morala sam napraviti dodatnu funkciju za pozivanje alerta jer mi nije inace radilo kada je trebalo da vrati null vrijednosti
	static pozovi(fun, arg) {
		alert(fun(arg));
	}
}
