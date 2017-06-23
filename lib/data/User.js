module.exports = class User {
	constructor(firstName, lastName, verein, manschaft) {
		this.firstName = firstName != null ? firstName : "";
		this.lastName = lastName != null ? lastName : "";
		this.verein = verein != null ? verein : "";
		this.manschaft = manschaft != null ? manschaft : "";
	}

	static Gast() {
		return new User("Gast");
	}
};
