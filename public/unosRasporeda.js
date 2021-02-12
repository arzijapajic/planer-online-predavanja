(function () {

    const APIservice = (function () {
        function postAktivnost (aktivnost) {
            return new Promise((resolve, reject) => {
                const ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function () {
                    if (ajax.readyState == 4 && ajax.status == 201) {
                        resolve(ajax.responseText);
                    }
                    else if (ajax.readyState == 4) {
                        reject(ajax.responseText);
                    }
                }
                ajax.open("POST", "http://localhost:8080/raspored", true);
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send(JSON.stringify(aktivnost));
            });
        }

        function getAktivnosti () {
            return new Promise((resolve, reject) => {
                const ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function () {
                    if (ajax.readyState == 4 && ajax.status == 200) {
                        resolve(ajax.responseText);
                    }
                    else if (ajax.readyState == 4) {
                        reject(ajax.responseText);
                    }
                }
                ajax.open("GET", "http://localhost:8080/raspored", true);
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send();
            });
        }


        function postPredmet (predmet) {
            return new Promise((resolve, reject) => {
                const ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function () {
                    if (ajax.readyState == 4 && (ajax.status == 201 || ajax.status == 200)) {
                        resolve(ajax.status);
                    }
                    else if (ajax.readyState == 4) {
                        reject(ajax.responseText);
                    }
                }
                ajax.open("POST", "http://localhost:8080/predmet", true);
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send(JSON.stringify({ predmet }));
            });
        }

        function getPredmeti () {
            return new Promise((resolve, reject) => {
                const ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function () {
                    if (ajax.readyState == 4 && ajax.status == 200) {
                        resolve(ajax.responseText);
                    }
                    else if (ajax.readyState == 4) {
                        reject(ajax.responseText);
                    }
                }
                ajax.open("GET", "http://localhost:8080/predmet", true);
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send();
            });
        }

        function deletePredmet (predmet) {
            return new Promise((resolve, reject) => {
                const ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function () {
                    if (ajax.readyState == 4 && (ajax.status == 200 || ajax.status == 202)) {
                        resolve(ajax.responseText);
                    }
                    else if (ajax.readyState == 4) {
                        reject(ajax.responseText);
                    }
                }
                ajax.open("DELETE", "http://localhost:8080/predmet", true);
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send(JSON.stringify({ predmet }));
            });
        }
        return { postAktivnost, getAktivnosti, postPredmet, getPredmeti, deletePredmet };
    })();

    function updateUl (ul, dataNiz) {
        ul.innerHTML = "";
        dataNiz
            .map(item => {
                if (typeof item == "object") {
                    return Object.values(item).join(",")
                }
                return item;
            })
            .map(tekst => {

                const li = document.createElement("li");
                li.appendChild(document.createTextNode(tekst))
                return li;
            })
            .forEach(li => ul.appendChild(li));
    }

    async function dobaviPodatkeIUpdate (ulAktivnosti, ulPredmeti) {
        if (ulAktivnosti) {
            let aktivnosti;
            try {
                const aktivnostiData = await APIservice.getAktivnosti();
                aktivnosti = JSON.parse(aktivnostiData);

            } catch (err) {
                console.log(err);
                aktivnost = [];
            }
            updateUl(ulAktivnosti, aktivnosti);
        }

        if (ulPredmeti) {
            let predmeti;
            try {
                const predmetiData = await APIservice.getPredmeti();
                predmeti = JSON.parse(predmetiData);

            } catch (err) {
                console.log(err);
                predmeti = [];
            }
            updateUl(ulPredmeti, predmeti);
        }
    }

    const ulAktivnostiElem = document.getElementById("aktivnosti");
    const ulPredmetiElem = document.getElementById("predmeti");
    const porukaElem = document.getElementById("poruka");

    const forma = document.forms.item(0);
    forma.addEventListener("submit", async function (e) {
        e.preventDefault();
        const naziv = forma.naziv.value;
        const aktivnost = forma.aktivnost.value;
        const dan = forma.dan.value;
        const pocetak = forma.pocetak.value;
        const kraj = forma.kraj.value;
        const novaAktivnost = { naziv, aktivnost, dan, pocetak, kraj };

        let statusCodePredmeta, poruka;
        try {
            statusCodePredmeta = await APIservice.postPredmet(naziv);
            poruka = await APIservice.postAktivnost(novaAktivnost);
            
            porukaElem.textContent = poruka;
            porukaElem.style.color = "#16F919";
            
            if (statusCodePredmeta == "201") {
                dobaviPodatkeIUpdate(ulAktivnostiElem, ulPredmetiElem);
            } else {
                dobaviPodatkeIUpdate(ulAktivnostiElem, null)
            }

        } catch (err) {
            poruka = err;
            porukaElem.textContent = poruka;
            porukaElem.style.color = "#F82E28";

            if (statusCodePredmeta == "201") {
                APIservice.deletePredmet(naziv);
            }
        }
    });

    dobaviPodatkeIUpdate(ulAktivnostiElem, ulPredmetiElem);
})();