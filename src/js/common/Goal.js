class Goal {
    /**
     * 
     * @param {number} id 
     * @param {string} name 
     * @param {string} description 
     * @param {string} icon 
     */
    constructor(id, name, description, icon) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._icon = icon;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getDescription() {
        return this._description;
    }

    getIcon() {
        return this._icon;
    }

    toJson() {
        let json = {
            id: this._id,
            name: this._name,
            description: this._description,
            icon: this._icon,
        };

        return json;
    }

    static fromJson(json) {
        let goal = new Goal(json.id, json.name, json.description, json.icon);
        return goal;
    }

    clone() {
        let clone = new Goal(this._id, this._name, this._description, this._icon);
        return clone;
    }
}

export default Goal;