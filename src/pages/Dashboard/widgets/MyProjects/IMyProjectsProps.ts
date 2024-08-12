import {IProject} from "../../../../types/project";

export interface IMyProjectsProps {
    projects: IProject[],
    loading?: boolean,
    verticalScroll?: number
}