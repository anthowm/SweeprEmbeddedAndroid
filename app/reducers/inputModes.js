export const initialState = {
  preferredInput: 'VOICE' // VOICE, KEYBOARD
};

function inputMode(state = initialState, action) {
  switch (action.type) {
    case 'SET_KEYBOARD_MODE_REQUESTED':
      return _.assign({}, state, { preferredInput: action.preferredInput });

    default:
      return state;
  }
}

export const InputModesSelector = {
  currentInputMode: (state) => {
    return state.preferredInput;
  }
};

export default inputMode;
