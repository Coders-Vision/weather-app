import React, { useEffect } from "react"
import '../style/flex-layout.css'
import '../style/grid-layout.css'
import '../style/owfont-regular.css'
import moment from 'moment'

const Forecast = ({ weatherData }, ...props) => {

    const ExtractDateTime = (date) => {
        let newDate = new Date();
        const weekday = date * 1000
        newDate.setTime(weekday)
        return newDate
    }



    const showWeeklyData = () => {
        return weatherData.slice(2).map((val, key) => {
            return (
                <div className="days" key={key}>
                    <div className="day-name">{moment(ExtractDateTime(val.dt)).format(`dddd`)}</div>
                    <div className="day-time">{moment(ExtractDateTime(val.dt)).format(`MMMM Do,h:mm a`)}</div>
                    <div className={`day-icon owf owf-${val.weather[0].id}`}></div>
                    <div className="day-temp">{Math.floor(val.main.temp)}°c</div>
                    <div className="temp-sky">{val.weather[0].main}</div>
                </div>
            )
        })


    }

    return (
        <div className="container">
            <div className="today">
                <div className="temp-info">
                    <div className="temp-place">{weatherData[0].name},<strong>{weatherData[0].country}</strong></div>
                    <div className="temp-degree">{Math.floor(weatherData[1].main.temp)}°c</div>
                    <div className={`temp-icon owf owf-${weatherData[1].weather[0].id} `}></div>
                    <div className="temp-sky">{weatherData[1].weather[0].main}</div>
                    <div className="date">{moment(ExtractDateTime(weatherData[1].dt)).format(`dddd,MMMM Do`)}</div>
                </div>
            </div>
            {showWeeklyData()}
        </div>
    )
}
export default Forecast