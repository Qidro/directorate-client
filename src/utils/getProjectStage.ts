import {projectStage} from "../constants/project";

export const getProjectStage = (status: string) => {
    if (status in projectStage) {
        return [projectStage[status].text, projectStage[status].color]
    }

    return ['Неизвестная стадия', '9B9B9B']
}