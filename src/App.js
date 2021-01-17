import React from "react";

function App() {
  const [state, setState] = React.useState({
    lastClicked: -1,
    currentlySelected: -1,
  });

  const generateButton = (id) => ({
    id: id,
    label: id + 1,
    onClick: () => {
      setState({ ...state, lastClicked: id, currentlySelected: id });
    },
    onFocus: () => {
      setState({ ...state, currentlySelected: id });
    },
  });

  const buttons = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => generateButton(i));

  const render = (button) => (
    <Button
      id={button.id}
      key={button.key}
      label={button.label}
      currentlySelected={state.currentlySelected}
      lastClicked={state.lastClicked}
      onClick={button.onClick}
      onFocus={button.onFocus}
    />
  );

  React.useEffect(() => {
    const clickSelected = (e) => {
      buttons[state.currentlySelected].onClick();
    };

    const changeSelected = (i) => {
      let result = state.currentlySelected + i;
      if (result < 0) {
        result = 8;
      }
      if (result === 9) {
        result = 0;
      }
      setState({ ...state, currentlySelected: result });
    };
    const navListener = (e) => {
      // eslint-disable-next-line no-restricted-globals
      const evtobj = window.event ? event : e;
      if (evtobj.keyCode === 37) {
        changeSelected(-1);
      }
      if (evtobj.keyCode === 39) {
        changeSelected(1);
      }
      if (evtobj.keyCode === 38) {
        changeSelected(-3);
      }
      if (evtobj.keyCode === 40) {
        changeSelected(+3);
      }
      if (evtobj.keyCode === 69) {
        clickSelected();
      }
    };
    document.addEventListener("keydown", navListener);
    return () => {
      document.removeEventListener("keydown", navListener);
    };
  }, [state.currentlySelected, state.lastClicked, buttons, state]);

  return (
    <div>
      <h1>react-keyboard-nav</h1>
      This demo shows how to synchronize focus when using mouse, tab navigation
      and custom keyboard navigation.
      <div>
        <h2>demo</h2>
        <div>{buttons.slice(0, 3).map(render)}</div>
        <div>{buttons.slice(3, 6).map(render)}</div>
        <div>{buttons.slice(6).map(render)}</div>

        <ul>
          <li>Last Clicked: {state.lastClicked}</li>
          <li>Currently Selected: {state.currentlySelected}</li>
        </ul>
      </div>
      <div>
        <h2>what to do here</h2>

        <ul>
          <li>
            Use the arrow keys on your keyboard to navigate via the custom code.
          </li>
          <li>Use tab / shift+tab to navigate via the HTML tab navigation.</li>
          <li>
            Press 'e' to trigger click on the current button via the custom
            code.{" "}
          </li>
          <li>
            Use the space bar to trigger a click on the focused DOM element.
          </li>
          <li>Click on a button to move the focus.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;

const Button = (props) => {
  const ref = React.useRef(null);
  const style = {
    padding: 10,
    margin: 10,
  };
  if (props.lastClicked === props.id) {
    style.backgroundColor = "orange";
  }
  if (props.currentlySelected === props.id) {
    style.backgroundColor = "yellow";
  }
  if (props.lastClicked === props.id && props.currentlySelected === props.id) {
    style.backgroundColor = "red";
  }
  React.useEffect(() => {
    if (
      props.currentlySelected === props.id &&
      ref.current &&
      ref.current !== document.activeElement
    ) {
      ref.current.focus();
    }
  }, [props.id, props.currentlySelected, ref]);
  const onFocus = () => {
    if (props.currentlySelected !== props.id) {
      props.onFocus();
    }
  };
  return (
    <button
      ref={ref}
      style={style}
      onClick={props.onClick}
      key={props.id}
      onFocus={onFocus}
    >
      {props.label}
    </button>
  );
};
