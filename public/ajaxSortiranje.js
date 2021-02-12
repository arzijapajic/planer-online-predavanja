function ucitajSortirano (dan, atribut, callback) {
    const parametri = new URLSearchParams({})
    dan && parametri.set("dan", dan);
    atribut && parametri.set("sort", atribut);
    const queryString = parametri.toString();

    const url = `http://localhost:8080/raspored${queryString ? "?" + queryString : ""}`;

    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200) {
            callback(JSON.parse(ajax.responseText), null);
        }
        else if (ajax.readyState == 4) {
            callback(null, JSON.parse(ajax.responseText).greska);
        }
    }

    ajax.open("GET", url, true);
    ajax.send();
}

