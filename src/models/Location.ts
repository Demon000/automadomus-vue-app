export interface LocationPoint {
    lat: number;
    lng: number;
}

export default interface Location extends LocationPoint {
    address: string;
}
