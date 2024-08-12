import {createContext, useContext, ReactNode} from "react";
import {RootStore} from "./root";

const StoreContext = createContext<RootStore | null>(null)

interface IStoreProdiverProps {
    store: RootStore;
    children: ReactNode;
}

export const StoreProdiver = (props: IStoreProdiverProps) => (
    <StoreContext.Provider value={props.store}>
        {props.children}
    </StoreContext.Provider>
)

export function useStore(): RootStore;
export function useStore<Result>(
    selector: (value: RootStore) => Result
): Result;
export function useStore<Result>(selector?: (value: RootStore) => Result) {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error("Can not `useStore` outside of the `StoreProvider`");
    }

    if (selector) {
        return selector(store);
    }

    return store;
}