import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function App() {
  const [newCityInput, setNewCityInput] = useState(" ")
  const [tempNewCityName, setTempNewCityName] = useState(" ")
  const [temperatureData, setTemperatureData] = useState([])
  const [timeData, setTimeData] = useState([])
  const [temperatureTimeMapping, setTemperatureTimeMapping] = useState([])
  const [currCities, setCurrCities] = useState(["Austin", "Dallas", "Houston"])


  useEffect(() => {
    if (!currCities.includes(newCityInput) && newCityInput !== " " && newCityInput !== null) {
      console.log(newCityInput)
      let tempCitiesList = [newCityInput, currCities[0], currCities[1]]
      setCurrCities(tempCitiesList)
    }
  }, [newCityInput])

  useEffect(() => {
    // Function to fetch initial data and populate temperatureTimeMapping
    const fetchInitialData = async () => {
      try {
        // Fetch initial data from an API or any other source
        await getCityWeather("Austin")
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);



  const getCityCoordinates = async (cityName) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const url = "https://api.api-ninjas.com/v1/geocoding?city=" + cityName + "&X-Api-Key=bDu6voS6h87z3Rf/cW9YSA==UJdEroQInPo9dItd"
    var json = "{[]}"

    try {
      const response = await fetch(url, requestOptions)
      json = await response.json()
      return ([json[0]['latitude'], json[0]['longitude']])
    } catch (err) {
      console.log(err)
    }
  }

  const getCityWeather = async (cityName) => {
    let [latitude, longitude] = await getCityCoordinates(cityName)

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    var url = "https://api.open-meteo.com/v1/gfs?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=auto"

    try {
      const response = await fetch(url, requestOptions)
      var json = await response.json()

      // set up the time and weather dictionaries
      var formattedTimeData = json.hourly.time.map(timeString => timeString.slice(-5))
      setTimeData(formattedTimeData)

      var formattedTemperatureData = json.hourly.temperature_2m
      setTemperatureData(formattedTemperatureData)

      const temporaryList = [];
      for (let i = 0; i < 10; i++) {
        let pair = { temperature: String(formattedTemperatureData[i]), time: formattedTimeData[i] }
        //console.log(pair)
        temporaryList.push(pair);
      }

      console.log(temporaryList[0].toString())
      // // temporary list is just fine 

      setTemperatureTimeMapping(temporaryList)
      // Tested with a useEffect, seems to be doing fine for temperature and time

    } catch (err) {
      console.log(err)
    }

  }


  return (
    <div >

      <Container className="p-5">

        <Row>
          <Col xs={4}>
            <Button variant="primary" onClick={() => getCityWeather(currCities[0])}>{currCities[0]}</Button>
          </Col>
          <Col xs={4}>
            <Button variant="primary" onClick={() => getCityWeather(currCities[1])}>{currCities[1]}</Button>
          </Col>
          <Col xs={4}>
            <Button variant="primary" onClick={() => getCityWeather(currCities[2])}>{currCities[2]}</Button>
          </Col>
        </Row>


        <Row className="mt-3 pt-3">
          <Col xs={9}>
            <Form.Control
              type="text"
              placeholder="Enter City Name"
              onChange={e => {
                setTempNewCityName(e.target.value)
              }}
            />
          </Col>
          <Col>
            <Button
              variant="outline-success"
              onClick={() => {
                getCityWeather(newCityInput)
                setNewCityInput(tempNewCityName);

              }}
            > +
            </Button>
          </Col>
        </Row>


        <Row className="pt-5"> 
          <Col xs={6}> 
            <h3>Time</h3>
          </Col>
          <Col xs={6}> 
            <h3>Time</h3>
          </Col>
        </Row>
        <div>
          {
            temperatureTimeMapping.length > 0 ? (
              temperatureTimeMapping.map((item, index) => (
                <Row>
                  <Col xs={6}> 
                      <p>{item.time}</p>
                  </Col>
                  <Col xs={6}> 
                      <p>{item.temperature + " F"}</p>
                  </Col>
                </Row>
               
              ))

            ) : (<h4>Loading...</h4>)
          }

        </div>

      </Container>
    </div>
  );
}

export default App;
