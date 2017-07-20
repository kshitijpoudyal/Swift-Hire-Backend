/**
 * Created by Sulav on 7/19/17.
 */

module.exports = class Job {
    constructor(job) {
        this._id = job._id;
        this.title = job.title;
        this.category = job.category;
        this.preferred_date = job.preferred_date;
        this.preferred_time = job.preferred_time;
        this.duration = job.duration;
        this.hourly_rate = job.hourly_rate;
        this.description = job.description;
        this.location = job.location;
        this.posted_by = job.posted_by;
        this.applied_by = job.applied_by;
        this.approved_user = job.approved_user;
        this.status = job.status;
        this.granted = job.granted;
    }
};