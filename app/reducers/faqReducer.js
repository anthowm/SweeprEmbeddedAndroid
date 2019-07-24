import _ from 'lodash';
import moment from 'moment';

// Reducer
function deviceFAQList(state = [], action) {
  switch (action.type) {
    case 'FETCH_FAQ_SUCCEEDED':
      return action.deviceFAQList || state;

    case 'FAQ_FETCH_FAILED':
      console.warn('FAQ_FETCH_FAILED', action.message);
      return state;

    default:
      return state;
  }
}

// Selector
export const FAQSelector = {
  all: (state) => {
    let items = state.items;

    return _.map(items, (item) => {
      return {
        key: item.id,
        title: item.items['sweeprcms:question'],
        fullBody: item.items['sweeprcms:answer'].content,
        body: `${
          item.items['sweeprcms:answer'].content
            .replace(/<(?:.|\n)*?>/gm, '') // Remove all HTML tags
            .replace(/[^a-zA-Z ]/g, ' ') // Remove Special Characters
            .slice(0, 140) // Keep only the first 124 characters any item
            .replace(/[\n\r]/g, ' ') // Remove Character literal
            .replace(/ +/g, ' ') // Remove multiple spaces
        }...`
      };
    });
  }
};

export default deviceFAQList;
