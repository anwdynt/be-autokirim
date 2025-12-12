// ========================================================
//  Helper COD + Insurance
// ========================================================
import { Prisma } from "@prisma/client";
export const calculateCodAndInsurance = (
    courierCode: string,
    feeCodRate: number,
    shippingFee: number,
    itemPrice: number,
    insuranceRate: number,
    minimalFee: number = 0
) => {

    // Hitung insurance value
    const insuranceValue =
        insuranceRate > 0 ? insuranceRate * itemPrice : 0;

    // COD tanpa asuransi
    let codWithout =
        feeCodRate > 0 ? feeCodRate * (itemPrice + shippingFee) : 0;

    // COD dengan asuransi
    let codWith =
        feeCodRate > 0
            ?  feeCodRate * (itemPrice + shippingFee + insuranceValue)  
            : 0;

    // Terapkan minimal fee COD
    if (minimalFee > 0) {
        if (codWithout < minimalFee) codWithout = minimalFee;
        if (codWith < minimalFee) codWith = minimalFee;
    }

    return {
        insurance_value: new Prisma.Decimal(insuranceValue).ceil(),
        cod_fee_without_insurance: new Prisma.Decimal(codWithout).ceil(),
        cod_fee_with_insurance: new Prisma.Decimal(codWith).ceil()
    }
};

