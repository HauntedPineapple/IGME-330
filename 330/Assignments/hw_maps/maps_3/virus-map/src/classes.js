export class Region {
    // Province/State, Country/Region, Latitude, Longitude, 1/22/20, ...
    constructor(row) {
        [this.provinceOrState, this.countryOrRegion, this.latitude, this.longitude, ...this.data] = row;
        this.data = this.data.map(el => Number(el));
        this.latitude = +this.latitude;
        this.longitude = +this.longitude;
    }
}