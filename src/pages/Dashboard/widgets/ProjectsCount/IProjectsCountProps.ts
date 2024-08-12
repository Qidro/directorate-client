export interface IProjectsCountProps {
    data?: {
        initiation: number;
        preparation: number;
        realization: number;
        completion: number;
        post_project_monitoring: number;
        archived: number;
        canceled: number;
    },
    loading?: boolean
}