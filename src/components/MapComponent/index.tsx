// "use client";

// import _ from "lodash";
// import dynamic from "next/dynamic";
// import { FC } from "react";

// const MapComponent = dynamic(() => import("@components/ViewMap/index"), {
//   ssr: false,
// });

// type locationValueType = { lat: number; lng: number };

// interface ViewMapProps {
//   /**
//    * @value This variable is used to store Latitude and longitude value in an array. Ex: [15,20]
//    */
//   value?: locationValueType;
//   /**
//    * @onChange This is a call back function, which return selected latitude and longitude.
//    */
//   onChange?: any;

//   /**
//    * @draggable This is a boolean which is responsible for movement of marker in map. If draggable is true then user can move the marker inside map else it is fixed.
//    */
//   draggable?: boolean;

//   /**
//    * @zoom Default zoom for the map.
//    */
//   zoom?: number;
// }

// export const MapPointer: FC<ViewMapProps> = ({
//   value = { lat: 0, lng: 0 },
//   onChange,
//   draggable = false,
//   zoom = 10,
// }) => {
//   return (
//     <MapComponent
//       value={value}
//       onChange={onChange}
//       draggable={draggable}
//       zoom={zoom}
//     />
//   );
// };
