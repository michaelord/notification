import {Icon} from 'components/icon';
import IconWarning from 'components/icon/warning.inline.svg';
import {getModifiers, noop} from 'components/libs';
import {Feedback} from 'components/types';
import React from 'react';
// https://github.com/jossmac/react-toast-notifications/blob/master/src/ToastElement.js
import './NotificationElement.scss';
import {HoverFn, Placement} from './NotificationProvider';

import * as Types from 'components/types';

export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export type NotificationProps = {
	appearance: Feedback;
	autoDismiss: boolean | number;
	autoDismissTimeout: number; // inherited from ToastProvider
	children?: Types.Children;
	isRunning: boolean;
	onDismiss: typeof noop;
	onMouseEnter: HoverFn;
	onMouseLeave: HoverFn;
	placement: Placement;
	transitionDuration: number; // inherited from ToastProvider
	transitionState: TransitionState; // inherited from ToastProvider
};

const NotificationElement = ({
	appearance,
	/*placement,
	transitionDuration,*/
	transitionState,
	children,
}: NotificationProps) => {
	const base: string = 'notification';

	const atts: object = {
		className: getModifiers(base, {appearance, transitionState}),
	};

	return (
		<div {...atts}>
			<div className={`${base}__main`}>{children}</div>
		</div>
	);
};

export const DefaultNotification = ({
	appearance,
	autoDismiss,
	autoDismissTimeout,
	children,
	isRunning,
	onDismiss,
	placement,
	transitionDuration,
	transitionState,
	onMouseEnter,
	onMouseLeave,
	...otherProps
}: NotificationProps): React.ReactNode => {
	return (
		<NotificationElement
			appearance={appearance}
			placement={placement}
			transitionState={transitionState}
			transitionDuration={transitionDuration}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			{...otherProps}
		>
			<div className="notification__icon">
				<Icon icon={IconWarning} />
			</div>
			<div className="notification__content">{children}</div>

			{onDismiss && (
				<div>
					<button role="button" onClick={onDismiss}>
						dismiss
					</button>
				</div>
			)}
		</NotificationElement>
	);
};
