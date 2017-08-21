'use strict';

module.exports = dbUsingController;

function dbUsingController({knex, _}) {

    // Demo methods that use the QueryBuilder in different ways

    return {
        simpleSelectOneRow,
        simpleSelectMultiRows,
        simpleStoredProcedure,
        multipleQueries,
        utilityUsesStubFixture
    };

    function simpleSelectOneRow(req, res) {
        knex.table('faketable')
            .first()
            .then((row) => {
                console.log(row);
                return res.sendStatus(201);
            });
    }

    function simpleSelectMultiRows(req, res) {
        knex.table('faketable')
            .select()
            .then((rows) => {
                console.log(rows);
                return res.sendStatus(202);
            });
    }

    function simpleStoredProcedure(req, res) {
        knex.raw('BEGIN MY.STORED.PROCEDURE(?, ?, ?); END;')
            .then((result) => {
                    return res.sendStatus(203);
                }
            );
    }

    function multipleQueries(req, res) {
        const resultArray = [];
        knex.from('faketable')
            .select('fakecolumn')
            .then((row) => {
                resultArray.push(row);
                return knex.update('a', 'b');
            })
            .then((row) => {
                resultArray.push(row);
                return knex.insert('a', 'b');
            })
            .then((row) => {
                resultArray.push(row);
                console.log(resultArray);
                return res.sendStatus(204);
            });
    }

    function utilityUsesStubFixture(inputString) {
        return _.toLower(inputString);
    }
}

