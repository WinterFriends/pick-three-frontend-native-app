class UserProfile {
    constructor(name, birth, email, social) {
        this._name = name ? name : "";
        this._birth = birth ? birth : "";
        this._email = email ? email : "";
        this._social = social ? social : "";
    }

    getName() {
        return this._name;
    }

    setName(name) {
        this._name = name ? name : "";
    }

    getBirth() {
        return this._birth;
    }

    setBirth(birth) {
        this._birth = birth ? birth : "";
    }

    getEmail() {
        return this._email;
    }

    setEmail(email) {
        this._email = email ? email : "";
    }

    getSocial() {
        return this._social;
    }

    setSocial(social) {
        this._social = social ? social : "";
    }

    clone() {
        return new UserProfile(this._name, this._birth, this._email, this._social);
    }

    toJson() {
        let json = {
            name: this._name,
            birth: this._birth,
            email: this._email,
            social: this._social
        };

        return json;
    }

    static fromJson(json) {
        return new UserProfile(json.name, json.birth, json.email, json.social);
    }
}

export default UserProfile;