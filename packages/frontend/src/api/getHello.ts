import { isString } from "lodash";
import { axios } from "./axios";

export function getHello(): Promise<string> {
  return axios.get("./").then(({ data }) => {
    if (!isString(data)) {
      throw new TypeError();
    }
    return data;
  });
}
