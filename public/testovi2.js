let assert = chai.assert;
describe('Raspored', function () {
    
    it('dajTrenutnuAktivnost kada nema trenutne aktivnosti u datom vremenu', function () {
        
        const rez = (new Raspored(raspored).dajTrenutnuAktivnost('17-11-2020T12:00:00', 'grupa2'));
        assert.equal(rez,'Trenutno nema aktivnosti');
    });
    it('dajTrenutnuAktivnost na početku neke aktivnosti', function () {

        const rez = (new Raspored(raspored).dajTrenutnuAktivnost('11-11-2020T11:00:00', 'grupa1'));
        assert.equal(rez, 'MUR1 90');
    });
    it('dajTrenutnuAktivnost na kraju neke aktivnosti', function () {

        const rez = (new Raspored(raspored).dajTrenutnuAktivnost('11-11-2020T12:30:00', 'grupa1'));
        assert.equal(rez, 'FWT 90');
    });
    it('dajTrenutnuAktivnost kada postoji vježba u datom vremenu i ispravna je grupa', function () {

        const rez = (new Raspored(raspored).dajTrenutnuAktivnost('11-11-2020T12:00:00', 'grupa1'));
        assert.equal(rez, 'MUR1 30');
    });
    it('dajPrethodnuAktivnost za slučaj kada je prva prethodna aktivnost vježba sa pogrešnom grupom, tada trebate vratiti aktivnost prije nje', function () {

        const rez = (new Raspored(raspored).dajPrethodnuAktivnost('16-11-2020T12:50:00', 'grupa1'));
        assert.equal(rez, 'RMA 50');
    });
    //nisam najbolje razumila sta se misli pod ekvivalentnim testom testova za metodu DajPrethodnuAktivnost
    //jer fja dajSljedecuAktivnost ukoliko nema nista dalje taj dan vraca rezultat Nastava je gotova za danas
    //tako da sam napisala test koji trazi aktivnost poslije zadnje aktivnosti odredjenog dana,a on vraca da je nastava gotova za danas

    it('dajSljedecuAktivnost poslije zadnje aktivnosti u ponedjeljak', function () {

        const rez = (new Raspored(raspored).dajSljedecuAktivnost('16-11-2020T17:50:00', 'grupa2'));
        assert.equal(rez, 'Nastava je gotova za danas');
    });
    it('dajSljedecuAktivnost za slučaj kada je prva naredna aktivnost vježba sa pogrešnom grupom, tada trebate vratiti aktivnost poslije nje', function () {

        const rez = (new Raspored(raspored).dajSljedecuAktivnost('16-11-2020T11:50:00', 'grupa2'));
        assert.equal(rez, 'BWT 100');
    });
    });