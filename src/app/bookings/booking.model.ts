export class Booking{
    constructor(
        public id: string,
        public userId: string,
        public placeId: string,
        public placeName: string,
        public guestNumber: number
    ) {}
}