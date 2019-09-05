import * as React from 'react';

// https://github.com/jossmac/react-toast-notifications/blob/master/src/ToastController.js

import {ComponentType} from 'react';

import {NotificationProps} from './NotificationElement';

import {canUseDOM, noop, generateGUID} from 'components/libs';

type Props = NotificationProps & {
	component: ComponentType<NotificationProps>;
};

type State = {
	autoDismissTimeout: number;
	isRunning: boolean;
};

const defaultAutoDismissTimeout = 5000;

const TimerType = {
	clear: noop,
	pause: noop,
	resume: noop,
};

// TODO timer

export class NotificationController extends React.Component<Props, State> {
	render(): React.ReactNode {
		const {component: Notification, ...props} = this.props;

		return <Notification {...props} />;
	}
}
