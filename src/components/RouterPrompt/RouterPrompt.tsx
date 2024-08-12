import {FC} from 'react';
import {unstable_useBlocker as useBlocker} from "react-router-dom";
import {IRouterPromptProps} from "./IRouterPromptProps";
import {Modal} from "antd";

const RouterPrompt: FC<IRouterPromptProps> = ({ message = "Если уйти с этой страницы, то все введенные данные будут утеряны. Вы уверены?", blocked = true, children}) => {
    const blocker = useBlocker(blocked)

    return (
        <>
            {children}
            <Modal
                open={blocker.state === 'blocked'}
                onOk={() => blocker.proceed?.()}
                onCancel={() => blocker.reset?.()}
                title='Подтверждение'
                destroyOnClose
            >
                {message}
            </Modal>
        </>
    );
};

export default RouterPrompt;