import React from "react";

interface NewCourseContextType {
  isNewCourseEditedRef: React.MutableRefObject<boolean>;
}

/**
 * It is a context where we can use for whole new course
 * Right now we are using for one ref to change to true when user start editing form
 */
export const NewCourseContext = React.createContext({
  isNewCourseEditedRef: React.createRef(),
} as NewCourseContextType);

/**
 * This is a custom hook where it will provide access to the NewCourseContext
 * @returns the NewCourseContext
 */
export const useNewCourseContext = () => React.useContext(NewCourseContext);
