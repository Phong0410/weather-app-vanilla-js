const Weather = {
	init() {
		this.searchElement = document.querySelector("#weather-app .search-input")
		this.cityNameElement = document.querySelector("#weather-app .city-name")
		this.weatherStateElement = document.querySelector("#weather-app .weather-state")
		this.weatherIconElement = document.querySelector("#weather-app .weather-icon")
		this.temperatureElement = document.querySelector("#weather-app .temperature")
		this.sunriseTimeElement = document.querySelector("#weather-app .sunrise")
		this.sunsetTimeElement = document.querySelector("#weather-app .sunset")
		this.humidityElement = document.querySelector("#weather-app .humidity")
		this.windSpeedElement = document.querySelector("#weather-app .wind-speed")

		this.location = localStorage.getItem("location") || undefined
		this.data = undefined

		if (this.location) {
			fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${this.location}&appid=355c962b6cf7497827811564a5a8819a&units=metric`
			).then(async (res) => {
				const data = await res.json()
				this.data = data

				this.render(data)
			})
		}
	},

	listenEvent() {
		this.searchElement.addEventListener("keyup", (event) => {
			if (event.key === "Enter") {
				fetch(
					`https://api.openweathermap.org/data/2.5/weather?q=${event.target.value.trim()}&appid=355c962b6cf7497827811564a5a8819a&units=metric`
				).then(async (res) => {
					const data = await res.json()
					if (data.cod === 200) {
						this.location = data["name"]
						this.data = data
						this.searchElement.value = ""
						this.searchElement.blur()

						this.render(data)

						localStorage.setItem("location", this.location)
					} else if (data.cod === "404") {
						alert("Cannot find location!")
					}
				})
			}
		})

		window.addEventListener("keyup", (event) => {
			if (event.key === "Enter") {
				this.searchElement.focus()
			}
		})
	},

	render(data) {
		this.cityNameElement.innerText = data.name
		this.weatherStateElement.innerText =
			data.weather[0].description.charAt(0).toUpperCase() +
			data.weather[0].description.slice(1)
		this.weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
		this.temperatureElement.innerText = data.main.temp
		this.sunriseTimeElement.innerText = moment
			.unix(data.sys.sunrise)
			.format("HH:mm")
		this.sunsetTimeElement.innerText = moment
			.unix(data.sys.sunset)
			.format("HH:mm")
		this.humidityElement.innerText = data.main.humidity
		this.windSpeedElement.innerText = (data.wind.speed * 3.6).toFixed(2)
	},

	run() {
		this.init()
		this.listenEvent()

		this.searchElement.focus()
	}
}

export default Weather