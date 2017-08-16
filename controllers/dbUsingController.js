'use strict';

const dbUsingController = (deps) => {

    // Demo methods that use the QueryBuilder in different ways

    console.log(deps.lodash.toLower('REPLACE_ME_LOWER_CASE'));

    return {
        simpleSelectOneRow,
        simpleSelectMultiRows,
        simpleStoredProcedure,
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
                    res.sendStatus(203);
                }
            );
    }

    function utilityUsesStubFixture(inputString) {
        return deps.lodash.toLower(inputString);
    }
};

module.exports = dbUsingController;
