import {Card, Descriptions, Spin, Typography} from "antd";
import style from "../../../Project/subpages/Info/ProjectInfo.module.scss";
import dayjs from "dayjs";
import {observer} from "mobx-react-lite";
import {useStore} from "../../../../store";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const BackpackInfo = () => {
    const backpackStore = useStore(store => store.backpack)

    return (
        <Spin spinning={!checkStore([backpackStore.backpack])}>
            <Card>
                <div className={style.title}>
                    <Title level={4}>Общая информация</Title>
                </div>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label='Наименование'>{backpackStore.backpack.name}</Descriptions.Item>
                    <Descriptions.Item label='Описание'>{backpackStore.backpack.description}</Descriptions.Item>
                    <Descriptions.Item label='Дата создания'>{
                        dayjs(backpackStore.backpack.creation_date).isValid()
                            ? dayjs(backpackStore.backpack.creation_date).format('DD.MM.YYYY')
                            : ''
                    }</Descriptions.Item>
                    <Descriptions.Item label='Дата изменения'>
                        {
                            dayjs(backpackStore.backpack.change_date).isValid()
                                ? dayjs(backpackStore.backpack.change_date).format('DD.MM.YYYY')
                                : ''
                        }
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Spin>
    );
};

export default observer(BackpackInfo);