/**
 * Created by Sulav on 7/19/17.
 */

module.exports = class User {
    constructor(user) {
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.picture = user.picture;
        this.jobs_posted = user.jobs_posted;
        this.jobs_applied = user.jobs_applied;
    }
};