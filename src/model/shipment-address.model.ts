import { mapEntity } from "../utils/mapper";
import { shipment_addresses } from "@prisma/client";

export type CreateShipmentAddressDTO = {
    name: string;
    phone_number: string;
    address: string;
    city: string;
    postal_code?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    district_id: string;
}

export type UpdateShipmentAddressDTO = {
    name?: string;
    phone_number?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    is_default?: number;
    district_id: string;
}

export type ResGetShipmentAddressesDTO = {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        search: string;
    };
    shipmentAddresses: shipment_addresses;
}


export function toShipmentAddresses(shipmentAddress: shipment_addresses []){
    return shipmentAddress.map((item) => mapEntity(item, ["created_at", "updated_at", "is_deleted","user_id"]));
}

export function toShipmentAddress(shipmentAddress: shipment_addresses){
    return mapEntity(shipmentAddress, ["created_at", "updated_at", "is_deleted","user_id"]);
}