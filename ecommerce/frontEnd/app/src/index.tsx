import {Fragment} from "react";
import { createRoot } from 'react-dom/client';

const element = document.getElementById('root');
const root = createRoot(element!);
root.render(
  <Fragment>
    <p>Hello GGwp</p>
  </Fragment>
);
