var Schema = {
    users: {
        id: {type: 'increments', nullable: false, primary: true},
        first_name: {type: 'string', maxlength: 150, nullable: false},
        last_name: {type: 'string', maxlength: 150, nullable: false},
        email: {type: 'string', maxlength: 254, nullable: false, unique: true},
        password: {type: 'string', maxlength: 250, nullable: false},
        code: {type: 'string', maxlength: 250, nullable: false},
        verified: {type: 'boolean', nullable: false, defaultTo: false},
        created_at: {type: 'dateTime', nullable: false},
        updated_at: {type: 'dateTime', nullable: true}
    },

    todos: {
        id: {type: 'increments', nullable: false, primary: true},
        // TODO: add user support
        //user_id: {type: 'integer', nullable: false, unsigned: true, references: 'users.id' },
        text: {type: 'string', maxlength: 150, nullable: false},
        complete: {type: 'boolean', nullable: false, defaultTo: false},
        created_at: {type: 'dateTime', nullable: false},
        updated_at: {type: 'dateTime', nullable: true}
    }
};

module.exports = Schema;