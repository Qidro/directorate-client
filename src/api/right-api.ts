import request from "./index";
import {IRight} from "../types/right";

class RightApi {
    getRights = () => request.get<IRight[]>('/rights')
}

export default new RightApi();