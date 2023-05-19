class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.surname = data.surname;
        this.email = data.email;
        this.role = data.role;
    }

    static getModel(dbModel) {
        return dbModel ? new User({
                id: dbModel._id,
                name: dbModel.name,
                surname: dbModel.surname,
                email: dbModel.email,
                role: dbModel.role,
            }
        ) : null;
    }
}

module.exports = {
    User
}
