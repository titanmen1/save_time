import axios from "axios";
import {
  AUTH_SUCCESS,
  GET_HABITS_SUCCESS,
  GET_TASK_SUCCESS,
  SET_TASK_SUCCESS,
} from "./actionType";
import "firebase/auth";

const baseURL =
  "https://savetime-a7a7c-default-rtdb.firebaseio.com/";

export const getTaskSuccess = (tasks) => {
  return {
    type: GET_TASK_SUCCESS,
    payload: tasks,
  };
};

export const getHabitsSuccess = (habits) => {
  return {
    type: GET_HABITS_SUCCESS,
    payload: habits,
  };
};

export const setTaskSuccess = (tasks) => {
  return {
    type: SET_TASK_SUCCESS,
    payload: tasks,
  };
};

export const getAuth = (profile) => {
  return {
    type: AUTH_SUCCESS,
    payload: profile,
  };
};

export const checkAuth = () => async (dispatch) => {
  if (sessionStorage.getItem("profile")) {
    dispatch(getAuth(JSON.parse(sessionStorage.getItem("profile"))));
  }
};

export const Auth = (data) => async (dispatch) => {
  let flag = false;
  axios.get(baseURL + "user.json").then((res) => {
    for (let key in res.data) {
      if (
        res.data[key].email === data.email &&
        res.data[key].password === data.password
      ) {
        flag = true;
        dispatch(getAuth(res.data[key]));
        sessionStorage.setItem("profile", JSON.stringify(res.data[key]));
      }
    }
    if (!flag) {
      alert("Логин или пароль не верный");
    }
  });
};

export const getTasks = () => async (dispatch) => {
  axios.get(baseURL + "tasks.json").then((res) => {
    const data = [];
    for (let key in res.data) {
      if ("subtasks" in res.data[key]) {
        res.data[key].id = key;
        data.push(res.data[key]);
      } else {
        res.data[key].id = key;
        res.data[key].subtasks = [];
        data.push(res.data[key]);
      }
    }
    dispatch(getTaskSuccess(data));
    setTimeout(() => window.scrollTo(0, 0), 0);
  });
};

export const setTasks = (data) => async (dispatch) => {
  axios.post(baseURL + "tasks.json", data).then((res) => {
    dispatch(getTasks());
    window.location.reload();
  });
};

export const updateTasks = (data) => async (dispatch) => {
  axios.patch(baseURL + "tasks.json", data).then((res) => {
    dispatch(getTasks());
  });
};

export const deleteTasks = (data) => async (dispatch) => {
  axios.delete(baseURL + "tasks/" + data + ".json").then((res) => {
    dispatch(getTasks());
  });
};

export const getHabits = () => async (dispatch) => {
  axios.get(baseURL + "habits.json").then((res) => {
    const data = [];
    for (let key in res.data) {
      res.data[key].id = key;
      if ("date" in res.data[key]) {
        const array_date = [];
        for (let date_key in res.data[key]["date"]) {
          if (res.data[key]["date"][date_key] !== null) {
            array_date.push(res.data[key]["date"][date_key]);
          }
        }
        res.data[key].date = array_date;
      } else {
        res.data[key].date = [];
      }
      data.push(res.data[key]);
    }
    dispatch(getHabitsSuccess(data));
  });
};

export const setHabits = (data) => async (dispatch) => {
  axios.post(baseURL + "habits.json", data).then((res) => {
    dispatch(getHabits());
  });
  window.location.reload();
};

export const updateHabits = (data) => async (dispatch) => {
  axios.patch(baseURL + "habits.json", data).then((res) => {
    dispatch(getHabits());
    window.location.reload();
  });
};

export const deleteHabits = (data) => async (dispatch) => {
  axios.delete(baseURL + "habits/" + data + ".json").then((res) => {
    dispatch(getHabits());
  });
};
