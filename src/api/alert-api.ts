import request from "./index";
import {IAlertForm} from "../types/forms";

class AlertApi {
    getAlert = () => request.get<IAlertForm>('/alert');

    setAlert = (text: string) => request.post<IAlertForm>('/alert/set', {text})
}

export default new AlertApi()