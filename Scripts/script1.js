
const pgPromise = require("pg-promise")



/**
 * 
 * @param {*} data 
 * @param {pgPromise.IDatabase<{}, pg.IClient>} db 
 */
function init(data, db, cb) {
    console.log("executing");
    console.log(db);
    if (data.client_id != null && data.client_id != undefined) {
        
        db.tx(async t => {
            const re = await db.result("update dim_cliente set nombre = $1 where sk_cliente = $2", [data.name, data.client_id]);
            console.log(re.rowCount);
            if (re.rowCount != 1) {
                throw `${re.rowCount} rows were updated`;
            }

            

        }).then((d) => {
            console.log(d);
            cb(true, "Datos actualizados");
        }).catch((err) => {
            console.log(err);
            cb(false, err);
        });


    } else {
        cb(false, "datos nulos en el client_id");
    }

}




module.exports = init;


// blitz.init(init);