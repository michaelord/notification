import {noop} from 'components/libs';
import React from 'react';
// https://github.com/jossmac/react-toast-notifications/blob/master/src/ToastController.js
import {ComponentType} from 'react';
import {NotificationProps} from './NotificationElement';

import * as Types from 'components/types';

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
