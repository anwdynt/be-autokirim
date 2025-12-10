import axios from "axios";
import { logger as winstonLogger } from "../../config/logger";

const URL_AUTOKIRIM = process.env.URL_AUTOKIRIM!;
const TOKEN = process.env.TOKEN_AUTOKIRIM!;

type PickupPointRequest = {
    name: string;
    phone: string;
    address: string;
    email: string;
    longitude?: string | null;
    latitude?: string | null;
    district_id: number;
    pickup_point_code?: string;
}

type PickupPointDeleteRequest = {
    pickup_point_code: string;
}

type PickupPointResponse = {
    rc: string;
    rd: string;
    data?: {
        pickup_point_code: string;
    };
};

export const fetchPickupPointCode = async (
    payload: PickupPointRequest
): Promise<string> => {

    try {
        // Fix: cek env dengan benar
        if (!URL_AUTOKIRIM) {
            throw new Error("Environment URL_AUTOKIRIM is not set");
        }

        const url = `${URL_AUTOKIRIM}/pickup-point/insert`;

        const response = await axios.post<PickupPointResponse>(url, payload, {
            timeout: 8000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        const { rc, rd, data } = response.data;

        // Jika rc != 00 → failure
        if (rc !== "00") {
            winstonLogger.error(`Error fetching pickup point: ${rd}`);
            throw new Error(`Error fetching pickup point: ${rd}`);
        }

        if (!data || !data.pickup_point_code) {
            winstonLogger.error(`API is not returning pickup_point_code`);
            throw new Error("API is not returning pickup_point_code");
        }

        return data.pickup_point_code;

    } catch (err: any) {
        winstonLogger.error(`Error fetching pickup point: ${err.message}`);
        throw new Error(`: ${err.message}`);
    }
};

export const fetchUpdatePickupPoint = async (
    payload: PickupPointRequest
): Promise<string> => {

    try {
        // Fix: cek env dengan benar
        if (!URL_AUTOKIRIM) {
            throw new Error("Environment URL_AUTOKIRIM is not set");
        }

        const url = `${URL_AUTOKIRIM}/pickup-point/update`;

        const response = await axios.post<PickupPointResponse>(url, payload, {
            timeout: 8000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        const { rc, rd } = response.data;
        winstonLogger.info(`Response: ${JSON.stringify(response.data)}`);

        // Jika rc != 00 → failure
        if (rc !== "00") {
            winstonLogger.error(`Error updating pickup point: ${rd}`);
            throw new Error(`Error updating pickup point: ${rd}`);
        }

        winstonLogger.info(`Response: ${JSON.stringify(response.data)}`);

        return rd;
    } catch (err: any) {
        winstonLogger.error(`Error fetching pickup point: ${err.message}`);
        throw new Error(`: ${err.message}`);
    }
};

export const fetchDeletePickupPoint = async (
    payload: PickupPointDeleteRequest
): Promise<string> => {

    try {
        // Fix: cek env dengan benar
        if (!URL_AUTOKIRIM) {
            throw new Error("Environment URL_AUTOKIRIM is not set");
        }

        const url = `${URL_AUTOKIRIM}/pickup-point/delete`;

        const response = await axios.post<PickupPointResponse>(url, payload, {
            timeout: 8000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        const { rc, rd } = response.data;
        winstonLogger.info(`Response: ${JSON.stringify(response.data)}`);

        // Jika rc != 00 → failure
        if (rc !== "00") {
            winstonLogger.error(`Error updating pickup point: ${rd}`);
            throw new Error(`Error updating pickup point: ${rd}`);
        }

        return rd;
    } catch (err: any) { 
        winstonLogger.error(`Error fetching pickup point: ${err.message}`);
        throw new Error(`: ${err.message}`);
    }
};
