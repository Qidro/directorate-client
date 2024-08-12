import {API_URL} from "./index";

class FileApi {
    getFileLink = (file_id: string) => API_URL + '/file/' + file_id
}

export default new FileApi()