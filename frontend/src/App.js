import './App.css';
import {useState, useEffect} from 'react';
import {getDatabase, ref, set, onValue} from "firebase/database";
import Login from './Components/Login'
import app from './base'
import TemperatureGraph from "./Components/TemperatureGraph";
import HumidityGraph from "./Components/HumidityGraph";

import filled_eye_icon from './Icons/filled_eye.svg'
import light_bulb_icon from './Icons/light_bulb.svg'
import warning_icon from './Icons/warning-round.svg'

const initValues = {
    temperature: 0,
    humidity: 0,
    ldrs: {
        LDR_0: {
            position: "Cocina",
            value: 0
        },
        LDR_1: {
            position: "Cuarto_Principal",
            value: 0
        },
        LDR_2: {
            position: "Sala",
            value: 0
        }
    },
    leds: {
        LED_0: {
            ldr: "LDR_0",
            isOn: 0
        },
        LED_1: {
            ldr: "LDR_1",
            isOn: 0
        },
        LED_2: {
            ldr: "LDR_2",
            isOn: 0
        }
    },
    moveSensors: {
        PID_0: {
            position: "Cocina",
            value: 0
        },
        PID_1: {
            position: "Cuarto_Principal",
            value: 0
        },
        PID_2: {
            position: "Sala",
            value: 0
        }
    }
}

function App() {
    const [login, setLogin] = useState(false);
    const [userId, setUserId] = useState(null);

    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [moveSensors, setMoveSensors] = useState([]);
    const [ldrs, setLdrs] = useState([]);
    const [leds, setLeds] = useState([]);

    const positions = ["Cocina", "Cuarto_Principal", "Sala"]

    useEffect(() => {
        if (userId) {
            setLogin(false);
            const db = getDatabase(app);

            // Get general sensor data
            onValue(ref(db, `${userId}/`), (snapshot) => {
                const data = snapshot.val();
                if (data === null) {
                    set(ref(db, `${userId}/`), {
                        temperature: initValues.temperature,
                        humidity: initValues.humidity,
                    });

                    // LDRS
                    Object.entries(initValues.ldrs).forEach(ldr => {
                        set(ref(db, `${userId}/ldrs/${ldr[0]}/`), {
                            position: ldr[1].position,
                            value: ldr[1].value,
                        });
                    })

                    // LEDS
                    Object.entries(initValues.leds).forEach(led => {
                        set(ref(db, `${userId}/leds/${led[0]}/`), {
                            ldr: led[1].ldr,
                            isOn: led[1].isOn,
                        });
                    })

                    // Move Sensors
                    Object.entries(initValues.moveSensors).forEach(moveSensor => {
                        set(ref(db, `${userId}/moveSensors/${moveSensor[0]}/`), {
                            position: moveSensor[1].position,
                            value: moveSensor[1].value,
                        });
                    })


                    setTemperature(initValues.temperature);
                    setHumidity(initValues.humidity);

                    setMoveSensors(Object.entries(initValues.moveSensors));
                    setLdrs(Object.entries(initValues.ldrs));
                    setLeds(Object.entries(initValues.leds));

                } else {
                    setTemperature(data.temperature);
                    setHumidity(data.humidity);

                    setMoveSensors(Object.entries(data.moveSensors));
                    setLdrs(Object.entries(data.ldrs));
                    setLeds(Object.entries(data.leds));
                }
            });
        } else {
            setLogin(true);
        }
    }, [temperature, humidity, userId])

    const handleLightToggle = (led) => {
        const db = getDatabase(app);

        set(ref(db, `${userId}/leds/${led[0]}/`), {
            ldr: led[1].ldr,
            isOn: !led[1].isOn,
        });
    }

    return (
        <div className="App">
            {login ? <Login setUserId={setUserId} /> : ""}
            <div>
                <aside id="userId"><p>User ID: {userId}</p></aside>
                <div id="content">
                    <div className="horizontal-flex">
                        <TemperatureGraph value={[temperature]} />
                        <HumidityGraph value={[humidity]} />
                    </div>
                    <div className="horizontal-flex data-section-container">
                        {positions.map(position => {
                            let moveSensor, ldr, led;
                            if (moveSensors.length !== 0 && ldrs.length !== 0 && leds.length !== 0) {
                                moveSensor = moveSensors.filter(moveSensor => moveSensor[1].position === position)[0];
                                ldr = ldrs.filter(ldr => ldr[1].position === position)[0];
                                led = leds.filter(led => led[1].ldr === ldr[0])[0]

                                const warning = led[1].isOn && !moveSensor[1].value;

                                return (
                                    <div className="data-section">

                                        <aside className={warning ? "warning-section active" : "warning-section"}>
                                            <img src={warning_icon} alt="warning-icon" />
                                        </aside>
                                        <h3>{position.replace("_", " ")}</h3>
                                        <div className="data-icons">
                                            <div>
                                                <img src={filled_eye_icon}
                                                     className={moveSensor[1].value ? "active" : ""}
                                                     alt="Move Detection" />
                                            </div>
                                            <div>
                                                <img src={light_bulb_icon}
                                                     className={led[1].isOn ? "active" : ""}
                                                     alt="Light Status" />
                                            </div>
                                        </div>
                                        <button className={(warning ? " warning " : " ") + (led[1].isOn ? " active-led " : " ")}
                                                onClick={() => handleLightToggle(led)}>
                                            {!led[1].isOn ? "Encender Luz" : "Apagar Luz"}
                                        </button>

                                    </div>
                                )
                            }
                            return <></>
                        })}

                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
