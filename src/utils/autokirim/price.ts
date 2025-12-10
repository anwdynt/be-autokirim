import axios from "axios";
import { logger as winstonLogger } from "../../config/logger";

const URL_AUTOKIRIM = process.env.URL_AUTOKIRIM!;
const TOKEN = process.env.TOKEN_AUTOKIRIM!;

export type CheckPriceRequest = {
    origin_id: number;
    destination_id: number;
    weight: string | number;
    length: number;
    width: number;
    height: number;
    pickup_point_code: string;
    is_sender_pp: number;
};

export type CheckPriceResponse = {
    rc: string;
    rd: string;
    data?: {
        courier_name: string;
        courier_code: string;
        service_detail: {
            service: string;
            service_group: string;
            service_code: string;
            duration: string;
            etd: string;
            price: number;
            insurance: number;
            fee_cod: number;
            is_pickup: boolean;
        }[];
    }[];
};

export const fetchCheckPrice = async (
    payload: CheckPriceRequest
): Promise<NonNullable<CheckPriceResponse["data"]>> => {
    try {
        if (!URL_AUTOKIRIM) {
            throw new Error("Environment URL_AUTOKIRIM is not set");
        }
        if (!TOKEN) {
            throw new Error("Environment AUTOKIRIM_API_KEY is not set");
        }

        const url = `${URL_AUTOKIRIM}/v2/check-price`;

        const response = await axios.post<CheckPriceResponse>(url, payload, {
            timeout: 10000,
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const { rc, rd, data } = response.data;

        // Jika rc ≠ 00 → error
        if (rc !== "00") {
            throw new Error(`Check price failed: ${rd}`);
        }

        if (!data) {
            throw new Error("API did not return price data");
        }

        return data;

    } catch (err: any) {
        throw new Error(`Failed to fetch check price: ${err.message}`);
    }
};
