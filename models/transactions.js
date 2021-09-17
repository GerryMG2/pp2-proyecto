var Document = require('camo').Document;

class transaction extends Document {
    constructor() {
        super();
        this.data = Object;
        this.script = String;
        this.connection = String;
        this.terminated = Boolean;
    }

    static collectionName() {
        return 'transactions';
    }
}

module.exports = transaction;