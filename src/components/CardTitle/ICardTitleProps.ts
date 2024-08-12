import React, {CSSProperties} from "react";

export interface ICardTitleProps {
    children: React.ReactNode,
    block?: boolean,
    wrap?: boolean
    style?: CSSProperties
}