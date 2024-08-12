interface ILogAuthor {
    id: number;
    fullname: string;
}

export interface IBaseLog {
    id: number;
    author: ILogAuthor;
    action: string;
    time_change: string;
    date_change: string;
    message: string;
}

export interface IUserLog extends IBaseLog {
    user: {
        id: number,
        fullname: string;
    }
}

export interface IProposalLog extends IBaseLog {
    proposal: {
        id: number,
        name: string;
    }
}

export interface IBackPackLog extends IBaseLog {
    backpack: {
        id: number,
        name: string;
    }
}

export interface IProjectLog extends IBaseLog {
    project: {
        id: number,
        name: string;
    }
}

export interface IIndicatorLog extends IBaseLog {
    indicator: {
        id: number,
        name: string;
    }
}

export interface IResultLog extends IBaseLog {
    result: {
        id: number,
        name: string;
    }
}

export interface ICalendarPlanLog extends IBaseLog {
    calendar_plan: {
        id: number,
        name: string;
    }
}

export interface IContractLog extends IBaseLog {
    contract: {
        id: number,
        name: string;
    }
}