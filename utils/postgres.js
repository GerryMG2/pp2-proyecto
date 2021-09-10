
class postgressDB {

    constructor(URI){
        
        this.pgp = require("pg-promise")(/*options*/);
        //validaciones de types
        this.pgp.pg.types.setTypeParser(this.pgp.pg.types.builtins.INT8,function(val){
            return parseInt(val);
        });

        // this.pgp.pg.types.setTypeParser(this.pgp.pg.types.builtins.MONEY,function(val){
        //     return parseFloat(val);
        // });

        

        this.pgp.pg.defaults.ssl = true;
        this.db = null;
        this.URI = URI;
    }

    getdb(){
        console.log("Utils -> Database connections -> relationals -> postgres created" );
        if(this.db != null){
            return this.db;
        }else{
            this.db = this.pgp(this.URI);
            return this.db;
        }
    }
}



module.exports = postgressDB;