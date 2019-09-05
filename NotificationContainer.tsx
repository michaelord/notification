import * as React from 'react';

import './NotificationContainer.scss';

import {getModifiers} from 'components/libs';

import {Placement} from './NotificationProvider';

export type NotificationContainerProps = {
	children?: React.ReactNode;
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
