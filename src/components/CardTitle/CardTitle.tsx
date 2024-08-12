import {FC} from 'react';
import style from './CardTitle.module.scss'
import {ICardTitleProps} from "./ICardTitleProps";

const CardTitle: FC<ICardTitleProps> = ({children, block = false, wrap = true, style: inlineStyles}) => {
    const styles = `${style.title} ${wrap && style.wrap} ${block && style.block}`

    return (
        <div style={inlineStyles} className={styles}>
            {children}
        </div>
    );
};

export default CardTitle;