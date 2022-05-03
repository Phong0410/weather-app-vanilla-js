const Forecast = {
	init() {
		this.searchElement = document.querySelector("#search-input")
		this.cityNameElement = document.querySelector(".city-name")
		this.dateElement = document.querySelector("#date")
		this.timeElement = document.querySelector("#time")
		this.weatherStateElement = document.querySelector(".weather-state")
		this.weatherIconElement = document.querySelector(".weather-icon")
		this.temperatureElement = document.querySelector(".temperature")
		this.sunriseTimeElement = document.querySelector(".sunrise")
		this.sunsetTimeElement = document.querySelector(".sunset")
		this.humidityElement = document.querySelector(".humidity")
		this.windSpeedElement = document.querySelector(".wind-speed")
		this.switchBtnLeft = document.querySelector("#btnLeft")
		this.switchBtnRight = document.querySelector("#btnRight")

		this.location = localStorage.getItem("location") || "Ho Chi Minh"
		this.data = undefined
		this.forecastData = undefined
		this.forecastIndex = 0

		if (this.location) {
			fetch(
				`https://api.openweathermap.org/data/2.5/forecast?q=${this.location}&appid=355c962b6cf7497827811564a5a8819a&units=metric`
			).then(async (res) => {
				const data = await res.json()
				this.data = data
				this.forecastData = this.getForecastData(this.data)

				this.renderStaticInfo(this.data)
				this.render(this.forecastData[this.forecastIndex])
			})
		}
	},

	listenEvent() {
		window.addEventListener("keyup", (event) => {
			if (event.key === "Enter") {
				this.searchElement.focus()
			}
		})

		this.searchElement.addEventListener("keyup", (event) => {
			if (event.key === "Enter") {
				fetch(
					`https://api.openweathermap.org/data/2.5/forecast?q=${event.target.value.trim()}&appid=355c962b6cf7497827811564a5a8819a&units=metric`
				).then(async (res) => {
					const data = await res.json()
					if (data.cod === "200") {
						this.location = data.city.name
						this.data = data
						this.forecastData = this.getForecastData(this.data)
						this.searchElement.value = ""
						this.searchElement.blur()

						this.renderStaticInfo(this.data)
						this.render(this.forecastData[this.forecastIndex])

						localStorage.setItem("location", this.location)
					} else if (data.cod === "404") {
						alert("Cannot find location!")
					}
				})
			}
		})

		this.switchBtnLeft.addEventListener("click", () => {
			if (this.forecastIndex > 0) {
				this.forecastIndex--

				this.render(this.forecastData[this.forecastIndex])
			}
		})

		this.switchBtnRight.addEventListener("click", () => {
			if (this.forecastIndex < 23) {
				this.forecastIndex++

				this.render(this.forecastData[this.forecastIndex])
			}
		})
	},

	getForecastData(data) {
		const forecastDate = this.getForecastDates()
		const forecastData = []

		data.list.forEach((item) => {
			forecastDate.forEach((date) => {
				if (item.dt_txt.slice(0, 10) === date) {
					forecastData.push(item)
				}
			})
		})

		return forecastData
	},

	getForecastDates() {
		const nextDates = []
		for (let i = 1; i <= 3; i++) {
			nextDates.push(moment().add(i, "days").format().slice(0, 10))
		}

		return nextDates
	},

	renderStaticInfo(data) {
		this.cityNameElement.innerText = data.city.name
		this.sunriseTimeElement.innerText = moment
			.unix(data.city.sunrise)
			.format("HH:mm")
		this.sunsetTimeElement.innerText = moment
			.unix(data.city.sunset)
			.format("HH:mm")
	},

	render(data) {
		this.dateElement.innerText = data.dt_txt
			.slice(0, 10)
			.split("-")
			.reverse()
			.join("/")
		this.timeElement.innerText = data.dt_txt.slice(10, 16)
		this.weatherStateElement.innerText =
			data.weather[0].description.charAt(0).toUpperCase() +
			data.weather[0].description.slice(1)
		this.weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
		this.temperatureElement.innerText = data.main.temp
		this.humidityElement.innerText = data.main.humidity
		this.windSpeedElement.innerText = (data.wind.speed * 3.6).toFixed(2)
	},

	run() {
		this.init()
		this.listenEvent()

		this.searchElement.focus()
	}
}

Forecast.run()
