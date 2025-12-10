import { mapEntity } from "../utils/mapper";
import { shipments } from "@prisma/client";
export type CreateShipmentDTO = {
    pickup_point_id: number;
    shipment_address_id: number;
    service_code: string;
    origin_id: number;
    destination_id: number;
    weight: number;
    qty: number;
    length: number;
    width: number;
    height: number;
    description: string;
    remarks: string;
    is_cod: number;
    price: number;
    is_sender_pp: number;
    is_insurance: number;
    pickup_name: string;
    pickup_phone: string;
    pickup_address: string;
    pickup_city: string;
    pickup_postal_code: string;

    destination_name: string;
    destination_phone: string;
    destination_address: string;
    destination_city: string;
    destination_postal_code: string;

    pickup_point_code: string;
    
    fee_cod: number;
    fee_insurance: number;
    fee_total: number;
    fee_courier: number;
}


export function toShipment(shipment: shipments){
    const include = ["user_id","reff_client_id"];
    return mapEntity(shipment, include, "include");
}