var Document = require('camo').Document;

class error extends Document {
    constructor() {
        super();
        this.script = String;
        this.log = String;
        this.data = Object;
        this.idTransaction = String;
        this.date = {
            type: Date,
            default: Date.now
        }
    }

    static collectionName() {
        return 'errors';
    }
}

module.exports = error;