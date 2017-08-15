'use strict';

const dbUsingController = (deps) => {

    // Demo methods that use the QueryBuilder in different ways

    return {
        simpleSelectOneRow,
        simpleSelectMultiRows,
        simpleStoredProcedure
    };

    function simpleSelectOneRow(req, res) {
        deps.db.table('faketable')
            .first()
            .then((row) => {
                console.log(row);
                return res.sendStatus(101);
            });
    }

    function simpleSelectMultiRows(req, res) {
        deps.db.table('faketable')
            .select()
            .then((rows) => {
                console.log(rows);
                return res.sendStatus(102);
            });
    }

    function simpleStoredProcedure(req, res) {
        deps.db.raw('BEGIN MY.STORED.PROCEDURE(?, ?, ?); END;')
            .then((result) => {
                    res.sendStatus(103);
                }
            );
    }
};

module.exports = dbUsingController;
