[%bs.raw {|require('./app.css')|}];

type state = {
  showSent: bool
}

type action =
  | ShowSent
  | HideSent;

let component = ReasonReact.reducerComponent("App");

/* Form submit handler */
let onSubmit = (_event, self) => {
  self.ReasonReact.send(ShowSent)
  Js.log("Submitting analytics call...");
  /* TODO: Trigger analytics call */
}

let make = (_children) => {
  ...component,
  initialState: () => {showSent: false},
  reducer: (action, _state) =>
    switch (action) {
    | ShowSent => ReasonReact.UpdateWithSideEffects({ showSent: true }, self => ignore(Js.Global.setTimeout(() => self.send(HideSent), 1000)))
    | HideSent => ReasonReact.Update({ showSent: false })
    },
  render: self =>
    <div className="App">
      <h1> {ReasonReact.string("Typewriter ReasonML Example")} </h1>
      <input name="name" placeholder="Product Name" type_="text" autoFocus=true />
      <br/>
      <button onClick=self.handle(onSubmit)> {ReasonReact.string("Submit")} </button>
      <br/>
      <p className=(self.state.showSent ? "" : "hidden")> {ReasonReact.string("Sent!")} </p>
    </div>
};
