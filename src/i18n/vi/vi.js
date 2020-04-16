import _common from "./common/_common";
import _layout from "./layout/_layout";
import _public from "./public/_public";
import _private from "./private/_private";
import _components from "./components/_components";
import app from "./webapp";

const message = {
  ..._common,
  ..._layout,
  ..._public,
  ..._private,
  ..._components,
  ...app
};

export default message;
