import { Proposal } from "./proposal";
import { User } from "./user";
import {Project} from "./project";
import {Indicator} from "./indicator";
import { Result } from "./result";
import {Contract} from "./contract";
import {Backpack} from "./backpack";
import {CalendarPlan} from "./calendarPlan";

class RootStore {
    user = new User();
    proposal = new Proposal();
    project = new Project();
    indicator = new Indicator();
    result = new Result();
    contract = new Contract();
    backpack = new Backpack();
    calendarPlan = new CalendarPlan();
}

export type { RootStore }
export const store = new RootStore()