import {indicatorCoverageUnits} from "../constants/indicator";

export const getCoverageUnits = (unit: string) => {
    if (unit in indicatorCoverageUnits) {
        return indicatorCoverageUnits[unit].text
    }

    return ''
}