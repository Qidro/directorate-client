import ReactDOM from 'react-dom/client';
import App from './App';
import {ConfigProvider} from "antd";
import ru_Ru from 'antd/lib/locale/ru_RU'
import "gantt-task-react/dist/index.css";
import './index.scss';
import {StoreProdiver, store} from './store';
require('./utils/chartsConfig');

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <StoreProdiver store={store}>
        <ConfigProvider locale={ru_Ru} theme={{
            token: {
                colorPrimary: '#e63636'
            }
        }}>
            <App/>
        </ConfigProvider>
    </StoreProdiver>
);