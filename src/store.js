// Using ES6 class syntax, create a new class, Store, that will represent our global application state. The Store#constructor function will take a single function as an argument, rootReducer. The constructor function should define instance variables to store the rootReducer and the global state (an empty object for now). We also need to have a way to read from the state. Define a Store#getState function that returns the state instance variable.

// Note: Since we want to control how the state can be modified, we want to make sure we don't return the actual state object, otherwise we could inadvertently modify it directly. Instead, return a copy of this.state using Object.assign.

// Another Quick Note: Object.assign only creates a "shallow" copy of our state object. That means that if our state has any nested objects or arrays, the original and the copy will still point to the same references. We'll ignore this for now, but come back here at the end of the project and re-write this function to return a "deep" copy of the state!

export default class Store {
  constructor(rootReducer) {
    this.rootReducer = rootReducer;
    this.subscriptions = [];
    this.state = this.rootReducer(
      { users: undefined, goods: undefined },
      '',
      this.subscriptions
    );
    // warn
    // this.getState = this.getState.bind(this);
  }

  subscribe(subscriptionCallback) {
    this.subscriptions.push(subscriptionCallback);
  }
  getState() {
    return { ...this.state };
  }

  dispatch(action) {
    this.state = this.rootReducer(this.getState(), action, this.subscriptions);
  }
}

const addUserActionCreator = (payload) => ({
  type: 'addUser',
  payload: 'SZ',
});

const removeLastUserActionCreator = () => ({
  type: 'removeLastUser',
});

const myInconsequentialActionCreator = () => ({
  type: 'a type no one cares about',
  data: {
    thisThing: 'will not get used anyway',
  },
});

// users: ['GZ', 'MZ'],
//       goods: ['bananas', 'breads'],
const userReducer = (prevState = ['GZ', 'MZ'], { type, payload }) => {
  if (type == 'addUser') {
    return [...prevState, payload];
  } else if (type == 'removeLastUser') {
    return [...prevState].slice(0, -1);
  } else {
    return prevState;
  }
};
const goodsReducer = (prevState = ['bananas', 'breads'], { type, payload }) => {
  if (type == 'addGoods') {
    return [...prevState, payload];
  } else {
    return prevState;
  }
};

const myReducers = {
  users: userReducer,
  goods: goodsReducer,
};

// * RootReducer zawiera wszystkie cz??stkowe reducery. Przyjmuje dowoln?? akcj?? i odpala
// * wszystkie reducery pytaj??c czy zmieni ona warto???? stanu.
const combineReducers = (reducers) => {
  return (prevState, action, subscriptions) => {
    //  przejd?? przez wszystkie klucze i wartosci dotychczasowego stanu
    // za ka??d?? iteracj??: tw??rz now?? warto???? stanu w oparciu o cz??stkowy reducer
    // [ z listy dost??pnych szcz??tkowych reducer??w wybierz ten, kt??ry odpowiada za warto???? wg klucza ze stanu]
    // patrz lista reducer??w - reducers
    //  (reducers[key])
    // przeka?? mu dotychczasow?? warto???? oraz akcj??
    // je??eli akcja nic nie robi, to zwr??ci dotychczasow?? warto????!
    //
    let newState = {};
    let stateChanged = false;

    for (const stateSliceKey in prevState) {
      const prevStateSliceValue = prevState[stateSliceKey];

      // appropriate reducer
      const sliceReducer = reducers[stateSliceKey];

      // each slice has its own appropriate reducer
      //
      const newStateSliceValue = sliceReducer(prevStateSliceValue, action);
      // if state doesn't change, returns the very same slice

      // state hasn't changed - references are the same
      if (prevStateSliceValue !== newStateSliceValue) {
        stateChanged = true;
      }
      newState = { ...newState, [stateSliceKey]: newStateSliceValue };
    }
    if (stateChanged) {
      subscriptions.forEach((subscriptionCallback) =>
        subscriptionCallback(newState)
      );
    }
    return newState;

    // problem mia??em z p??tl??
    // jakbym nie m??g?? pu??ci?? p??tli po wszystkich cz????ciach stanu
    // cz??owiek chce wykona?? od razu id?? do tego reducera
    // komputer tego nie wie. On umie robi?? p??tle i robi to szybko
  };
};

const myRootReducer = combineReducers(myReducers);

const store = new Store(myRootReducer);

store.getState();

const announceStateChange = (nextState) => {
  console.log(
    `That action changed the state! Users are now ${nextState.users}`
  );
};

store.subscribe(announceStateChange);

store.dispatch(addUserActionCreator());
store.dispatch(myInconsequentialActionCreator());
store.dispatch(removeLastUserActionCreator());
store.dispatch(myInconsequentialActionCreator());

store.getState();
