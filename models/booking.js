class Booking {
    constructor(data) {
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.note = data.note;
        this.container = data.container;
        this.user = data.user;
    }
}

export default Booking;
