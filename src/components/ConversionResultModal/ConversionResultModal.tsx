import {FC} from 'react';
import {IConvertToProjectProps} from "./IConversionResultProps";
import {Button, Modal, Result} from "antd";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store";

const ConversionResultModal: FC<IConvertToProjectProps> = ({open, onClose}) => {
    const navigate = useNavigate();
    const projectStore = useStore(store => store.project)

    const toProject = () => {
        navigate('/project/' + projectStore.project.id + '/info')
    };

    const toProposals = () => {
        navigate('/proposals');
    };

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onClose}
            footer={false}
        >
            <Result
                status="success"
                title="Проектное предложение успешно преобразовано в проект!"
                extra={[
                    <Button type="primary" onClick={toProject} style={{marginBottom: 16}}>Перейти к проекту</Button>,
                    <Button onClick={toProposals}>Вернуться к проетным предложениям</Button>
                ]}
            />
        </Modal>

    );
};

export default observer(ConversionResultModal);