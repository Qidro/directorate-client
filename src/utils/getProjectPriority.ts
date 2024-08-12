import {projectPriority} from "../constants/project";

export const getProjectPriority = (status: string) => {
    if (status in projectPriority) {
        return projectPriority[status].text
    }
}