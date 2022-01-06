
const pgPromise = require("pg-promise")



/**
 * 
 * @param {*} data 
 * @param {pgPromise.IDatabase<{}, pg.IClient>} db 
 * @param {function(boolean,string)} cb
 */
async function init(data, db, cb) {
    console.log(db);

    try {
        console.log("primer paso");
        
        const re1 = await db.result("INSERT INTO DIM_DIRECTORIO(SK_DIRECTORIO, BD_DIRECTORIO) VALUES($1, $2) ON CONFLICT ON CONSTRAINT dim_directorio_pkey DO UPDATE SET BD_DIRECTORIO = $2 WHERE DIM_DIRECTORIO.SK_DIRECTORIO = $1",
            [data.origid, data.origname]);
        console.log("segundo paso");
        const re2 = await db.result("INSERT INTO DIM_DIRECTORIO(SK_DIRECTORIO, BD_DIRECTORIO) VALUES($1, $2) ON CONFLICT ON CONSTRAINT dim_directorio_pkey DO UPDATE SET BD_DIRECTORIO = $2 WHERE DIM_DIRECTORIO.SK_DIRECTORIO = $1",
            [data.destid, data.destname]);

        console.log("tercer paso");

        const re4 = await db.none("INSERT INTO dim_depart(bd_depart) VALUES ($1) ON CONFLICT ON CONSTRAINT unico_depart DO NOTHING",
            [data.origdep]);


        const re6 = await db.none("INSERT INTO dim_depart(bd_depart) VALUES ($1) ON CONFLICT ON CONSTRAINT unico_depart DO NOTHING",
            [data.destdep]);


        const re8 = await db.none("INSERT INTO dim_tipo(bd_tipo) VALUES ($1) ON CONFLICT ON CONSTRAINT unico_tipo DO NOTHING",
            [data.tipo]);




        dateObj = new Date(data.fecha);
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var sk_fecha = day + (month * 100) + (year * 10000);

        const tipo = await db.one("select sk_tipo from dim_tipo where bd_tipo = $1", [data.tipo]);
        const de_dep = await db.one("select sk_depart from dim_depart where bd_depart = $1", [data.destdep]);
        const or_dep = await db.one("select sk_depart from dim_depart where bd_depart = $1", [data.origdep]);
        const last = await db.none("INSERT INTO hch_llamadas(sk_orig, sk_dest, duracion, sk_fecha, sk_tipo, sk_depart_orig, sk_depart_dest) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT ON CONSTRAINT unico DO update set duracion = EXCLUDED.duracion + hch_llamadas.duracion where hch_llamadas.sk_orig = $1 and  hch_llamadas.sk_dest = $2 and hch_llamadas.sk_fecha = $4 and hch_llamadas.sk_tipo = $5 and hch_llamadas.sk_depart_orig = $6 and hch_llamadas.sk_depart_dest = $7"
            ,
            [data.origid, data.destid, data.duracion, sk_fecha, parseInt(tipo.sk_tipo), parseInt(or_dep.sk_depart), parseInt(de_dep.sk_depart)]);
        console.log(last);


        cb(true, "se termino");
    } catch (error) {
        console.log(error);
        cb(false, error);
    }





    //fin
}







module.exports = init;