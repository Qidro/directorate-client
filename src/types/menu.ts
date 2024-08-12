import {MenuProps} from "antd";
import React from "react";

export type MenuItem = Required<MenuProps>['items'][number];

export interface IMenu {
    key: string,
    locations?: string[]
    label: React.ReactNode,
    icon?: React.ReactNode,
    right?: string,
}