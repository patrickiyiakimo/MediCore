import Spinner from "../shared/Spinner";

export default function IsLoading({ loading, children }) {
  return loading ? <Spinner /> : children;
}