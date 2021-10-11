var Document = require('camo').Document;

class dbs extends Document {
    constructor() {
        super();
        this.database_name = String
        this.host = String;
        this.port = String, 
        this.username = String, 
        this.password = String,
        this.name = String
    }

    static collectionName() {
        return 'dbs';
    }
}

module.exports = dbs;