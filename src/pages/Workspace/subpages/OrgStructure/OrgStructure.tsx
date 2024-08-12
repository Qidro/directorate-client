import {FC, useEffect, useState} from 'react';
import style from "../Users/Users.module.scss";
import {Button, Card, message, Modal, Table, Typography} from "antd";
import {Department, Position} from "../../../../types/orgStructure";
import OrgStructureApi from "../../../../api/orgStructure-api";
import NewDepartmentForm from "../../../../components/OrgStructure/DepartmentForm/NewDepartmentForm";
import EditDepartmentForm from "../../../../components/OrgStructure/DepartmentForm/EditDepartmentForm";
import NewPositionForm from "../../../../components/OrgStructure/PositionForm/NewPositionForm";
import EditPositionForm from "../../../../components/OrgStructure/PositionForm/EditPositionForm";
import {getColumns, getExpandedTable} from "./tableData";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography

const OrgStructure: FC = () => {
    const [tableLoading, setTableLoading] = useState<boolean>(true);

    const [departmentsInfo, setDepartmentsInfo] = useState<Department[]>();
    const [departmentInfo, setDepartmentInfo] = useState<Department>();

    const [newDepartmentFormOpened, setNewDepartmentFormOpened] = useState<boolean>(false);
    const [editDepartmentFormOpened, setEditDepartmentFormOpened] = useState<boolean>(false);

    const [positionInfo, setPositionInfo] = useState<Position>();
    const [newPositionFormOpened, setNewPositionFormOpened] = useState<boolean>(false);
    const [editPositionFormOpened, setEditPositionFormOpened] = useState<boolean>(false);


    const getDepartmentsInfo = async () => {
        const res = await OrgStructureApi.getDepartments();

        setDepartmentsInfo(res.data);
        setTableLoading(false)
    }

    useEffect(() => {
        getDepartmentsInfo().then();
    }, []);

    function onEditDepartment(id: number) {
        message.loading('Загрузка данных')
        OrgStructureApi.getDepartment(id).then((res) => {
            message.destroy()
            setDepartmentInfo(res.data)
            setEditDepartmentFormOpened(true)
        }).catch(error => {
            message.destroy()
            if (error.response.data === 'Department not found') {
                message.error('Отдел не найден!')
            } else {
                message.error('Не удалось загрузить данные!')
            }
        });
    }

    function onDeleteDepartment(id: number) {
        message.loading('Удаление отдела');
        OrgStructureApi.deleteDepartment(id).then(() => {
            message.destroy();
            setDepartmentsInfo(departmentsInfo ? departmentsInfo.filter(item => item.id !== id) : [])
            message.success('Отдел удален!');
        }).catch(() => {
            message.destroy();
            message.error('Не удалось удалить отдел!')
        });
    }

    function onEditPosition(id: number) {
        message.loading('Загрузка данных')
        OrgStructureApi.getPosition(id).then((res) => {
            message.destroy()
            setPositionInfo(res.data)
            setEditPositionFormOpened(true)
        }).catch(error => {
            message.destroy()
            if (error.response.data === 'Position not found') {
                message.error('Должность не найдена!')
            } else {
                message.error('Не удалось загрузить данные!')
            }
        });
    }

    function onDeletePosition(id: number) {
        message.loading('Удаление должности');
        OrgStructureApi.deletePosition(id).then(() => {
            message.destroy();
            message.success('Должность удалена!');
        }).catch(() => {
            message.destroy();
            message.error('Не удалось удалить должность!')
        });
    }

    const handleCancel = () => {
        setNewDepartmentFormOpened(false);
        setNewPositionFormOpened(false);
        setEditDepartmentFormOpened(false);
        setEditPositionFormOpened(false);
    };

    return (
        <Card>
            <CardTitle>
                <Title level={4}>Структура организации</Title>

                <div className={style.add__user__btn}>
                    <Button
                        type="primary"
                        onClick={() => setNewDepartmentFormOpened(true)}
                    >Добавить отдел</Button>

                    <Button
                        type="primary"
                        onClick={() => setNewPositionFormOpened(true)}
                    >Добавить должность</Button>
                </div>
            </CardTitle>

            <Table
                columns={getColumns(onEditDepartment, onDeleteDepartment)}
                expandable={{expandedRowRender: (record) => getExpandedTable(record, onEditPosition, onDeletePosition)}}
                size='middle'
                dataSource={departmentsInfo}
                loading={tableLoading}
                rowKey='id'
                bordered
                scroll={{x: 700}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight'], size: 'default'}}
            />
            <Modal
                destroyOnClose
                width='40vw'
                title="Создание отдела"
                open={newDepartmentFormOpened}
                onCancel={handleCancel}
                footer={null}>
                <NewDepartmentForm
                    setNewDepartmentFormOpened={setNewDepartmentFormOpened}
                    departmentsInfo={departmentsInfo}
                    setDepartmentsInfo={setDepartmentsInfo}/>
            </Modal>

            <Modal
                destroyOnClose
                width='40vw'
                title="Создание должности"
                open={newPositionFormOpened}
                onCancel={handleCancel}
                footer={null}>
                <NewPositionForm setNewPositionFormOpened={setNewPositionFormOpened}/>
            </Modal>

            <Modal
                destroyOnClose
                width='40vw'
                title="Редактирование отдела"
                open={editDepartmentFormOpened}
                onCancel={handleCancel}
                footer={null}>
                <EditDepartmentForm
                    setEditDepartmentFormOpened={setEditDepartmentFormOpened}
                    departmentInfo={departmentInfo}
                    setDepartmentsInfo={setDepartmentsInfo}
                    departmentsInfo={departmentsInfo}
                />
            </Modal>

            <Modal
                destroyOnClose
                width='40vw'
                title="Редактирование должности"
                open={editPositionFormOpened}
                onCancel={handleCancel}
                footer={null}
            >
                <EditPositionForm
                    setEditPositionFormOpened={setEditPositionFormOpened}
                    positionInfo={positionInfo}
                    setDepartmentsInfo={setDepartmentsInfo}
                    departmentsInfo={departmentsInfo}
                />
            </Modal>
        </Card>
    );
};

export default OrgStructure;