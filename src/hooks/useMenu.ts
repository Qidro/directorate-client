import {IMenu, MenuItem} from "../types/menu";
import {useMemo} from "react";
import {useLocation} from "react-router-dom";
import {useStore} from "../store";

const isPathStartsWithLocation = (path: string, location: string) => {
    const pathParts = path.split('/')
    const locationParts = location.split('/')

    if (pathParts.length < locationParts.length) return false

    for (let i = 0; i < locationParts.length; i++) {
        if (locationParts[i] !== '*' && pathParts[i] !== locationParts[i]) {
            return false
        }
    }

    return true
}

const useMenu = (menuList: IMenu[]): [MenuItem[], string[]] => {
    const location = useLocation()
    const userStore = useStore(store => store.user)

    const getMenu = () => {
        // Delete items if the user does not have the right
        const withoutRights = menuList.filter(item => (
            item.right ? userStore.checkRight(item.right) : item
        ))

        return withoutRights.map(item => ({
            key: item.key,
            label: item.label,
            icon: item.icon,
        })) as MenuItem[]
    }

    const getSelectedItems = () => {
        const items = menuList.filter(item => {
            for (const itemLocation of item.locations || []) {
                if (isPathStartsWithLocation(location.pathname, itemLocation)) {
                    return true
                }
            }

            return false
        })

        return items.map(item => item.key)
    }

    const menu = useMemo(getMenu, [userStore, menuList])
    const selectedItems = useMemo(getSelectedItems, [location, menuList])

    return [menu, selectedItems]
}

export default useMenu