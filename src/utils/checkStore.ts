export const checkStore = (stores: Object[]): boolean => {
    return stores.filter(store => Object.keys(store).length !== 0).length === stores.length
}