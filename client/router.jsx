import { createBrowserRouter } from "react-router";
import RootLayout from "./src/layouts/RootLayout";
import Home from "./src/pages/home/Home";
import Pricing from "./src/pages/pricing/Pricing";
import Host from "./src/pages/host/Host";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "host",
        Component: Host,
      },
      {
        path: "pricing",
        Component: Pricing,
      },
    ],
  },
]);

export default router;
