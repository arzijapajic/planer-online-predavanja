(function () {

    ucitajSortirano(null, "Anaziv", popuniTabelu);
    let prethodniIndeks = 0;
    const ascDescNiz = ["A", "", "", "", ""];
    const spanovi = document.querySelectorAll("span");

    // Dodavanje listenera na svaku celiju zaglavlja tabele
    document.querySelectorAll("th").forEach(th => th.addEventListener("click", function () {
        const trenutniIndeks = parseInt(this.getAttribute("indeks"));

        if (trenutniIndeks === prethodniIndeks) {
            ascDescNiz[trenutniIndeks] = ascDescNiz[trenutniIndeks] === "A" ? "D" : "A";
        } else {
            ascDescNiz[prethodniIndeks] = "";
            ascDescNiz[trenutniIndeks] = "A";
        }

        // Sinhronizacija UI - a sa varijablama
        spanovi.item(prethodniIndeks).textContent = "";
        spanovi.item(trenutniIndeks).textContent = ascDescNiz[trenutniIndeks] === "A" ? "↓" : "↑";

        const polja = ["naziv", "aktivnost", "dan", "pocetak", "kraj"];
        const atribut = ascDescNiz[trenutniIndeks] + polja[trenutniIndeks];
        ucitajSortirano(null, atribut, popuniTabelu);

        prethodniIndeks = trenutniIndeks;
    }));



    function popuniTabelu (data, error) {
        // Data predstavlja niz aktivnosti
        if (error) {
            console.log(error);
            return;
        }
        // Kreiramo novo tijelo tabele dodajemo nove redove u njega i mijenjamo ga sa starim tijelom tabele
        const tBody = document.createElement("tbody");

        data
            .map(aktivnost => {
                const tr = document.createElement("tr");
                Object.values(aktivnost)
                    .map(v => {
                        const td = document.createElement("td");
                        td.appendChild(document.createTextNode(v));
                        return td;
                    })
                    .forEach(td => tr.appendChild(td));
                return tr;
            })
            .forEach(tr => tBody.appendChild(tr));

        // Zamjena starog tijela tabele sa novim    
        const tabela = document.querySelector("table");
        tabela.removeChild(tabela.children.item(1));
        tabela.appendChild(tBody);
    };
})()