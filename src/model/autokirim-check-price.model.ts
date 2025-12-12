import { CheckPriceResponse } from "../utils/autokirim/price";
import { calculateCodAndInsurance } from "../utils/calculate-cod-and-insurance";
import { Decimal } from "@prisma/client/runtime/library.js";

export type CheckPriceDTO = {
    origin_id: number;
    destination_id: number;
    weight: string | number;
    length: number;
    width: number;
    height: number;
    pickup_point_code: string;
    is_sender_pp: number;
    method: number // 0: non cod, 1: cod
    item_price: number;
}

type ServiceDetailBase =
    NonNullable<CheckPriceResponse["data"]>[number]["service_detail"][number];

export type ServiceDetailMapped = ServiceDetailBase & {
    courier_name: string;
    courier_code: string;
    minimal_fee_cod: number;
    image : string;
    insurance_value: Decimal;
    cod_fee_without_insurance: Decimal;
    cod_fee_with_insurance: Decimal;
};

export type CourierPriceMapped = {
    courier_name: string;
    courier_code: string;
    service_group: Record<string, ServiceDetailMapped[]>;
};

export type SpecialExpedition = {
    courier_code: string;
    name: string;
    minimal_fee: number;
    description: string;
};

export type ToPriceResultParams = {
    data: NonNullable<CheckPriceResponse["data"]>;
    method: number; // 0: non cod, 1: cod jika 0 tampilkan semua jika 1 hanya tampilkan yang value fee_cod > 0
    specialExpedition: SpecialExpedition[];
    itemPrice: number;
};


export const toPriceResult = ({
    data,
    method,
    specialExpedition,
    itemPrice
}: ToPriceResultParams) => {

    const grouped: Record<string, ServiceDetailMapped[]> = {};

    data.forEach((courier) => {

        const minimalFeeRecord = specialExpedition.find(
            (x) => x.courier_code.toLowerCase() === courier.courier_code.toLowerCase()
        );

        const minimalFee = minimalFeeRecord?.minimal_fee ?? 0;

        courier.service_detail.forEach((svc) => {

            // Filter jika method = 1 (COD only)
            if (method === 1 && svc.fee_cod <= 0) return;

            // Hitung insurance & cod fee (+ minimal fee)
            const {
                insurance_value,
                cod_fee_without_insurance,
                cod_fee_with_insurance
            } = calculateCodAndInsurance(
                courier.courier_code,
                svc.fee_cod,
                svc.price,
                itemPrice,
                svc.insurance,
                minimalFee
            );

            const mapped: ServiceDetailMapped = {
                ...svc,
                insurance_value,
                cod_fee_without_insurance,
                cod_fee_with_insurance,
                minimal_fee_cod: minimalFee,
                courier_name: courier.courier_name,
                courier_code: courier.courier_code,
                image: courier.courier_code + ".png"
            };

            if (!grouped[svc.service_group]) {
                grouped[svc.service_group] = [];
            }

            grouped[svc.service_group].push(mapped);

            // === FIX: jaga urutan stabil dalam setiap group ===
            grouped[svc.service_group].sort((a, b) => a.price - b.price);
        });
    });

    // Priority urutan service group
    const priority = {
        "Reguler": 1,
        "Cargo": 2,
        "One Day": 3
    } as Record<string, number>;

    return Object.keys(grouped)
        .sort((a, b) => (priority[a] ?? 99) - (priority[b] ?? 99))
        .map((group) => ({
            label: group,
            expedition: grouped[group]
        }));
};








