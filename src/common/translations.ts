import _ from "lodash";

export const en = "en"

export const optionValue = (name :  object) => {
return _.get(name,en);
}