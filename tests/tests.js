var expect = require('chai').expect;
var sinon = require('sinon');

var Position = require('fin-common').Models.Position;
var Classification = require('../lib/Classification');
var ClassificationStream = require('../lib/ClassificationStream');

var createPosition = function(purpose) {
    return new Position({
        id: 'fooId',
        mandant_id: 'fooMandant',
        purpose: purpose,
        classification: null,
        partner: 'fooPartner',
        partnerAccountNumber: 'fooPartnerAcountNr',
        partnerBank: 'fooBank',
        amount: 1,
        date: '2014-01-01'
    });
};

describe('classi', function() {
    describe('classificationStream', function() {
        var data = {
            tanken: ['aral', 'shell', 'avia'],
            onlineshopping: ['amazon']
        };
        var c = new Classification(data);

        it('should classify correctly', function() {
            expect(c.classify('AVIA GIEL / BRAUN EC 51s683681f6812')).to.equal('tanken');
        });

        it('should return null', function() {
            expect(c.classify('foo bar bart bert')).to.be.null;
        });
    });

    describe('classificationStream', function() {
        it('should throw', function() {
            expect(function() {
                new ClassificationStream();
            }).to.throw();

        });

        it('should add a classification if a match is found', function(done) {
            var log = [];

            var classification = {
                classify: sinon.spy(function() {
                    return 'foo';
                })
            };

            var cStream = new ClassificationStream(classification);

            cStream.write(createPosition('fooPurpose'));
            cStream.write(createPosition('barPurpose'));

            cStream.end();

            cStream.on('data', function(position) {
                log.push(position.classification());
            });

            cStream.on('end', function() {
                expect(log).to.deep.equal(['foo', 'foo']);
                expect(classification.classify.args).to.deep.equal([
                    ['fooPurpose'],
                    ['barPurpose']
                ]);

                done();
            });
        });

        it('should add nothing if no match is found', function(done) {
            var log = [];

            var classification = {
                classify: sinon.spy(function() {
                    return null;
                })
            };

            var cStream = new ClassificationStream(classification);

            cStream.write(createPosition('fooPurpose'));
            cStream.write(createPosition('barPurpose'));

            cStream.end();

            cStream.on('data', function(position) {
                log.push(position.classification());
            });

            cStream.on('end', function() {
                expect(log).to.deep.equal([null, null]);
                expect(classification.classify.args).to.deep.equal([
                    ['fooPurpose'],
                    ['barPurpose']
                ]);

                done();
            });
        });

    });
});