"use client";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import { isInArray } from "../utils/utils";

interface State {
  list: Array<{
    id: string;
    title: string;
    loading: boolean;
    slide: number;
    data: any;
  }>;
  selected: number | null;
}

const initState: State = {
  list: [],
  selected: null,
};

const ReaderContext = createContext<{ state: State; dispatch: any }>({
  state: initState,
  dispatch: () => null,
});

function readerReducer(state: State, action: { type: String; payload?: any }) {
  switch (action.type) {
    case "AddItem":
      return {
        ...state,
        list: [
          ...state.list,
          {
            id: action.payload.id,
            title: action.payload.title,
            loading: true,
            slide: 0,
            data: {},
          },
        ],
      };
    case "addData":
      return {
        ...state,
        list: [
          ...state.list,
          {
            id: action.payload.id,
            title: action.payload.title,
            loading: false,
            slide: 0,
            data: action.payload,
          },
        ],
      };

    case "setData":
      console.log(action.payload);
      return {
        ...state,
        list: state.list.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                loading: false,
                data: action.payload,
              }
            : item
        ),
      };

    case "setSelected":
      return {
        ...state,
        selected: action.payload,
      };
    case "goToSlide":
      return {
        ...state,
        list: state.list.map((v, index) =>
          index !== state.selected
            ? v
            : {
                ...v,
                slide: action.payload,
              }
        ),
      };
    case "CLEAR":
      return initState;
    default:
      throw new Error("Unsupported action type");
  }
}

export const ReaderProvider = (props) => {
  const [state, dispatch] = useReducer(readerReducer, initState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <ReaderContext.Provider value={value} {...props} />;
};

export function useReaderContext() {
  const context = useContext(ReaderContext);
  if (!context)
    throw new Error("ReaderContext must be inside of ReaderProvider");
  const { state, dispatch } = context;

  function AddItemToList(id: string, title: string, data = null) {
    if (isInArray(state.list, id)) return;

    if (!data) {
      dispatch({
        type: "AddItem",
        payload: {
          id,
          title,
          data: {},
        },
      });

      fetch(`/api/collection/${id}`)
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: "setData",
            payload: data.collection,
          });
        });
    } else {
      dispatch({
        type: "addData",
        payload: data,
      });
    }
  }

  const setSelected = useCallback(
    (index: Number | null) => {
      dispatch({
        type: "setSelected",
        payload: index,
      });
    },
    [dispatch]
  );

  function goToSlide(slide: number) {
    dispatch({
      type: "goToSlide",
      payload: slide,
    });
  }

  return {
    state,
    AddItemToList,
    setSelected,
    goToSlide,
  };
}
