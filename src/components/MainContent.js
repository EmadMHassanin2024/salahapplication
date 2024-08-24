import Grid from '@mui/material/Grid';
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Prayer from './Prayer';
import moment from 'moment';



import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";
import axios from "axios";
import { useState,useEffect} from 'react';

import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function MainContent ()  {
	
	//States
	
	const [remainTime,setRemainTime]=useState("");
	const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
	const [today,setToday]=useState("");
	const [selectCity,setSelectCity]=useState(	{
		displayName: "مكة المكرمة",
		apiName: "Makkah al Mukarramah",});
	const [timing ,setTiming]=useState({
		"Fajr": "03:57",
		"Dhuhr": "12:59",
		  "Asr": "16:55",
		  "Maghrib": "20:12",
		  "Isha": "22:02",
	});
	const avilableCities = [
		{
			displayName: "مكة المكرمة",
			apiName: "Makkah al Mukarramah",
		},
		{
			displayName: "الرياض",
			apiName: "Riyadh",
		},
		{
			displayName: "الدمام",
			apiName: "Dammam",
		},
		{
			displayName: "جدة",
			apiName: "Jeddah",
		},
	];

	const prayersArray = [
		{ key: "Fajr", displayName: "الفجر" },
		{ key: "Dhuhr", displayName: "الظهر" },
		{ key: "Asr", displayName: "العصر" },
		{ key: "Sunset", displayName: "المغرب" },
		{ key: "Isha", displayName: "العشاء" },
	];
	const getTimings=async()=>{
		console.log("calling the api");
		const response =await 	axios.get
		(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectCity.apiName}`);
		setTiming(response.data.data.timings);
	}
	useEffect((event)=>{
	getTimings();
	setToday(moment().format("MMM Do YYYY | h:mm"));
	},[selectCity]);
	
useEffect(()=>{
	let Interval= setInterval(() => {
		console.log("calling timing");
	setupCountdownTimer();
	}, 1000);
    return()=>{
   	clearInterval(Interval);
   }

},[timing]);
const setupCountdownTimer=()=>{
	const momentNow=moment();
	let prayerIndex = 2;

		if (
			momentNow.isAfter(moment(timing["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timing["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1;
		} else if (
			momentNow.isAfter(moment(timing["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timing["Asr"], "hh:mm"))
		) {
			prayerIndex = 2;
		} else if (
			momentNow.isAfter(moment(timing["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timing["Sunset"], "hh:mm"))
		) {
			prayerIndex = 3;
		} else if (
			momentNow.isAfter(moment(timing["Sunset"], "hh:mm")) &&
			momentNow.isBefore(moment(timing["Isha"], "hh:mm"))
		) {
			prayerIndex = 4;
		} else {
			prayerIndex = 0;
		}
     setNextPrayerIndex(prayerIndex);


	 //now after knowing what the next prayer id we can set up the countdown timer by geting the prayer,s time
	 const nextPrayerObject=prayersArray[prayerIndex];
	 //console.log("Test.... nextPrayerObject",nextPrayerObject);
	 const nextPrayerTime=timing[nextPrayerObject.key];
	 const nextPrayerTimemoment=moment(nextPrayerTime,"hh:mm");
	  console.log("nextPrayerTime isss",nextPrayerTime);
	let remainingTime=moment(nextPrayerTime,"hh:mm").diff(momentNow);
    console.log("Test....remainingTime iss",remainingTime);
if(remainingTime<0){
	const midnightDiff=moment("23:59:59","hh:mm:ss").diff(momentNow);
	const fajrToMidnightDiff=nextPrayerTimemoment.diff
	(moment("00:00:00","hh:mm:ss"));
	console.log("the diff",fajrToMidnightDiff);

	const totalDiffrence = midnightDiff+fajrToMidnightDiff;
	remainingTime=totalDiffrence;
}

	 const durationRemainingTime=moment.duration(remainingTime);
   setRemainTime(
    `${durationRemainingTime.seconds()}:
	${durationRemainingTime.minutes()}:
	${durationRemainingTime.hours()}
	`

   )

	 console.log( "duration is ",durationRemainingTime.hours(), 
	 durationRemainingTime.minutes(),
	 durationRemainingTime.seconds());
	 const Isha=timing["Isha"];
	const Ishamoment= moment(Isha,"hh:mm");
	console.log(momentNow.isBefore(Ishamoment));

 }
    const handleCityChange = (event) => {
	const CityObject= avilableCities.find((city)=>{
		return city.apiName==event.target.value
	})
		console.log("the new value is", event.target.value);
		setSelectCity(CityObject);
	
	};

    return (
        <>
        	{/* TOP ROW */}
       <Grid container style={{marginTop:"20px"}}>
        <Grid xs={6}>
            <h2>{today}</h2>
            <h2>{selectCity.displayName}</h2>

        </Grid>
        <Grid xs={6}>
           <h2> متبقي حتى صلاة{prayersArray[nextPrayerIndex].displayName} </h2>
            <h2 > {remainTime} </h2>
  
        </Grid>
            
       </Grid>
       	{/* TOP ROW */}
       <Divider style={{ borderColor: "Green", opacity: "0.1"   }} />

       
			{/* PRAYERS CARDS */}
			<Stack
				direction="row"
				justifyContent={"space-around"}
				style={{ marginTop: "50px" }}
			>
			<Prayer name="الفجر" time={timing.Fajr} image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"/>
            <Prayer name="الظهر " time={timing.Dhuhr} image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"/>
            <Prayer name="العصر " time={timing.Asr} image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf" />
            <Prayer name="المغرب " time={timing.Maghrib} image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"/>
            <Prayer name="العشاء " time={timing.Isha} image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d" />
			
			</Stack>
			{/*== PRAYERS CARDS ==*/}

            		{/* SELECT CITY */}
			<Stack
				direction="row"
				justifyContent={"center"}
				style={{ marginTop:"40px"}}>
				<FormControl style={{ width:"20%"}}>
					<InputLabel id="demo-simple-select-label">
						<span style={{ color: "Green" }}>المدينة</span>
					</InputLabel>
					<Select
				 
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						//value={selectCity}
						label="Age"
						onChange={handleCityChange}
					>
						{avilableCities.map((city)=>{
							return (
								<MenuItem 
								key={city.apiName}
								value={
									city.apiName
								   }>
									{city.displayName}
								   </MenuItem>

							);

						})}
					
					</Select>
				</FormControl>
			</Stack>

			{/* SELECT CITY */}
		
        </>
    );
}

 
