let assert = chai.assert;
describe('GoogleMeet', function() {
	    // u ovom testu kopirala sam u ulaz primjer[4] jer je svakako u njemu nema predavanja
		it('test kada nema niti jednog predavanja', function() {
            let ulaz = primjeri[4];
			const rez = GoogleMeet.DajZadnjePredavanje(ulaz);
			assert.equal(rez, null);
        });
        it('test kada nema niti jednih vjezbi', function () {
            let ulaz = primjeri[4];
            const rez = GoogleMeet.DajZadnjeVjezbe(ulaz);
            assert.equal(rez, null);
     

        });
    it('test kada je string prazan(vjezbe) ', function () {
        let ulaz = ' '
        const rez = GoogleMeet.DajZadnjeVjezbe(ulaz);
        assert.equal(rez, null);
     

    });
    it('test kada je string prazan(predavanja)', function () {
        let ulaz = ' '
        const rez = GoogleMeet.DajZadnjePredavanje(ulaz);
        assert.equal(rez, null);


    });
    it('test kada je link neispravan', function () {
        let ulaz = primjeri[6];
        const rez = GoogleMeet.DajZadnjePredavanje(ulaz);
        assert.equal(rez, null);


    });
    it('test kada nema predavanj u tekstu', function () {
        let ulaz = primjeri[7];
        const rez = GoogleMeet.DajZadnjePredavanje(ulaz);
        assert.equal(rez, null);


    });
    it('test neispravan course-content', function () {
        let ulaz = primjeri[8];
        const rez = GoogleMeet.DajZadnjePredavanje(ulaz);
        assert.equal(rez,);


    });
  
  
});

