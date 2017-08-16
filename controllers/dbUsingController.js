'use strict';

const dbUsingController = (deps) => {

    // Demo methods that use the QueryBuilder in different ways

    return {
        simpleSelectOneRow,
        simpleSelectMultiRows,
        simpleStoredProcedure,
        multipleQueries,
        utilityUsesStubFixture
    };

    function simpleSelectOneRow(req, res) {
        deps.db.table('faketable')
            .first()
            .then((row) => {
                console.log(row);
                return res.sendStatus(201);
            });
    }

    function simpleSelectMultiRows(req, res) {
        deps.db.table('faketable')
            .select()
            .then((rows) => {
                console.log(rows);
                return res.sendStatus(202);
            });
    }

    function simpleStoredProcedure(req, res) {
        deps.db.raw('BEGIN MY.STORED.PROCEDURE(?, ?, ?); END;')
            .then((result) => {
                    return res.sendStatus(203);
                }
            );
    }

    function multipleQueries(req, res) {
        const resultArray = [];
        deps.db.from('faketable')
            .select('fakecolumn')
            .then((row) => {
                resultArray.push(row);
                return deps.db.update('a', 'b');
            })
            .then((row) => {
                resultArray.push(row);
                return deps.db.insert('a', 'b');
            })
            .then((row) => {
                resultArray.push(row);
                console.log(resultArray);
                return res.sendStatus(204);
            });
    }

    function utilityUsesStubFixture(inputString) {
        return deps.lodash.toLower(inputString);
    }
};

module.exports = dbUsingController;
