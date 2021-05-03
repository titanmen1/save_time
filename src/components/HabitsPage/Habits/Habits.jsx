import './Habits.css'
import { Habit } from '../Habit/Habit'
import { CalendarButton } from '../CalendarButton/CalendarButton'
import { useState } from 'react';
import { dateToString } from '../../utils/dateToString'


export const Habits = ({habits}) => {

    const day = new Date()
    const dayString = dateToString(new Date())
    const [date, setDate] = useState({dayString, day});

    return (
        <div className={'habits'}>
            <div className={'habits-date'} >
                <p>{date.dayString}</p>
                <CalendarButton setDate={setDate} value={date}/>
            </div>
            <div className={'habits-list'} >
                {habits.map((habit, index) => <Habit text={habit.text} key={index}/>)}
            </div>
        </div>
    )
}