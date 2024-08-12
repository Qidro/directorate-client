import {useEffect} from "react";
import {isRunningStandalone} from "../utils/isStandaloneApp";

const useDocumentTitle = (title: string) => {
    useEffect(() => {
        document.title = isRunningStandalone() ? title : title + ' - Исполнительная дирекция'
    }, [title])

    useEffect(() => () => {
        document.title = isRunningStandalone() ? '' : 'Исполнительная дирекция'
    }, [])
}

export default useDocumentTitle