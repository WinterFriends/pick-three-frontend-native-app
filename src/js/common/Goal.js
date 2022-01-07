class Goal {
    /**
     * @param {number} id 
     * @param {string} name 
     * @param {string} description 
     * @param {string} activeIcon 
     * @param {string} inactiveIcon 
     * @param {string} mainColor 
     * @param {string} subColor
     */
    constructor(id, name, description, activeIcon, inactiveIcon, mainColor, subColor) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._activeIcon = activeIcon;
        this._inactiveIcon = inactiveIcon;
        this._mainColor = mainColor;
        this._subColor = subColor;
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
        return this.getActiveIcon();
    }

    getActiveIcon() {
        return this._activeIcon;
    }

    getInactiveIcon() {
        return this._inactiveIcon;
    }

    getMainColor() {
        return this._mainColor;
    }

    getSubColor() {
        return this._subColor;
    }

    toJson() {
        let json = {
            id: this.getId(),
            name: this.getName(),
            description: this.getDescription(),
            activeIcon: this.getActiveIcon(),
            inactiveIcon: this.getInactiveIcon(),
            mainColor: this.getMainColor(),
            subColor: this.getSubColor()
        };

        return json;
    }

    static fromJson(json) {
        let goal = new Goal(
            json.id, json.name,
            json.description,
            json.activeIcon, json.inactiveIcon,
            json.mainColor, json.subColor
        );
        return goal;
    }

    clone() {
        let clone = new Goal(
            this.getId(), this.getName(),
            this.getDescription(),
            this.getActiveIcon(), this.getInactiveIcon(),
            this.getMainColor(), this.getSubColor()
        );
        return clone;
    }
}

export default Goal;