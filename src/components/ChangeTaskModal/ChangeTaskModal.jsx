import "./ChangeTaskModal.css";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { useCallback, useState } from "react";
import edit from "../../img/icons8-edit.svg";
import { Button } from "../UI/Button/Button";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Grid } from "@material-ui/core";
import cross from "../../img/крестик.svg";
// import DateFnsUtils from "@date-io/date-fns";
import InputAdornment from "@material-ui/core/InputAdornment";
import close from "../../img/крестик.svg";
import {
  dateToString,
  timeToString,
  timeStringToDate,
} from "../../utils/dateConfig";
import { deleteTasks, updateTasks } from "../../store/actions/task";
import { useDispatch, useSelector } from "react-redux";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#cfb9a4",
    },
  },
});

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  "change-task-modal": {
    position: "absolute",
    width: 526,
    backgroundColor: "var(--main-bg-color)",
    padding: theme.spacing(2, 4, 4),
    outline: "none",
    borderRadius: "10px",
    border: "none",
  },
}));

export const ChangeTaskModal = ({ task }) => {
  const auth = useSelector((store) => store.auth);
  const { profile } = auth;
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const getTimeToState = (string) => {
    if (string.length === 0) {
      return null;
    }
    return timeStringToDate(string);
  };

  const [selectedText, setSelectedText] = useState(task.text);
  const [selectedComment, setSelectedComment] = useState(task.comment);
  const [selectedTime, setSelectedTime] = useState(getTimeToState(task.time));
  const [selectedDate, setSelectedDate] = useState(task.date.initDate);
  const [subtasks, setSubtasks] = useState(task.subtasks);

  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);

  const textChange = (event) => {
    setSelectedText(event.target.value);
  };
  const commentChange = (event) => {
    setSelectedComment(event.target.value);
  };
  const timeChange = (date) => {
    setSelectedTime(date);
  };
  const dateChange = (date) => {
    setSelectedDate(date);
  };

  const renderSubtasks = () =>
    subtasks.map((sub, i) => (
      <Grid item xs={4}>
        <TextField
          color="primary"
          label={`sub ${i + 1}`}
          value={subtasks[i].text}
          onChange={(e) => {
            const copy = subtasks.concat();
            copy[i] = { ...copy[i], text: e.target.value };
            setSubtasks(copy);
          }}
          defaultValue=""
          variant="outlined"
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <img
                  alt={""}
                  src={close}
                  onClick={() => {
                    const copy = [
                      ...subtasks.concat().slice(0, i),
                      ...subtasks.concat().slice(i + 1),
                    ];
                    setSubtasks(copy);
                  }}
                  className={"close-sub"}
                />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    ));

  const changeData = (e) => {
    const time = timeToString(selectedTime);
    let date;
    if (selectedDate === undefined) {
      date = dateToString(new Date());
    } else {
      date = dateToString(selectedDate);
    }

    e.preventDefault();
    const data = {};
    data[task.id] = {
      text: selectedText,
      subtasks: subtasks,
      comment: selectedComment,
      time: time,
      date: date,
      user: profile.username,
    };

    stableDispatch(updateTasks(data));
    setOpen(false);
  };

  const deleteData = (e) => {
    e.preventDefault();
    stableDispatch(deleteTasks(task.id));
    setOpen(false);
  };

  return (
    <div>
      <img alt="" src={edit} className={"edit-button"} onClick={handleOpen} />
      <Modal open={isOpen} onClose={handleClose} aria-labelledby="change-task">
        <div style={modalStyle} className={classes["change-task-modal"]}>
          <img
            alt={""}
            src={cross}
            className={"change-task-close"}
            onClick={() => setOpen(false)}
          />
          <h2 className={"change-task-title"}>task changing</h2>

          <form noValidate autoComplete="off" className={"change-task-form"}>
            <ThemeProvider theme={theme}>
              <Grid container spacing={2} alignContent={"space-around"}>
                <Grid item xs={12}>
                  <TextField
                    color="primary"
                    fullWidth
                    id="task-text"
                    label="task text"
                    variant="outlined"
                    margin="dense"
                    value={selectedText}
                    onChange={textChange}
                  />
                </Grid>

                <div className={"add-sub-block"} style={{ width: "100%" }}>
                  <input
                    onClick={(e) => {
                      e.preventDefault();
                      const copy = subtasks.concat();
                      copy.push("");
                      setSubtasks(copy);
                    }}
                    className={"add-sub"}
                    value={"add subtask"}
                    type={"button"}
                  />
                </div>

                {renderSubtasks()}

                <Grid item xs={12}>
                  <TextField
                    color="primary"
                    fullWidth
                    id="comment"
                    label="comment"
                    value={selectedComment}
                    onChange={commentChange}
                    multiline
                    rows={3}
                    defaultValue=""
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        margin="dense"
                        id="date"
                        label="select date"
                        format="dd/MM/yyyy"
                        value={selectedDate}
                        onChange={dateChange}
                        KeyboardButtonProps={{
                          "aria-label": "select date",
                        }}
                      />
                      <KeyboardTimePicker
                        margin="dense"
                        id="time"
                        label="select time"
                        value={selectedTime}
                        onChange={timeChange}
                        KeyboardButtonProps={{
                          "aria-label": "select time",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            </ThemeProvider>

            <div className={"button-block"}>
              <Button
                text={"save"}
                type={"submit"}
                size={"thin"}
                color={"primary"}
                onClick={changeData}
              />
              <Button
                text={"delete"}
                type={"submit"}
                size={"thin"}
                color={"primary"}
                onClick={deleteData}
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
