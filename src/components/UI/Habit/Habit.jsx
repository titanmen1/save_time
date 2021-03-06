import "./Habit.css";
import { ChangeHabitModal } from "../../ChangeHabitModal/ChangeHabitModal";
import { updateHabits } from "../../../store/actions/task";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

export const Habit = ({
  habitText,
  habitId,
  habitStat,
  habitDate,
  dayString,
}) => {
  const [check, setCheck] = useState(false);
  const cls = ["habit-text"];
  if (check) cls.push("done");

  useEffect(() => {
    if (habitDate.indexOf(dayString) != -1) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [dayString]);

  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);

  const auth = useSelector((store) => store.auth);
  const { profile } = auth;

  const updateState = (e) => {
    setCheck(check);
    const data = {};
    if (habitDate.indexOf(dayString) != -1) {
      habitDate = habitDate.filter((item) => {
        if (item !== dayString) return item;
      });
    } else {
      habitDate.push(dayString);
    }
    const stat = Number(habitDate.length * 3.2).toFixed(1);
    data[habitId] = {
      text: habitText,
      stat: stat,
      user: profile.username,
      date: habitDate,
    };
    stableDispatch(updateHabits(data));
    return true;
  };

  return (
    <div className={"habit"}>
      <input
        type={"checkbox"}
        className={"checkbox"}
        checked={check}
        onClick={updateState}
      />
      <span className={cls.join(" ")}>{habitText}</span>
      <ChangeHabitModal
        habitText={habitText}
        habitId={habitId}
        habitStat={habitStat}
      />
    </div>
  );
};
