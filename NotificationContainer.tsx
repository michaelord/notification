import {getModifiers} from 'components/libs';
import React from 'react';
import './NotificationContainer.scss';
import {Placement} from './NotificationProvider';

import * as Types from 'components/types';

export type NotificationContainerProps = {
	children?: Types.Children;
	hasNotifications: boolean;
	placement: Placement;
};

export const NotificationContainer = ({hasNotifications, placement, children}: NotificationContainerProps) => {
	const base: string = 'notification-container';

	const atts: object = {
		className: getModifiers(base, {placement, active: hasNotifications}),
	};

	return <div {...atts}>{children}</div>;
};
