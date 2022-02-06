// Using ES6 class syntax, create a new class, Store, that will represent our global application state. The Store#constructor function will take a single function as an argument, rootReducer. The constructor function should define instance variables to store the rootReducer and the global state (an empty object for now). We also need to have a way to read from the state. Define a Store#getState function that returns the state instance variable.

// Note: Since we want to control how the state can be modified, we want to make sure we don't return the actual state object, otherwise we could inadvertently modify it directly. Instead, return a copy of this.state using Object.assign.

// Another Quick Note: Object.assign only creates a "shallow" copy of our state object. That means that if our state has any nested objects or arrays, the original and the copy will still point to the same references. We'll ignore this for now, but come back here at the end of the project and re-write this function to return a "deep" copy of the state!

export default class Store {
  constructor(rootReducer) {
    this.rootReducer = rootReducer;
    this.state = this.rootReducer({ users: undefined, goods: undefined }, '');

    // warn
    // this.getState = this.getState.bind(this);
  }

  getState() {
    return { ...this.state };
  }

  dispatch(action) {
    this.state = this.rootReducer(this.getState(), action);
  }
}

const addUserAction = {
  type: 'addUser',
  payload: 'SZ',
};
const removeUserAction = {
  type: 'removeUser',
  payload: 'GZ',
};
// users: ['GZ', 'MZ'],
//       goods: ['bananas', 'breads'],
const userReducer = (prevState = ['GZ', 'MZ'], { type, payload }) => {
  if (type == 'addUser') {
    return [...prevState, payload];
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

const combineReducers = (reducers) => {
  // * RootReducer zawiera wszystkie cząstkowe reducery. Przyjmuje dowolną akcję i odpala
  // * wszystkie reducery pytając czy zmieni ona wartość stanu.
  return (prevState, action) => {
    //  przejdź przez wszystkie klucze i wartosci dotychczasowego stanu
    // za każdą iteracją: twórz nową wartość stanu w oparciu o cząstkowy reducer
    // [ z listy dostępnych szczątkowych reducerów wybierz ten, który odpowiada za wartość wg klucza ze stanu]
    // patrz lista reducerów - reducers
    //  (reducers[key])
    // przekaż mu dotychczasową wartość oraz akcję
    // jeżeli akcja nic nie robi, to zwróci dotychczasową wartość!
    //
    let newState = {};
    for (const stateSliceKey in prevState) {
      const prevStateSliceValue = prevState[stateSliceKey];

      // appropriate reducer
      const sliceReducer = reducers[stateSliceKey];

      // each slice has its own appropriate reducer
      //
      const newStateSliceValue = sliceReducer(prevStateSliceValue, action);
      newState = { ...newState, [stateSliceKey]: newStateSliceValue };
    }
    return newState;

    // problem miałem z pętlą
    // jakbym nie mógł puścić pętli po wszystkich częściach stanu
    // człowiek chce wykonać od razu idź do tego reducera
    // komputer tego nie wie. On umie robić pętle i robi to szybko
  };
};

const myInconsequentialAction = {
  type: 'a type no one cares about',
  data: {
    thisThing: 'will not get used anyway',
  },
};

const myRootReducer = combineReducers(myReducers);

const store = new Store(myRootReducer);

store.getState();

store.dispatch(addUserAction);

store.getState();
