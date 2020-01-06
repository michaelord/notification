import {canUseDOM, generateGUID, noop} from 'components/libs';
import {Feedback} from 'components/types';
import React from 'react';
// https://github.com/jossmac/react-toast-notifications/blob/master/src/ToastProvider.js
import {createPortal} from 'react-dom';
import {Transition, TransitionGroup} from 'react-transition-group';
import {NotificationContainer} from './NotificationContainer';
import {NotificationController} from './NotificationController';
import {DefaultNotification} from './NotificationElement';

import * as Types from 'components/types';

export type Placement = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';

const defaultComponents = {
	Notification: DefaultNotification,
	NotificationContainer,
};

const NotificationContext = React.createContext(null);
const {Consumer, Provider} = NotificationContext;

type Components = {};

type Callback = (Id: string) => void;

export type Options = {
	appearance?: Feedback;
	autoDismiss?: boolean;
	onDismiss?: Callback;
	pauseOnHover?: boolean;
};

export type HoverFn = () => void;

type NotificationType = Options & {
	appearance: Feedback;
	content: Types.Children;
	id: Id;
};

type Props = {
	// A convenience prop; the time until a toast will be dismissed automatically, in milliseconds.
	// Note that specifying this will override any defaults set on individual children Toasts.
	autoDismissTimeout: number;

	// Component replacement object
	components: Components;
	// Unrelated app content
	children?: Types.Children;

	// Where, in relation to the viewport, to place the toasts
	placement: Placement;

	// A convenience prop; the duration of the toast transition, in milliseconds.
	// Note that specifying this will override any defaults set on individual children Toasts.
	transitionDuration: number;
};

type NotificationsType = Array<NotificationType>;

type State = {
	notifications: NotificationsType;
};

export type Id = string;

export class NotificationProvider extends React.Component<Props, State> {
	static defaultProps = {
		autoDismissTimeout: 5000,
		components: defaultComponents,
		placement: 'bottom-right',
		transitionDuration: 220,
	};

	state: State = {
		notifications: [],
	};

	add = (content: React.ReactNode, options: Options = {}, cb: Callback = noop): string => {
		const id = generateGUID();
		const callback = () => cb(id);

		this.setState(state => {
			const notifications = state.notifications.slice(0);
			const notification = Object.assign({}, {content, id}, options);

			notifications.push(notification as NotificationType);

			return {notifications};
		}, callback);

		return id;
	};

	update = (id: Id, content: Types.Children, options: Options = {}, cb: Callback = noop) => {
		const callback = () => cb(id);

		this.setState(state => {
			const notifications = state.notifications.map(item => {
				if (item.id === id) {
					return Object.assign({}, {content, id}, options) as NotificationType;
				}

				return item;
			});

			return {notifications};
		}, callback);
	};

	remove = (id: Id, cb: Callback = noop) => {
		const callback = () => cb(id);

		this.setState(state => {
			const notifications = state.notifications.filter(t => t.id !== id);

			return {notifications};
		}, callback);
	};

	onDismiss = (id: Id, cb: Callback = noop) => () => {
		cb(id);
		this.remove(id);
	};

	render(): React.ReactNode {
		const {autoDismissTimeout, children, components, placement, transitionDuration} = this.props;

		const {Notification, NotificationContainer} = {...defaultComponents, ...components};
		const {add, remove, update} = this;
		const notifications = Object.freeze(this.state.notifications);

		const hasNotifications = Boolean(notifications.length);
		const portalTarget = canUseDOM ? document.body : null;

		return (
			<Provider value={{add, remove, update, notifications}}>
				{children}

				{portalTarget ? (
					createPortal(
						<NotificationContainer placement={placement} hasNotifications={hasNotifications}>
							<TransitionGroup component={null}>
								{notifications.map(
									({appearance, autoDismiss, content, id, onDismiss, ...unknownConsumerProps}) => (
										<Transition
											appear
											key={id}
											mountOnEnter
											timeout={transitionDuration}
											unmountOnExit
										>
											{transitionState => (
												<NotificationController
													appearance={appearance}
													autoDismiss={autoDismiss}
													autoDismissTimeout={autoDismissTimeout}
													component={Notification}
													key={id}
													onDismiss={this.onDismiss(id, onDismiss)}
													placement={placement}
													transitionDuration={transitionDuration}
													transitionState={transitionState}
													{...unknownConsumerProps}
												>
													{content}
												</NotificationController>
											)}
										</Transition>
									)
								)}
							</TransitionGroup>
						</NotificationContainer>,
						portalTarget
					)
				) : (
					<NotificationContainer placement={placement} hasNotifications={hasNotifications} />
				)}
			</Provider>
		);
	}
}

export const NotificationConsumer = ({children}: {children}) => <Consumer>{context => children(context)}</Consumer>;

export const withNotificationManager = () => {};

export const useNotifications = () => {
	const ctx = React.useContext(NotificationContext);

	if (!ctx) {
		throw Error('The `useNotifications` hook must be called from a descendent of the `NotificationProvider`.');
	}

	return {
		addNotification: ctx.add,
		updateNotification: ctx.update,
		removeNotification: ctx.remove,
		notificationStack: ctx.notifications,
	};
};
