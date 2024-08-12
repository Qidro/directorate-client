import{FC, useEffect, useState} from 'react';
import {DatePicker, message, Tooltip, Typography} from "antd";
import {InfoOutlined} from "@ant-design/icons";
import {IProjectBaseCPProps} from "./IProjectBaseCPProps";
import style from './ProjectBaseCP.module.scss'
import dayjs from "dayjs";
import CalendarPlanApi from "../../api/calendarPlan-api";
import {useStore} from "../../store";
import {observer} from "mobx-react-lite";
import {roleRequired} from "../../utils/roleRequired";

const {Text} = Typography;

const ProjectBaseCP: FC<IProjectBaseCPProps> = ({cp, title, baseColor, secondColor, value, setTableData, tableData, setTasks, tasks}) => {
    const [pickerIsDisabled, setPickerIsDisabled] = useState<boolean>(false);
    const {
        project: projectStore,
        user: userStore
    } = useStore()

    const pickerChangeHandler = async (date: any) => {
        if (date) {
            try {
                const res = await CalendarPlanApi.createPoint(
                    projectStore.project.id, cp.slug, cp.name, dayjs(date).format('YYYY-MM-DD'),
                    dayjs(date).format('YYYY-MM-DD'), dayjs(date).format('YYYY-MM-DD'),
                    userStore.user.id, 'NONE_DOC'
                )
                setTableData([...tableData, res.data]);
                setTasks([...tasks, {
                    start: res.data.type === 'WORK' ? dayjs(res.data.start_date_plan).toDate() : dayjs(res.data.end_date_plan).toDate(),
                    end: dayjs(res.data.end_date_plan).toDate(),
                    name: res.data.name,
                    id: res.data.id.toString(),
                    type: res.data.type === 'WORK' ? 'task' : 'milestone',
                    progress: 100,
                    isDisabled: true,
                    styles: {progressColor: '#e63636', progressSelectedColor: '#e63636'},
                }]);

                if (cp.slug === 'INITIATION') {
                    projectStore.project.start_date = date
                }

                if (cp.slug === 'COMPLETION') {
                    projectStore.project.end_date = date
                }

                setPickerIsDisabled(true);
            } catch (e) {
                message.error('Ошибка создания точки!');
            }
        }
    };

    useEffect(() => {
        if (value || !projectStore.editable || !roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users)) {
            setPickerIsDisabled(true);
        }
        // eslint-disable-next-line
    }, [value, projectStore])

    return (
        <div className={style.control_point}>
            <div className={style.header} style={{background: baseColor}}>
                {title}
                <Tooltip title={cp.description}>
                    <InfoOutlined className={style.info}/>
                </Tooltip>
            </div>
            <div className={style.info__block} style={{background: secondColor}}>
                <Text>{cp.name}</Text>
            </div>
            <div className={style.picker__block}>
                <Text>Плановая дата:</Text>
                <DatePicker className={style.date__picker} format='DD.MM.YYYY'
                            onChange={(date) => pickerChangeHandler(date)}
                            disabled={pickerIsDisabled}
                            defaultValue={value ? dayjs(value) : undefined}
                />
            </div>
        </div>
    );
};

export default observer(ProjectBaseCP);