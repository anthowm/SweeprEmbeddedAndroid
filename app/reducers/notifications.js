import _ from 'lodash';
import moment from 'moment';

// Reducer
function notifications(state = [], action) {
  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_SUCCEEDED':
      return action.notifications || state;

    case 'FETCH_NOTIFICATIONS_FAILED':
      console.warn('FETCH_NOTIFICATIONS_FAILED', action.message);
      return state;

    case 'NOTIFICATION_UPDATE_SUCCEEDED':
      return _.map(state, (item) => {
        return item.id === action.notification.id ? action.notification : item;
      });

    case 'NOTIFICATION_UPDATE_FAILED':
      console.warn('NOTIFICATION_UPDATE_FAILED', action.message);
      return state;

    default:
      return state;
  }
}

// Selector
export const NotificationsSelector = {
  // Returns latest x (limit) items of state.
  latest: (state, limit = 10) => {
    return _.take(state, limit);
  },

  // Returns latest x (limit) items of state.
  // Also adds a well formatted 'receivedAgo' property.
  latestWithReceivedAgo: (state, limit = 10) => {
    let l = NotificationsSelector.latest(state, limit);

    return _.map(l, (item) => {
      return _.assign({}, item, {
        receivedAgo: moment(item.date).fromNow(true),
        key: 'key-' + item.id
      });
    });
  },

  // TODO: There may be an issue getting the unread notifications count from
  // a selector based on state, since the state may not contain all unread notifications.
  // For instance, if we're getting the latest 10 notifications, perhaps the user
  // has 23 unread notifications. In this case this number would be incorrect.
  // It would be better to receive this number from the API and check if it exceeds
  // the number in state. Then handle that exclusively.
  unreadNotificationsCount: (state) => {
    return _.filter(state, ['status', 'UNREAD']).length;
  }
};

export default notifications;
